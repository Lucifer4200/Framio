<?php

require_once __DIR__ . '/../../app/Helpers/Database.php';

use App\Helpers\Database;

$sql = "
CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cart_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1,
    price REAL NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
";

try {
    Database::execute($sql);
    echo "Cart items table created successfully.\n";
} catch (Exception $e) {
    echo "Error creating cart items table: " . $e->getMessage() . "\n";
}
