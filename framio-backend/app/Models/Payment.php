<?php

namespace App\Models;

use App\Helpers\Database;

class Payment
{
    protected $table = 'payments';
    
    public static function findByOrder($orderId)
    {
        return Database::fetchOne("SELECT * FROM payments WHERE order_id = ?", [$orderId]);
    }
    
    public static function create($data)
    {
        $sql = "INSERT INTO payments (order_id, payment_method, transaction_id, amount, status) VALUES (?, ?, ?, ?, ?)";
        Database::execute($sql, [
            $data['order_id'],
            $data['payment_method'],
            $data['transaction_id'] ?? null,
            $data['amount'],
            $data['status'] ?? 'pending'
        ]);
        return Database::lastInsertId();
    }
    
    public static function updateStatus($id, $status)
    {
        return Database::execute("UPDATE payments SET status = ? WHERE id = ?", [$status, $id]);
    }
}
