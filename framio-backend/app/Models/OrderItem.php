<?php

namespace App\Models;

class OrderItem extends Model
{
    protected static $table = 'order_items';
    protected static $primaryKey = 'id';
    protected static $fillable = ['order_id', 'product_id', 'quantity', 'price'];
    protected static $casts = [
        'id' => 'integer',
        'order_id' => 'integer',
        'product_id' => 'integer',
        'quantity' => 'integer',
        'price' => 'float',
    ];
    
    public function order()
    {
        return Order::find($this->order_id);
    }
    
    public function product()
    {
        return Product::find($this->product_id);
    }
    
    public function getSubtotal()
    {
        return $this->quantity * $this->price;
    }
}
