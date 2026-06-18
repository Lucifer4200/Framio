<?php

namespace App\Models;

use App\Helpers\Database;

abstract class Model
{
    protected static $table;
    protected static $primaryKey = 'id';
    protected static $fillable = [];
    protected static $casts = [];
    
    protected $attributes = [];
    
    public function __construct(array $attributes = [])
    {
        $this->attributes = $attributes;
    }
    
    public static function all()
    {
        $sql = "SELECT * FROM " . static::$table;
        $results = Database::fetchAll($sql);
        
        return array_map(function($data) {
            return static::newInstance($data);
        }, $results);
    }
    
    public static function find($id)
    {
        $sql = "SELECT * FROM " . static::$table . " WHERE " . static::$primaryKey . " = ? LIMIT 1";
        $data = Database::fetchOne($sql, [$id]);
        
        return $data ? static::newInstance($data) : null;
    }
    
    public static function where($column, $operator, $value = null)
    {
        if ($value === null) {
            $value = $operator;
            $operator = '=';
        }
        
        $sql = "SELECT * FROM " . static::$table . " WHERE $column $operator ?";
        $results = Database::fetchAll($sql, [$value]);
        
        return array_map(function($data) {
            return static::newInstance($data);
        }, $results);
    }
    
    public static function create(array $attributes)
    {
        $fillable = static::$fillable;
        $data = array_intersect_key($attributes, array_flip($fillable));
        
        $columns = implode(', ', array_keys($data));
        $placeholders = implode(', ', array_fill(0, count($data), '?'));
        $values = array_values($data);
        
        $sql = "INSERT INTO " . static::$table . " ($columns) VALUES ($placeholders)";
        Database::query($sql, $values);
        
        return static::find(Database::lastInsertId());
    }
    
    public function update(array $attributes)
    {
        $fillable = static::$fillable;
        $data = array_intersect_key($attributes, array_flip($fillable));
        
        $setParts = [];
        $values = [];
        
        foreach ($data as $key => $value) {
            $setParts[] = "$key = ?";
            $values[] = $value;
        }
        
        $values[] = $this->attributes[static::$primaryKey];
        
        $sql = "UPDATE " . static::$table . " SET " . implode(', ', $setParts) . " WHERE " . static::$primaryKey . " = ?";
        Database::query($sql, $values);
        
        $this->attributes = array_merge($this->attributes, $data);
        return $this;
    }
    
    public static function updateStatic($id, array $attributes)
    {
        $fillable = static::$fillable;
        $data = array_intersect_key($attributes, array_flip($fillable));
        
        $setParts = [];
        $values = [];
        
        foreach ($data as $key => $value) {
            $setParts[] = "$key = ?";
            $values[] = $value;
        }
        
        $values[] = $id;
        
        $sql = "UPDATE " . static::$table . " SET " . implode(', ', $setParts) . " WHERE " . static::$primaryKey . " = ?";
        Database::query($sql, $values);
    }
    
    public function delete()
    {
        $sql = "DELETE FROM " . static::$table . " WHERE " . static::$primaryKey . " = ?";
        Database::query($sql, [$this->attributes[static::$primaryKey]]);
    }
    
    public static function deleteStatic($id)
    {
        $sql = "DELETE FROM " . static::$table . " WHERE " . static::$primaryKey . " = ?";
        Database::query($sql, [$id]);
    }
    
    public function __get($name)
    {
        return $this->castValue($name, $this->attributes[$name] ?? null);
    }
    
    public function __set($name, $value)
    {
        $this->attributes[$name] = $value;
    }
    
    protected function castValue($key, $value)
    {
        if (!isset(static::$casts[$key])) {
            return $value;
        }
        
        $cast = static::$casts[$key];
        
        switch ($cast) {
            case 'int':
            case 'integer':
                return (int) $value;
            case 'float':
            case 'double':
                return (float) $value;
            case 'bool':
            case 'boolean':
                return (bool) $value;
            case 'array':
                return json_decode($value, true) ?? [];
            case 'json':
                return json_decode($value, true);
            case 'datetime':
                return $value ? new \DateTime($value) : null;
            default:
                return $value;
        }
    }
    
    protected static function newInstance($attributes)
    {
        return new static($attributes);
    }
    
    public function toArray()
    {
        $array = [];
        foreach ($this->attributes as $key => $value) {
            $array[$key] = $this->castValue($key, $value);
        }
        return $array;
    }
    
    public function toJson()
    {
        return json_encode($this->toArray());
    }
}
