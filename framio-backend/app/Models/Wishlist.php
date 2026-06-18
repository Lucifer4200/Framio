<?php

namespace App\Models;

use App\Helpers\Database;

class Wishlist extends Model
{
    protected static $table = 'wishlists';
    protected static $primaryKey = 'id';
    protected static $fillable = ['user_id', 'product_id'];
    protected static $casts = [
        'id' => 'integer',
        'user_id' => 'integer',
        'product_id' => 'integer',
    ];
    
    public static function findByUser($userId)
    {
        $sql = "
            SELECT w.*, p.name, p.slug, p.price, p.discount_price, p.stock,
                   (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image
            FROM wishlists w
            JOIN products p ON w.product_id = p.id
            WHERE w.user_id = ?
            ORDER BY w.created_at DESC
        ";
        $results = Database::fetchAll($sql, [$userId]);
        
        return array_map(function($data) {
            return static::newInstance($data);
        }, $results);
    }
    
    public static function exists($userId, $productId)
    {
        $result = Database::fetchOne(
            "SELECT * FROM " . static::$table . " WHERE user_id = ? AND product_id = ?",
            [$userId, $productId]
        );
        return $result !== false;
    }
    
    public static function add($userId, $productId)
    {
        if (self::exists($userId, $productId)) {
            return false;
        }
        
        return parent::create(['user_id' => $userId, 'product_id' => $productId]);
    }
    
    public static function remove($userId, $productId)
    {
        return Database::query(
            "DELETE FROM " . static::$table . " WHERE user_id = ? AND product_id = ?",
            [$userId, $productId]
        );
    }
    
    public static function clear($userId)
    {
        return Database::query("DELETE FROM " . static::$table . " WHERE user_id = ?", [$userId]);
    }
    
    public function user()
    {
        return User::find($this->user_id);
    }
    
    public function product()
    {
        return Product::find($this->product_id);
    }
}
