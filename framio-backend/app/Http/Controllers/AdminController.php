<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function dashboard(): JsonResponse
    {
        $totalSales = Order::where('payment_status', 'paid')->sum('total_amount');
        $totalOrders = Order::count();
        $totalCustomers = User::where('role', 'customer')->count();
        $totalProducts = Product::count();

        $recentOrders = Order::with('user:id,name')
            ->latest()
            ->take(10)
            ->get(['id', 'user_id', 'order_number', 'total_amount', 'order_status', 'created_at']);

        $bestSelling = DB::table('products as p')
            ->join('order_items as oi', 'p.id', '=', 'oi.product_id')
            ->join('orders as o', 'oi.order_id', '=', 'o.id')
            ->where('o.payment_status', 'paid')
            ->select('p.name', 'p.slug', DB::raw('SUM(oi.quantity) as total_sold'), DB::raw('SUM(oi.quantity * oi.price) as revenue'))
            ->groupBy('p.id', 'p.name', 'p.slug')
            ->orderByDesc('total_sold')
            ->take(5)
            ->get();

        $ordersByStatus = Order::select('order_status', DB::raw('COUNT(*) as count'))
            ->groupBy('order_status')
            ->get()
            ->pluck('count', 'order_status');

        return response()->json([
            'total_sales' => (float) $totalSales,
            'total_orders' => $totalOrders,
            'total_customers' => $totalCustomers,
            'total_products' => $totalProducts,
            'recent_orders' => $recentOrders,
            'best_selling_products' => $bestSelling,
            'orders_by_status' => $ordersByStatus,
        ]);
    }

    public function salesReport(): JsonResponse
    {
        $startDate = request('start_date', now()->startOfMonth()->toDateString());
        $endDate = request('end_date', now()->endOfMonth()->toDateString());

        $sales = Order::where('payment_status', 'paid')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(total_amount) as total'), DB::raw('COUNT(*) as orders'))
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get();

        return response()->json(['sales' => $sales]);
    }

    public function productReport(): JsonResponse
    {
        $products = Product::withCount(['orderItems as order_count', 'orderItems as total_sold' => function ($q) {
            $q->select(DB::raw('COALESCE(SUM(quantity), 0)'))
              ->whereHas('order', fn($q) => $q->where('payment_status', 'paid'));
        }])->orderByDesc('total_sold')->get();

        return response()->json(['products' => $products]);
    }

    public function customerReport(): JsonResponse
    {
        $customers = User::where('role', 'customer')
            ->withCount(['orders as order_count' => fn($q) => $q->where('payment_status', 'paid')])
            ->withSum(['orders as total_spent' => fn($q) => $q->where('payment_status', 'paid')], 'total_amount')
            ->orderByDesc('total_spent')
            ->get();

        return response()->json(['customers' => $customers]);
    }

    public function allOrders(): JsonResponse
    {
        $orders = Order::with('user:id,name,email', 'items.product:id,name,slug')
            ->latest()
            ->get();

        return response()->json(['orders' => $orders]);
    }

    public function allCustomers(): JsonResponse
    {
        $customers = User::where('role', 'customer')
            ->withCount('orders')
            ->latest()
            ->get();

        return response()->json(['customers' => $customers]);
    }
}
