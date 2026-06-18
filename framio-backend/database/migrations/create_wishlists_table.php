<?php

require_once __DIR__ . '/../../app/Helpers/Database.php';

use App\Helpers\Database;

$sql = "
CREATE TABLE IF NOT EXISTS wishlists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
";

try {
    Database::execute($sql);
    echo "Wishlists table created successfully.\n";
} catch (Exception $e) {
    echo "Error creating wishlists table: " . $e->getMessage() . "\n";
}
