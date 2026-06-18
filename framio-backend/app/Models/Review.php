<?php

namespace App\Models;

use App\Helpers\Database;

class Review extends Model
{
    protected static $table = 'reviews';
    protected static $primaryKey = 'id';
    protected static $fillable = ['user_id', 'product_id', 'rating', 'comment', 'status'];
    protected static $casts = [
        'id' => 'integer',
        'user_id' => 'integer',
        'product_id' => 'integer',
        'rating' => 'integer',
        'status' => 'string',
    ];
    
    public static function all($filters = [])
    {
        $sql = "SELECT r.*, u.name as user_name, p.name as product_name FROM reviews r JOIN users u ON r.user_id = u.id JOIN products p ON r.product_id = p.id";
        $params = [];
        
        if (!empty($filters['product_id'])) {
            $sql .= " WHERE r.product_id = ?";
            $params[] = $filters['product_id'];
        }
        
        if (!empty($filters['user_id'])) {
            $sql .= (empty($filters['product_id']) ? " WHERE" : " AND") . " r.user_id = ?";
            $params[] = $filters['user_id'];
        }
        
        $sql .= " ORDER BY r.created_at DESC";
        
        if (!empty($filters['limit'])) {
            $sql .= " LIMIT ?";
            $params[] = $filters['limit'];
        }
        
        $results = Database::fetchAll($sql, $params);
        return array_map(function($data) {
            return static::newInstance($data);
        }, $results);
    }
    
    public function user()
    {
        return User::find($this->user_id);
    }
    
    public function product()
    {
        return Product::find($this->product_id);
    }
    
    public function isValidRating()
    {
        return $this->rating >= 1 && $this->rating <= 5;
    }
}
