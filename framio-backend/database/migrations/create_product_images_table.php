<?php

require_once __DIR__ . '/../../app/Helpers/Database.php';

use App\Helpers\Database;

$sql = "
CREATE TABLE IF NOT EXISTS product_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    is_primary INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
";

try {
    Database::execute($sql);
    echo "Product images table created successfully.\n";
} catch (Exception $e) {
    echo "Error creating product images table: " . $e->getMessage() . "\n";
}
