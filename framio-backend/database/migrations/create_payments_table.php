<?php

require_once __DIR__ . '/../../app/Helpers/Database.php';

use App\Helpers\Database;

$sql = "
CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    payment_method TEXT DEFAULT 'cash_on_delivery' CHECK(payment_method IN ('cash_on_delivery', 'credit_card', 'paypal', 'stripe')),
    transaction_id TEXT,
    amount REAL NOT NULL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'completed', 'failed', 'refunded')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
";

try {
    Database::execute($sql);
    echo "Payments table created successfully.\n";
} catch (Exception $e) {
    echo "Error creating payments table: " . $e->getMessage() . "\n";
}
