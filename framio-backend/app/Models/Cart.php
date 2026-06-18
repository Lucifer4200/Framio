<?php

namespace App\Models;

use App\Helpers\Database;

class Cart extends Model
{
    protected static $table = 'carts';
    protected static $primaryKey = 'id';
    protected static $fillable = ['user_id'];
    protected static $casts = [
        'id' => 'integer',
        'user_id' => 'integer',
    ];
    
    public static function findByUser($userId)
    {
        $sql = "SELECT * FROM " . static::$table . " WHERE user_id = ? LIMIT 1";
        $data = Database::fetchOne($sql, [$userId]);
        
        if (!$data) {
            parent::create(['user_id' => $userId]);
            $data = Database::fetchOne($sql, [$userId]);
        }
        
        return $data ? static::newInstance($data) : null;
    }
    
    public function user()
    {
        return User::find($this->user_id);
    }
    
    public function items()
    {
        $sql = "
            SELECT ci.*, p.name, p.slug, p.price, p.discount_price, p.stock,
                   (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.cart_id = ?
        ";
        $results = Database::fetchAll($sql, [$this->id]);
        
        return array_map(function($data) {
            return new CartItem($data);
        }, $results);
    }
    
    public function addItem($productId, $quantity)
    {
        $product = Product::find($productId);
        if (!$product || !$product->isInStock() || $product->stock < $quantity) {
            return false;
        }
        
        $existing = Database::fetchOne(
            "SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?",
            [$this->id, $productId]
        );
        
        if ($existing) {
            $newQuantity = $existing['quantity'] + $quantity;
            if ($product->stock < $newQuantity) {
                return false;
            }
            Database::query(
                "UPDATE cart_items SET quantity = ?, price = ? WHERE id = ?",
                [$newQuantity, $product->getFinalPrice(), $existing['id']]
            );
        } else {
            CartItem::create([
                'cart_id' => $this->id,
                'product_id' => $productId,
                'quantity' => $quantity,
                'price' => $product->getFinalPrice()
            ]);
        }
        return true;
    }
    
    public function updateItem($productId, $quantity)
    {
        $product = Product::find($productId);
        if (!$product || !$product->isInStock() || $product->stock < $quantity) {
            return false;
        }
        
        return Database::query(
            "UPDATE cart_items SET quantity = ?, price = ? WHERE cart_id = ? AND product_id = ?",
            [$quantity, $product->getFinalPrice(), $this->id, $productId]
        );
    }
    
    public function removeItem($productId)
    {
        return Database::query(
            "DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?",
            [$this->id, $productId]
        );
    }
    
    public function clear()
    {
        return Database::query("DELETE FROM cart_items WHERE cart_id = ?", [$this->id]);
    }
    
    public function getTotal()
    {
        $result = Database::fetchOne(
            "SELECT SUM(quantity * price) as total FROM cart_items WHERE cart_id = ?",
            [$this->id]
        );
        return $result ? (float) $result['total'] : 0;
    }
    
    public function getItemCount()
    {
        $result = Database::fetchOne(
            "SELECT COUNT(*) as count FROM cart_items WHERE cart_id = ?",
            [$this->id]
        );
        return $result ? (int) $result['count'] : 0;
    }
}
