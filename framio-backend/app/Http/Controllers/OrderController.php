<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Cart;
use App\Helpers\Auth;

class OrderController
{
    public function index()
    {
        $user = Auth::requireAuth();
        
        $filters = ['user_id' => $user['id']];
        $orders = Order::all($filters);
        
        foreach ($orders as &$order) {
            $order['items'] = Order::getItems($order['id']);
        }
        
        echo json_encode(['orders' => $orders]);
    }
    
    public function show($id)
    {
        $user = Auth::requireAuth();
        
        $order = Order::find($id);
        
        if (!$order) {
            http_response_code(404);
            echo json_encode(['error' => 'Order not found']);
            return;
        }
        
        // Check if user owns this order or is admin
        if ($order['user_id'] !== $user['id'] && $user['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Access denied']);
            return;
        }
        
        $order['items'] = Order::getItems($order['id']);
        
        echo json_encode(['order' => $order]);
    }
    
    public function store()
    {
        $user = Auth::requireAuth();
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validation
        if (empty($data['items']) || empty($data['shipping_address']) || empty($data['billing_address'])) {
            http_response_code(422);
            echo json_encode(['error' => 'Items, shipping address, and billing address are required']);
            return;
        }
        
        // Get cart and calculate total
        $cart = Cart::findByUser($user['id']);
        $cartItems = Cart::getItems($cart['id']);
        $total = Cart::getTotal($cart['id']);
        
        if (empty($cartItems)) {
            http_response_code(400);
            echo json_encode(['error' => 'Cart is empty']);
            return;
        }
        
        // Create order
        $orderData = [
            'user_id' => $user['id'],
            'total_amount' => $total,
            'payment_status' => $data['payment_status'] ?? 'pending',
            'order_status' => $data['order_status'] ?? 'pending',
            'shipping_address' => $data['shipping_address'],
            'billing_address' => $data['billing_address'],
            'phone' => $data['phone'] ?? null,
            'notes' => $data['notes'] ?? null,
            'items' => array_map(function($item) {
                return [
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price']
                ];
            }, $cartItems)
        ];
        
        $orderId = Order::create($orderData);
        
        // Clear cart
        Cart::clear($cart['id']);
        
        $order = Order::find($orderId);
        $order['items'] = Order::getItems($orderId);
        
        http_response_code(201);
        echo json_encode([
            'message' => 'Order created successfully',
            'order' => $order
        ]);
    }
    
    public function updateStatus($id)
    {
        $user = Auth::requireAdmin();
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (empty($data['status'])) {
            http_response_code(422);
            echo json_encode(['error' => 'Status is required']);
            return;
        }
        
        $order = Order::find($id);
        if (!$order) {
            http_response_code(404);
            echo json_encode(['error' => 'Order not found']);
            return;
        }
        
        Order::updateStatus($id, $data['status']);
        $updatedOrder = Order::find($id);
        
        echo json_encode([
            'message' => 'Order status updated successfully',
            'order' => $updatedOrder
        ]);
    }
}
