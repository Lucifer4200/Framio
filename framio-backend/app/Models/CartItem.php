<?php

namespace App\Models;

class CartItem extends Model
{
    protected static $table = 'cart_items';
    protected static $primaryKey = 'id';
    protected static $fillable = ['cart_id', 'product_id', 'quantity', 'price'];
    protected static $casts = [
        'id' => 'integer',
        'cart_id' => 'integer',
        'product_id' => 'integer',
        'quantity' => 'integer',
        'price' => 'float',
    ];
    
    public function cart()
    {
        return Cart::find($this->cart_id);
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
