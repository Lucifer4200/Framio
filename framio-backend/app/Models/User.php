<?php

namespace App\Models;

use App\Helpers\Database;

class User extends Model
{
    protected static $table = 'users';
    protected static $primaryKey = 'id';
    protected static $fillable = ['name', 'email', 'password', 'phone', 'role', 'status'];
    protected static $casts = [
        'id' => 'integer',
        'role' => 'string',
        'status' => 'string',
    ];
    
    public static function findByEmail($email)
    {
        $sql = "SELECT * FROM " . static::$table . " WHERE email = ? LIMIT 1";
        $data = Database::fetchOne($sql, [$email]);
        
        return $data ? static::newInstance($data) : null;
    }
    
    public function orders()
    {
        return Order::where('user_id', $this->id);
    }
    
    public function cart()
    {
        return Cart::where('user_id', $this->id);
    }
    
    public function wishlist()
    {
        return Wishlist::where('user_id', $this->id);
    }
    
    public function isAdmin()
    {
        return $this->role === 'admin';
    }
    
    public function setPassword($password)
    {
        $this->password = password_hash($password, PASSWORD_BCRYPT);
        return $this;
    }
    
    public function verifyPassword($password)
    {
        return password_verify($password, $this->password);
    }
}
