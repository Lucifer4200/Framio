<?php

namespace App\Models;

class Category extends Model
{
    protected static $table = 'categories';
    protected static $primaryKey = 'id';
    protected static $fillable = ['name', 'slug', 'image', 'status'];
    protected static $casts = [
        'id' => 'integer',
        'status' => 'string',
    ];
    
    public static function all()
    {
        $sql = "SELECT * FROM " . static::$table . " WHERE status = 'active' ORDER BY name";
        $results = Database::fetchAll($sql);
        
        return array_map(function($data) {
            return static::newInstance($data);
        }, $results);
    }
    
    public static function findBySlug($slug)
    {
        $sql = "SELECT * FROM " . static::$table . " WHERE slug = ? LIMIT 1";
        $data = Database::fetchOne($sql, [$slug]);
        
        return $data ? static::newInstance($data) : null;
    }
    
    public function products()
    {
        return Product::where('category_id', $this->id);
    }
}
