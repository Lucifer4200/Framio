<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{
    public function index(): JsonResponse
    {
        $user = auth()->user();
        $orders = Order::where('user_id', $user->id)
            ->with('items.product:id,name,slug')
            ->latest()
            ->get();

        return response()->json(['orders' => $orders]);
    }

    public function show($id): JsonResponse
    {
        $user = auth()->user();
        $order = Order::with('items.product:id,name,slug')->find($id);

        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        if ($order->user_id !== $user->id && !$user->isAdmin()) {
            return response()->json(['error' => 'Access denied'], 403);
        }

        return response()->json(['order' => $order]);
    }

    public function store(): JsonResponse
    {
        $user = auth()->user();
        $data = request()->validate([
            'shipping_address' => 'required|string',
            'billing_address' => 'required|string',
            'phone' => 'nullable|string|max:20',
            'notes' => 'nullable|string',
            'payment_status' => 'nullable|in:pending,paid,failed,refunded',
            'order_status' => 'nullable|in:pending,confirmed,processing,shipped,delivered,cancelled',
        ]);

        $cart = Cart::where('user_id', $user->id)->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['error' => 'Cart is empty'], 400);
        }

        $cart->load('items.product');

        $orderData = [
            'user_id' => $user->id,
            'order_number' => Order::generateOrderNumber(),
            'total_amount' => $cart->total,
            'payment_status' => $data['payment_status'] ?? 'pending',
            'order_status' => $data['order_status'] ?? 'pending',
            'shipping_address' => $data['shipping_address'],
            'billing_address' => $data['billing_address'],
            'phone' => $data['phone'] ?? null,
            'notes' => $data['notes'] ?? null,
        ];

        $order = Order::create($orderData);

        foreach ($cart->items as $item) {
            $order->items()->create([
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'price' => $item->price,
            ]);

            $item->product->decrement('stock', $item->quantity);
        }

        $cart->items()->delete();

        $order->load('items.product:id,name,slug');

        return response()->json([
            'message' => 'Order created successfully',
            'order' => $order,
        ], 201);
    }

    public function updateStatus($id): JsonResponse
    {
        $data = request()->validate([
            'status' => 'required|in:pending,confirmed,processing,shipped,delivered,cancelled',
        ]);

        $order = Order::find($id);

        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        $order->update(['order_status' => $data['status']]);

        return response()->json([
            'message' => 'Order status updated successfully',
            'order' => $order->fresh()->load('items.product:id,name,slug'),
        ]);
    }
}
