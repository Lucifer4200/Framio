<?php

namespace App\Http\Controllers;

use App\Helpers\Database;
use App\Helpers\Auth;

class AdminController
{
    public function dashboard()
    {
        $user = Auth::requireAdmin();
        
        // Get total sales
        $totalSales = Database::fetchOne("
            SELECT SUM(total_amount) as total 
            FROM orders 
            WHERE payment_status = 'paid'
        ");
        
        // Get total orders
        $totalOrders = Database::fetchOne("SELECT COUNT(*) as count FROM orders");
        
        // Get total customers
        $totalCustomers = Database::fetchOne("SELECT COUNT(*) as count FROM users WHERE role = 'customer'");
        
        // Get total products
        $totalProducts = Database::fetchOne("SELECT COUNT(*) as count FROM products");
        
        // Get recent orders
        $recentOrders = Database::fetchAll("
            SELECT o.*, u.name as customer_name 
            FROM orders o 
            JOIN users u ON o.user_id = u.id 
            ORDER BY o.created_at DESC 
            LIMIT 10
        ");
        
        // Get best selling products
        $bestSelling = Database::fetchAll("
            SELECT p.name, p.slug, SUM(oi.quantity) as total_sold, SUM(oi.quantity * oi.price) as revenue
            FROM products p
            JOIN order_items oi ON p.id = oi.product_id
            JOIN orders o ON oi.order_id = o.id
            WHERE o.payment_status = 'paid'
            GROUP BY p.id
            ORDER BY total_sold DESC
            LIMIT 5
        ");
        
        // Get orders by status
        $ordersByStatus = Database::fetchAll("
            SELECT order_status, COUNT(*) as count 
            FROM orders 
            GROUP BY order_status
        ");
        
        echo json_encode([
            'total_sales' => $totalSales['total'] ?? 0,
            'total_orders' => $totalOrders['count'] ?? 0,
            'total_customers' => $totalCustomers['count'] ?? 0,
            'total_products' => $totalProducts['count'] ?? 0,
            'recent_orders' => $recentOrders,
            'best_selling_products' => $bestSelling,
            'orders_by_status' => $ordersByStatus
        ]);
    }
    
    public function salesReport()
    {
        $user = Auth::requireAdmin();
        
        $filters = $_GET;
        $startDate = $filters['start_date'] ?? date('Y-m-01');
        $endDate = $filters['end_date'] ?? date('Y-m-t');
        
        $sales = Database::fetchAll("
            SELECT DATE(created_at) as date, SUM(total_amount) as total, COUNT(*) as orders
            FROM orders
            WHERE payment_status = 'paid'
            AND created_at BETWEEN ? AND ?
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        ", [$startDate, $endDate]);
        
        echo json_encode(['sales' => $sales]);
    }
    
    public function productReport()
    {
        $user = Auth::requireAdmin();
        
        $products = Database::fetchAll("
            SELECT p.*, COUNT(oi.id) as order_count, SUM(oi.quantity) as total_sold
            FROM products p
            LEFT JOIN order_items oi ON p.id = oi.product_id
            LEFT JOIN orders o ON oi.order_id = o.id AND o.payment_status = 'paid'
            GROUP BY p.id
            ORDER BY total_sold DESC
        ");
        
        echo json_encode(['products' => $products]);
    }
    
    public function customerReport()
    {
        $user = Auth::requireAdmin();
        
        $customers = Database::fetchAll("
            SELECT u.*, COUNT(o.id) as order_count, SUM(o.total_amount) as total_spent
            FROM users u
            LEFT JOIN orders o ON u.id = o.user_id AND o.payment_status = 'paid'
            WHERE u.role = 'customer'
            GROUP BY u.id
            ORDER BY total_spent DESC
        ");
        
        echo json_encode(['customers' => $customers]);
    }
    
    public function allOrders()
    {
        $user = Auth::requireAdmin();
        
        $filters = $_GET;
        $orders = Database::fetchAll("
            SELECT o.*, u.name as customer_name, u.email as customer_email
            FROM orders o
            JOIN users u ON o.user_id = u.id
        ");
        
        foreach ($orders as &$order) {
            $order['items'] = Database::fetchAll("
                SELECT oi.*, p.name, p.slug
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                WHERE oi.order_id = ?
            ", [$order['id']]);
        }
        
        echo json_encode(['orders' => $orders]);
    }
    
    public function allCustomers()
    {
        $user = Auth::requireAdmin();
        
        $customers = Database::fetchAll("
            SELECT u.*, COUNT(o.id) as order_count
            FROM users u
            LEFT JOIN orders o ON u.id = o.user_id
            WHERE u.role = 'customer'
            GROUP BY u.id
            ORDER BY u.created_at DESC
        ");
        
        echo json_encode(['customers' => $customers]);
    }
}
