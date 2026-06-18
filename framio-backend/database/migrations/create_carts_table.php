<?php

require_once __DIR__ . '/../../app/Helpers/Database.php';

use App\Helpers\Database;

$sql = "
CREATE TABLE IF NOT EXISTS carts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
";

try {
    Database::execute($sql);
    echo "Carts table created successfully.\n";
} catch (Exception $e) {
    echo "Error creating carts table: " . $e->getMessage() . "\n";
}
