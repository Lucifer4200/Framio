<?php

namespace App\Models;

use App\Helpers\Database;

class ProductImage extends Model
{
    protected static $table = 'product_images';
    protected static $primaryKey = 'id';
    protected static $fillable = ['product_id', 'image_url', 'is_primary'];
    protected static $casts = [
        'id' => 'integer',
        'product_id' => 'integer',
        'is_primary' => 'boolean',
    ];
    
    public static function findByProduct($productId)
    {
        $sql = "SELECT * FROM " . static::$table . " WHERE product_id = ? ORDER BY is_primary DESC";
        $results = Database::fetchAll($sql, [$productId]);
        
        return array_map(function($data) {
            return static::newInstance($data);
        }, $results);
    }
    
    public static function setPrimary($productId, $imageId)
    {
        Database::query("UPDATE " . static::$table . " SET is_primary = 0 WHERE product_id = ?", [$productId]);
        return Database::query("UPDATE " . static::$table . " SET is_primary = 1 WHERE id = ?", [$imageId]);
    }
    
    public function product()
    {
        return Product::find($this->product_id);
    }
    
    public function isPrimary()
    {
        return (bool) $this->is_primary;
    }
}
