<?php

namespace App\Models;

use App\Helpers\Database;

class Product extends Model
{
    protected static $table = 'products';
    protected static $primaryKey = 'id';
    protected static $fillable = ['category_id', 'name', 'slug', 'description', 'price', 'discount_price', 'stock', 'frame_type', 'size', 'color', 'status'];
    protected static $casts = [
        'id' => 'integer',
        'category_id' => 'integer',
        'price' => 'float',
        'discount_price' => 'float',
        'stock' => 'integer',
        'status' => 'string',
    ];
    
    public static function all($filters = [])
    {
        $sql = "SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.status = 'active'";
        $params = [];
        
        if (!empty($filters['category_id'])) {
            $sql .= " AND p.category_id = ?";
            $params[] = $filters['category_id'];
        }
        
        if (!empty($filters['search'])) {
            $sql .= " AND (p.name LIKE ? OR p.description LIKE ?)";
            $params[] = "%{$filters['search']}%";
            $params[] = "%{$filters['search']}%";
        }
        
        if (!empty($filters['min_price'])) {
            $sql .= " AND p.price >= ?";
            $params[] = $filters['min_price'];
        }
        
        if (!empty($filters['max_price'])) {
            $sql .= " AND p.price <= ?";
            $params[] = $filters['max_price'];
        }
        
        if (!empty($filters['frame_type'])) {
            $sql .= " AND p.frame_type = ?";
            $params[] = $filters['frame_type'];
        }
        
        if (!empty($filters['size'])) {
            $sql .= " AND p.size = ?";
            $params[] = $filters['size'];
        }
        
        if (!empty($filters['color'])) {
            $sql .= " AND p.color = ?";
            $params[] = $filters['color'];
        }
        
        $orderBy = $filters['sort'] ?? 'created_at';
        $orderDir = $filters['order'] ?? 'DESC';
        $sql .= " ORDER BY p.$orderBy $orderDir";
        
        if (!empty($filters['limit'])) {
            $sql .= " LIMIT ?";
            $params[] = $filters['limit'];
        }
        
        $results = Database::fetchAll($sql, $params);
        return array_map(function($data) {
            return static::newInstance($data);
        }, $results);
    }
    
    public static function findBySlug($slug)
    {
        $sql = "SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.slug = ? LIMIT 1";
        $data = Database::fetchOne($sql, [$slug]);
        
        return $data ? static::newInstance($data) : null;
    }
    
    public function category()
    {
        return Category::find($this->category_id);
    }
    
    public function images()
    {
        $sql = "SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC";
        $results = Database::fetchAll($sql, [$this->id]);
        
        return array_map(function($data) {
            return new ProductImage($data);
        }, $results);
    }
    
    public function reviews()
    {
        $sql = "SELECT r.*, u.name as user_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = ? AND r.status = 'active' ORDER BY r.created_at DESC";
        $results = Database::fetchAll($sql, [$this->id]);
        
        return array_map(function($data) {
            return new Review($data);
        }, $results);
    }
    
    public function getAverageRating()
    {
        $result = Database::fetchOne("SELECT AVG(rating) as avg_rating FROM reviews WHERE product_id = ? AND status = 'active'", [$this->id]);
        return $result ? round($result['avg_rating'], 1) : 0;
    }
    
    public function updateStock($quantity)
    {
        Database::query("UPDATE products SET stock = stock - ? WHERE id = ?", [$quantity, $this->id]);
        $this->stock -= $quantity;
        return $this;
    }
    
    public function getFinalPrice()
    {
        return $this->discount_price ? $this->discount_price : $this->price;
    }
    
    public function isInStock()
    {
        return $this->stock > 0;
    }
}
