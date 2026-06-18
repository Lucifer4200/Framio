<?php

declare(strict_types=1);

header('Content-Type: application/json');
$origin = $_SERVER['HTTP_ORIGIN'] ?? 'http://localhost:3000';
if (in_array($origin, ['http://localhost:3000', 'http://127.0.0.1:3000'], true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$db = new PDO('sqlite:' . dirname(__DIR__) . '/database/framio.sqlite');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/';
$path = preg_replace('#^/api/v1#', '', $path);
$path = '/' . trim($path, '/');

function json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

function input(): array
{
    $data = json_decode(file_get_contents('php://input') ?: '[]', true);
    return is_array($data) ? $data : [];
}

function query_all(PDO $db, string $sql, array $params = []): array
{
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll();
}

function query_one(PDO $db, string $sql, array $params = []): ?array
{
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $row = $stmt->fetch();
    return $row ?: null;
}

function execute(PDO $db, string $sql, array $params = []): int
{
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    return $stmt->rowCount();
}

function current_user(PDO $db): ?array
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!preg_match('/Bearer\s+(.+)/', $header, $matches)) {
        return null;
    }

    $token = base64_decode($matches[1], true);
    if (!$token || !str_starts_with($token, 'framio:')) {
        return null;
    }

    $userId = (int) substr($token, strlen('framio:'));
    return query_one($db, 'SELECT id, name, email, phone, role, status FROM users WHERE id = ?', [$userId]);
}

function require_user(PDO $db): array
{
    $user = current_user($db);
    if (!$user) {
        json_response(['error' => 'Unauthorized'], 401);
    }
    return $user;
}

function token_for(int $userId): string
{
    return base64_encode('framio:' . $userId);
}

function product_rows(PDO $db, string $where = 'p.status = "active"', array $params = [], string $suffix = ''): array
{
    $products = query_all(
        $db,
        "SELECT p.*, c.name AS category_name
         FROM products p
         LEFT JOIN categories c ON c.id = p.category_id
         WHERE {$where}
         {$suffix}",
        $params
    );

    foreach ($products as &$product) {
        $product['price'] = (float) $product['price'];
        $product['discount_price'] = $product['discount_price'] === null ? null : (float) $product['discount_price'];
        $product['stock'] = (int) $product['stock'];
        $product['images'] = query_all($db, 'SELECT id, image_url, is_primary FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, id', [$product['id']]);
        $rating = query_one($db, 'SELECT AVG(rating) AS rating FROM reviews WHERE product_id = ?', [$product['id']]);
        $product['average_rating'] = $rating && $rating['rating'] !== null ? round((float) $rating['rating'], 1) : 0;
    }

    return $products;
}

function cart_payload(PDO $db, int $userId): array
{
    $cart = query_one($db, 'SELECT * FROM carts WHERE user_id = ?', [$userId]);
    if (!$cart) {
        execute($db, 'INSERT INTO carts (user_id, created_at, updated_at) VALUES (?, datetime("now"), datetime("now"))', [$userId]);
        $cart = ['id' => (int) $db->lastInsertId(), 'user_id' => $userId];
    }

    $items = query_all(
        $db,
        'SELECT ci.id, ci.product_id, ci.quantity, ci.price, p.name, p.stock,
                (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, id LIMIT 1) AS image
         FROM cart_items ci
         JOIN products p ON p.id = ci.product_id
         WHERE ci.cart_id = ?',
        [$cart['id']]
    );

    $total = 0.0;
    foreach ($items as &$item) {
        $item['price'] = (float) $item['price'];
        $item['quantity'] = (int) $item['quantity'];
        $item['stock'] = (int) $item['stock'];
        $total += $item['price'] * $item['quantity'];
    }

    return ['id' => (int) $cart['id'], 'items' => $items, 'total' => $total];
}

try {
    if ($path === '/' && $method === 'GET') {
        json_response(['message' => 'Framio API', 'version' => '1.0.0', 'timestamp' => date('Y-m-d H:i:s')]);
    }

    if ($path === '/auth/login' && $method === 'POST') {
        $body = input();
        $user = query_one($db, 'SELECT * FROM users WHERE email = ?', [$body['email'] ?? '']);
        if (!$user || !password_verify($body['password'] ?? '', $user['password'])) {
            json_response(['error' => 'Invalid credentials'], 422);
        }
        unset($user['password']);
        json_response(['token' => token_for((int) $user['id']), 'user' => $user]);
    }

    if ($path === '/auth/register' && $method === 'POST') {
        $body = input();
        if (empty($body['name']) || empty($body['email']) || empty($body['password'])) {
            json_response(['error' => 'Name, email, and password are required'], 422);
        }
        execute(
            $db,
            'INSERT INTO users (name, email, password, phone, role, status, created_at, updated_at) VALUES (?, ?, ?, ?, "customer", "active", datetime("now"), datetime("now"))',
            [$body['name'], $body['email'], password_hash($body['password'], PASSWORD_DEFAULT), $body['phone'] ?? null]
        );
        $user = query_one($db, 'SELECT id, name, email, phone, role, status FROM users WHERE id = ?', [(int) $db->lastInsertId()]);
        json_response(['token' => token_for((int) $user['id']), 'user' => $user], 201);
    }

    if ($path === '/auth/me' && $method === 'GET') {
        json_response(['user' => require_user($db)]);
    }

    if ($path === '/auth/logout' && $method === 'POST') {
        json_response(['message' => 'Logged out']);
    }

    if ($path === '/categories' && $method === 'GET') {
        json_response(['categories' => query_all($db, 'SELECT * FROM categories WHERE status = "active" ORDER BY name')]);
    }

    if (preg_match('#^/categories/(\d+)$#', $path, $m) && $method === 'GET') {
        $category = query_one($db, 'SELECT * FROM categories WHERE id = ?', [(int) $m[1]]);
        $category ? json_response(['category' => $category]) : json_response(['error' => 'Category not found'], 404);
    }

    if ($path === '/products' && $method === 'GET') {
        $where = ['p.status = "active"'];
        $params = [];
        foreach (['category_id', 'frame_type', 'size', 'color'] as $field) {
            if (isset($_GET[$field]) && $_GET[$field] !== '') {
                $where[] = "p.{$field} = ?";
                $params[] = $_GET[$field];
            }
        }
        if (!empty($_GET['search'])) {
            $where[] = '(p.name LIKE ? OR p.description LIKE ?)';
            $params[] = '%' . $_GET['search'] . '%';
            $params[] = '%' . $_GET['search'] . '%';
        }
        $sort = in_array($_GET['sort'] ?? '', ['name', 'price', 'created_at'], true) ? $_GET['sort'] : 'created_at';
        $order = strtoupper($_GET['order'] ?? 'DESC') === 'ASC' ? 'ASC' : 'DESC';
        json_response(['products' => product_rows($db, implode(' AND ', $where), $params, "ORDER BY p.{$sort} {$order}")]);
    }

    if (preg_match('#^/products/(\d+)$#', $path, $m) && $method === 'GET') {
        $products = product_rows($db, 'p.id = ?', [(int) $m[1]]);
        if (!$products) {
            json_response(['error' => 'Product not found'], 404);
        }
        $product = $products[0];
        $product['reviews'] = query_all(
            $db,
            'SELECT r.*, u.name AS user_name FROM reviews r LEFT JOIN users u ON u.id = r.user_id WHERE r.product_id = ? ORDER BY r.id DESC',
            [(int) $m[1]]
        );
        json_response(['product' => $product]);
    }

    if ($path === '/cart' && $method === 'GET') {
        $user = require_user($db);
        json_response(cart_payload($db, (int) $user['id']));
    }

    if ($path === '/cart/add' && $method === 'POST') {
        $user = require_user($db);
        $body = input();
        $product = query_one($db, 'SELECT * FROM products WHERE id = ?', [(int) ($body['product_id'] ?? 0)]);
        if (!$product) {
            json_response(['error' => 'Product not found'], 404);
        }
        $cart = cart_payload($db, (int) $user['id']);
        $existing = query_one($db, 'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?', [$cart['id'], $product['id']]);
        $quantity = max(1, (int) ($body['quantity'] ?? 1));
        $price = $product['discount_price'] ?: $product['price'];
        if ($existing) {
            execute($db, 'UPDATE cart_items SET quantity = quantity + ?, updated_at = datetime("now") WHERE id = ?', [$quantity, $existing['id']]);
        } else {
            execute($db, 'INSERT INTO cart_items (cart_id, product_id, quantity, price, created_at, updated_at) VALUES (?, ?, ?, ?, datetime("now"), datetime("now"))', [$cart['id'], $product['id'], $quantity, $price]);
        }
        json_response(cart_payload($db, (int) $user['id']));
    }

    if (($path === '/cart/update' || $path === '/cart/remove') && $method === 'POST') {
        $user = require_user($db);
        $body = input();
        $cart = cart_payload($db, (int) $user['id']);
        if ($path === '/cart/remove' || (int) ($body['quantity'] ?? 0) <= 0) {
            execute($db, 'DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?', [$cart['id'], (int) ($body['product_id'] ?? 0)]);
        } else {
            execute($db, 'UPDATE cart_items SET quantity = ?, updated_at = datetime("now") WHERE cart_id = ? AND product_id = ?', [(int) $body['quantity'], $cart['id'], (int) $body['product_id']]);
        }
        json_response(cart_payload($db, (int) $user['id']));
    }

    if ($path === '/cart/clear' && $method === 'POST') {
        $user = require_user($db);
        $cart = cart_payload($db, (int) $user['id']);
        execute($db, 'DELETE FROM cart_items WHERE cart_id = ?', [$cart['id']]);
        json_response(cart_payload($db, (int) $user['id']));
    }

    if ($path === '/wishlist' && $method === 'GET') {
        $user = require_user($db);
        $items = query_all(
            $db,
            'SELECT w.id, w.product_id, p.name, COALESCE(p.discount_price, p.price) AS price,
                    (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, id LIMIT 1) AS image
             FROM wishlists w JOIN products p ON p.id = w.product_id WHERE w.user_id = ?',
            [$user['id']]
        );
        json_response(['items' => $items]);
    }

    if (($path === '/wishlist/add' || $path === '/wishlist/remove' || $path === '/wishlist/clear') && $method === 'POST') {
        $user = require_user($db);
        $body = input();
        if ($path === '/wishlist/add') {
            execute($db, 'INSERT OR IGNORE INTO wishlists (user_id, product_id, created_at, updated_at) VALUES (?, ?, datetime("now"), datetime("now"))', [$user['id'], (int) ($body['product_id'] ?? 0)]);
        } elseif ($path === '/wishlist/remove') {
            execute($db, 'DELETE FROM wishlists WHERE user_id = ? AND product_id = ?', [$user['id'], (int) ($body['product_id'] ?? 0)]);
        } else {
            execute($db, 'DELETE FROM wishlists WHERE user_id = ?', [$user['id']]);
        }
        json_response(['message' => 'Success']);
    }

    if ($path === '/orders' && $method === 'GET') {
        $user = require_user($db);
        json_response(['orders' => query_all($db, 'SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC', [$user['id']])]);
    }

    if ($path === '/orders' && $method === 'POST') {
        $user = require_user($db);
        $body = input();
        $cart = cart_payload($db, (int) $user['id']);
        if (!$cart['items']) {
            json_response(['error' => 'Cart is empty'], 422);
        }
        $orderNumber = 'ORD-' . date('YmdHis');
        execute(
            $db,
            'INSERT INTO orders (user_id, order_number, total_amount, payment_status, order_status, shipping_address, billing_address, phone, notes, created_at, updated_at) VALUES (?, ?, ?, "pending", "processing", ?, ?, ?, ?, datetime("now"), datetime("now"))',
            [$user['id'], $orderNumber, $cart['total'], $body['shipping_address'] ?? '', $body['billing_address'] ?? '', $body['phone'] ?? '', $body['notes'] ?? '']
        );
        $orderId = (int) $db->lastInsertId();
        foreach ($cart['items'] as $item) {
            execute($db, 'INSERT INTO order_items (order_id, product_id, quantity, price, created_at, updated_at) VALUES (?, ?, ?, ?, datetime("now"), datetime("now"))', [$orderId, $item['product_id'], $item['quantity'], $item['price']]);
        }
        execute($db, 'DELETE FROM cart_items WHERE cart_id = ?', [$cart['id']]);
        json_response(['order' => query_one($db, 'SELECT * FROM orders WHERE id = ?', [$orderId])], 201);
    }

    if (preg_match('#^/orders/(\d+)$#', $path, $m) && $method === 'GET') {
        $user = require_user($db);
        $order = query_one($db, 'SELECT * FROM orders WHERE id = ? AND user_id = ?', [(int) $m[1], $user['id']]);
        if (!$order) {
            json_response(['error' => 'Order not found'], 404);
        }
        $order['items'] = query_all($db, 'SELECT oi.*, p.name FROM order_items oi JOIN products p ON p.id = oi.product_id WHERE order_id = ?', [$order['id']]);
        json_response(['order' => $order]);
    }

    if ($path === '/admin/dashboard' && $method === 'GET') {
        require_user($db);
        json_response([
            'total_sales' => (float) (query_one($db, 'SELECT COALESCE(SUM(total_amount), 0) AS value FROM orders')['value'] ?? 0),
            'total_orders' => (int) (query_one($db, 'SELECT COUNT(*) AS value FROM orders')['value'] ?? 0),
            'total_customers' => (int) (query_one($db, 'SELECT COUNT(*) AS value FROM users WHERE role = "customer"')['value'] ?? 0),
            'total_products' => (int) (query_one($db, 'SELECT COUNT(*) AS value FROM products')['value'] ?? 0),
            'recent_orders' => query_all($db, 'SELECT o.*, u.name AS customer_name FROM orders o LEFT JOIN users u ON u.id = o.user_id ORDER BY o.id DESC LIMIT 5'),
            'best_selling_products' => query_all($db, 'SELECT p.name, SUM(oi.quantity) AS total_sold, SUM(oi.quantity * oi.price) AS revenue FROM order_items oi JOIN products p ON p.id = oi.product_id GROUP BY p.id ORDER BY total_sold DESC LIMIT 5'),
        ]);
    }

    if ($path === '/admin/orders' && $method === 'GET') {
        require_user($db);
        json_response(['orders' => query_all($db, 'SELECT o.*, u.name AS customer_name FROM orders o LEFT JOIN users u ON u.id = o.user_id ORDER BY o.id DESC')]);
    }

    if ($path === '/admin/customers' && $method === 'GET') {
        require_user($db);
        json_response(['customers' => query_all($db, 'SELECT id, name, email, phone, role, status, created_at FROM users WHERE role = "customer" ORDER BY id DESC')]);
    }

    if (str_starts_with($path, '/admin/reports/') && $method === 'GET') {
        require_user($db);
        json_response([
            'sales' => query_all($db, 'SELECT date(created_at) AS date, COUNT(*) AS orders, SUM(total_amount) AS total FROM orders GROUP BY date(created_at) ORDER BY date DESC'),
            'products' => query_all($db, 'SELECT p.name, p.stock, COALESCE(SUM(oi.quantity), 0) AS total_sold FROM products p LEFT JOIN order_items oi ON oi.product_id = p.id GROUP BY p.id ORDER BY total_sold DESC'),
            'customers' => query_all($db, 'SELECT u.name, u.email, COUNT(o.id) AS orders, COALESCE(SUM(o.total_amount), 0) AS total_spent FROM users u LEFT JOIN orders o ON o.user_id = u.id WHERE u.role = "customer" GROUP BY u.id ORDER BY total_spent DESC'),
        ]);
    }

    json_response(['error' => 'Route not found', 'path' => $path], 404);
} catch (Throwable $error) {
    json_response(['error' => $error->getMessage()], 500);
}
