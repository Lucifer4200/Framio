<?php

// Migration runner
$migrations = [
    'create_users_table.php',
    'create_categories_table.php',
    'create_products_table.php',
    'create_product_images_table.php',
    'create_carts_table.php',
    'create_cart_items_table.php',
    'create_orders_table.php',
    'create_order_items_table.php',
    'create_payments_table.php',
    'create_reviews_table.php',
    'create_wishlists_table.php',
];

$migrationPath = __DIR__ . '/migrations/';

echo "Running migrations...\n\n";

foreach ($migrations as $migration) {
    echo "Running {$migration}...\n";
    require $migrationPath . $migration;
}

echo "\nAll migrations completed successfully.\n";
