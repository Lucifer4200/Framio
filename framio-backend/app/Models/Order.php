<?php

namespace App\Models;

use App\Helpers\Database;

class Order extends Model
{
    protected static $table = 'orders';
    protected static $primaryKey = 'id';
    protected static $fillable = ['user_id', 'order_number', 'total_amount', 'payment_status', 'order_status', 'shipping_address', 'billing_address', 'phone', 'notes'];
    protected static $casts = [
        'id' => 'integer',
        'user_id' => 'integer',
        'total_amount' => 'float',
        'payment_status' => 'string',
        'order_status' => 'string',
    ];
    
    public static function all($filters = [])
    {
        $sql = "SELECT o.*, u.name as customer_name, u.email as customer_email FROM orders o JOIN users u ON o.user_id = u.id";
        $params = [];
        
        if (!empty($filters['user_id'])) {
            $sql .= " WHERE o.user_id = ?";
            $params[] = $filters['user_id'];
        }
        
        if (!empty($filters['status'])) {
            $sql .= (empty($filters['user_id']) ? " WHERE" : " AND") . " o.order_status = ?";
            $params[] = $filters['status'];
        }
        
        $sql .= " ORDER BY o.created_at DESC";
        
        if (!empty($filters['limit'])) {
            $sql .= " LIMIT ?";
            $params[] = $filters['limit'];
        }
        
        $results = Database::fetchAll($sql, $params);
        return array_map(function($data) {
            return static::newInstance($data);
        }, $results);
    }
    
    public static function findByOrderNumber($orderNumber)
    {
        $sql = "SELECT * FROM " . static::$table . " WHERE order_number = ? LIMIT 1";
        $data = Database::fetchOne($sql, [$orderNumber]);
        
        return $data ? static::newInstance($data) : null;
    }
    
    public function user()
    {
        return User::find($this->user_id);
    }
    
    public function items()
    {
        $sql = "
            SELECT oi.*, p.name, p.slug,
                   (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        ";
        $results = Database::fetchAll($sql, [$this->id]);
        
        return array_map(function($data) {
            return new OrderItem($data);
        }, $results);
    }
    
    public static function createWithItems($data)
    {
        $orderNumber = 'ORD-' . strtoupper(uniqid());
        
        $orderData = [
            'user_id' => $data['user_id'],
            'order_number' => $orderNumber,
            'total_amount' => $data['total_amount'],
            'payment_status' => $data['payment_status'] ?? 'pending',
            'order_status' => $data['order_status'] ?? 'pending',
            'shipping_address' => $data['shipping_address'],
            'billing_address' => $data['billing_address'],
            'phone' => $data['phone'],
            'notes' => $data['notes'] ?? null
        ];
        
        $order = parent::create($orderData);
        
        // Add order items
        foreach ($data['items'] as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => $item['price']
            ]);
            
            // Update product stock
            $product = Product::find($item['product_id']);
            if ($product) {
                $product->updateStock($item['quantity']);
            }
        }
        
        return $order;
    }
    
    public function updateStatus($status)
    {
        $this->update(['order_status' => $status]);
        return $this;
    }
    
    public function updatePaymentStatus($status)
    {
        $this->update(['payment_status' => $status]);
        return $this;
    }
    
    public function isPaid()
    {
        return $this->payment_status === 'paid';
    }
    
    public function isDelivered()
    {
        return $this->order_status === 'delivered';
    }
}
