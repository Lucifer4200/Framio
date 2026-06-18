<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;

class PaymentController extends Controller
{
    public function show($orderId): JsonResponse
    {
        $user = auth()->user();
        $order = Order::find($orderId);

        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        if ($order->user_id !== $user->id && !$user->isAdmin()) {
            return response()->json(['error' => 'Access denied'], 403);
        }

        $payment = Payment::where('order_id', $orderId)->first();

        return response()->json(['payment' => $payment]);
    }

    public function store(): JsonResponse
    {
        $user = auth()->user();
        $data = request()->validate([
            'order_id' => 'required|exists:orders,id',
            'payment_method' => 'required|in:cash_on_delivery,credit_card,paypal,stripe',
            'transaction_id' => 'nullable|string|max:255',
            'status' => 'nullable|in:pending,completed,failed,refunded',
        ]);

        $order = Order::findOrFail($data['order_id']);

        if ($order->user_id !== $user->id) {
            return response()->json(['error' => 'Access denied'], 403);
        }

        $paymentData = [
            'order_id' => $data['order_id'],
            'payment_method' => $data['payment_method'],
            'transaction_id' => $data['transaction_id'] ?? null,
            'amount' => $order->total_amount,
            'status' => $data['status'] ?? 'pending',
        ];

        Payment::create($paymentData);

        if (($data['status'] ?? 'pending') === 'completed') {
            $order->update(['payment_status' => 'paid']);
        }

        $payment = Payment::where('order_id', $data['order_id'])->first();

        return response()->json([
            'message' => 'Payment created successfully',
            'payment' => $payment,
        ], 201);
    }

    public function updateStatus($id): JsonResponse
    {
        $data = request()->validate([
            'status' => 'required|in:pending,completed,failed,refunded',
        ]);

        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json(['error' => 'Payment not found'], 404);
        }

        $payment->update(['status' => $data['status']]);

        if ($data['status'] === 'completed') {
            $payment->order->update(['payment_status' => 'paid']);
        }

        return response()->json(['message' => 'Payment status updated successfully']);
    }
}
