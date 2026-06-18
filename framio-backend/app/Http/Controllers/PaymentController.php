<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Order;
use App\Helpers\Auth;

class PaymentController
{
    public function show($orderId)
    {
        $user = Auth::requireAuth();
        
        $order = Order::find($orderId);
        
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
        
        $payment = Payment::findByOrder($orderId);
        
        echo json_encode(['payment' => $payment]);
    }
    
    public function store()
    {
        $user = Auth::requireAuth();
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validation
        if (empty($data['order_id']) || empty($data['payment_method'])) {
            http_response_code(422);
            echo json_encode(['error' => 'Order ID and payment method are required']);
            return;
        }
        
        $order = Order::find($data['order_id']);
        
        if (!$order) {
            http_response_code(404);
            echo json_encode(['error' => 'Order not found']);
            return;
        }
        
        // Check if user owns this order
        if ($order['user_id'] !== $user['id']) {
            http_response_code(403);
            echo json_encode(['error' => 'Access denied']);
            return;
        }
        
        $paymentData = [
            'order_id' => $data['order_id'],
            'payment_method' => $data['payment_method'],
            'transaction_id' => $data['transaction_id'] ?? null,
            'amount' => $order['total_amount'],
            'status' => $data['status'] ?? 'pending'
        ];
        
        $paymentId = Payment::create($paymentData);
        
        // Update order payment status
        if ($paymentData['status'] === 'completed') {
            Order::updatePaymentStatus($data['order_id'], 'paid');
        }
        
        $payment = Payment::findByOrder($data['order_id']);
        
        http_response_code(201);
        echo json_encode([
            'message' => 'Payment created successfully',
            'payment' => $payment
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
        
        Payment::updateStatus($id, $data['status']);
        
        echo json_encode(['message' => 'Payment status updated successfully']);
    }
}
