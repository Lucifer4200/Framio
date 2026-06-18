<?php

require_once __DIR__ . '/../app/Helpers/Database.php';
require_once __DIR__ . '/../config/database.php';

use App\Helpers\Database;

// Clear existing data (optional - comment out if you want to preserve data)
echo "Clearing existing data...\n";
Database::query("DELETE FROM wishlists");
Database::query("DELETE FROM reviews");
Database::query("DELETE FROM order_items");
Database::query("DELETE FROM orders");
Database::query("DELETE FROM payments");
Database::query("DELETE FROM cart_items");
Database::query("DELETE FROM carts");
Database::query("DELETE FROM product_images");
Database::query("DELETE FROM products");
Database::query("DELETE FROM categories");
Database::query("DELETE FROM users");

echo "Seeding categories...\n";

// Insert Categories
$categories = [
    ['name' => 'Photo Frames', 'slug' => 'photo-frames', 'image' => 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=400', 'status' => 'active'],
    ['name' => 'Art Frames', 'slug' => 'art-frames', 'image' => 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400', 'status' => 'active'],
    ['name' => 'Wall Décor', 'slug' => 'wall-decor', 'image' => 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=400', 'status' => 'active'],
    ['name' => 'Mirror Frames', 'slug' => 'mirror-frames', 'image' => 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400', 'status' => 'active'],
];

foreach ($categories as $category) {
    Database::query(
        "INSERT INTO categories (name, slug, image, status, created_at, updated_at) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))",
        [$category['name'], $category['slug'], $category['image'], $category['status']]
    );
}

echo "Seeding users...\n";

// Insert Users
$users = [
    ['name' => 'Admin User', 'email' => 'admin@framio.com', 'password' => password_hash('admin123', PASSWORD_DEFAULT), 'role' => 'admin', 'phone' => '+1234567890'],
    ['name' => 'John Doe', 'email' => 'john@example.com', 'password' => password_hash('password123', PASSWORD_DEFAULT), 'role' => 'customer', 'phone' => '+1234567891'],
    ['name' => 'Jane Smith', 'email' => 'jane@example.com', 'password' => password_hash('password123', PASSWORD_DEFAULT), 'role' => 'customer', 'phone' => '+1234567892'],
    ['name' => 'Bob Wilson', 'email' => 'bob@example.com', 'password' => password_hash('password123', PASSWORD_DEFAULT), 'role' => 'customer', 'phone' => '+1234567893'],
];

foreach ($users as $user) {
    Database::query(
        "INSERT INTO users (name, email, password, role, phone, created_at, updated_at) VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))",
        [$user['name'], $user['email'], $user['password'], $user['role'], $user['phone']]
    );
}

echo "Seeding products...\n";

// Insert Products with detailed descriptions and images
$products = [
    [
        'category_id' => 1,
        'name' => 'Classic Oak Photo Frame',
        'slug' => 'classic-oak-photo-frame',
        'description' => 'Elevate your cherished memories with our Classic Oak Photo Frame. Crafted from premium solid oak wood, this timeless piece features a natural finish that complements any home décor. The frame includes a high-quality glass front and a sturdy backing board to protect your photographs. Perfect for displaying family portraits, vacation snapshots, or artistic prints. The warm tones of the oak wood add a touch of elegance to any room, making it an ideal choice for both traditional and modern interiors.',
        'price' => 89.99,
        'discount_price' => 79.99,
        'stock' => 50,
        'frame_type' => 'Wood',
        'size' => '8x10 inches',
        'color' => 'Natural Oak',
        'status' => 'active',
        'images' => [
            'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=800',
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
            'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800'
        ]
    ],
    [
        'category_id' => 1,
        'name' => 'Modern Black Metal Frame',
        'slug' => 'modern-black-metal-frame',
        'description' => 'Make a bold statement with our Modern Black Metal Frame. This sleek, contemporary frame features a matte black finish that adds sophistication to any space. The durable metal construction ensures longevity while the minimalist design allows your artwork to take center stage. Ideal for black and white photographs, modern art prints, or minimalist designs. The frame includes a clear acrylic front and easy-to-use mounting hardware for hassle-free installation.',
        'price' => 65.00,
        'discount_price' => null,
        'stock' => 75,
        'frame_type' => 'Metal',
        'size' => '11x14 inches',
        'color' => 'Black',
        'status' => 'active',
        'images' => [
            'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
            'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800'
        ]
    ],
    [
        'category_id' => 2,
        'name' => 'Gold Leaf Art Frame',
        'slug' => 'gold-leaf-art-frame',
        'description' => 'Add a touch of luxury to your art collection with our Gold Leaf Art Frame. Handcrafted with genuine gold leaf accents, this exquisite frame transforms any artwork into a masterpiece. The ornate detailing and rich gold finish create a stunning visual impact, perfect for displaying valuable paintings, limited edition prints, or family heirlooms. The frame features a velvet backing and museum-quality glass to preserve your precious artwork for generations.',
        'price' => 249.99,
        'discount_price' => 199.99,
        'stock' => 25,
        'frame_type' => 'Wood',
        'size' => '16x20 inches',
        'color' => 'Gold',
        'status' => 'active',
        'images' => [
            'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800',
            'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800'
        ]
    ],
    [
        'category_id' => 2,
        'name' => 'Gallery White Floating Frame',
        'slug' => 'gallery-white-floating-frame',
        'description' => 'Create a gallery-worthy display with our Gallery White Floating Frame. This innovative frame design creates a floating effect, making your artwork appear to hover within the frame. The crisp white border adds a clean, modern aesthetic that brightens any space. Perfect for canvas prints, watercolor paintings, or mixed media artwork. The frame includes acid-free matting and UV-protective glass to ensure your artwork remains vibrant and protected.',
        'price' => 129.99,
        'discount_price' => null,
        'stock' => 40,
        'frame_type' => 'Wood',
        'size' => '18x24 inches',
        'color' => 'White',
        'status' => 'active',
        'images' => [
            'https://images.unsplash.com/photo-1507643179173-617d6c4965a9?w=800',
            'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=800'
        ]
    ],
    [
        'category_id' => 3,
        'name' => 'Rustic Wall Art Set',
        'slug' => 'rustic-wall-art-set',
        'description' => 'Transform your walls with our Rustic Wall Art Set. This curated collection features three complementary pieces that work together to create a cohesive display. Each piece showcases reclaimed wood with natural grain patterns and weathered finishes. The set includes various sizes and orientations, allowing for versatile arrangement options. Perfect for adding warmth and character to living rooms, dining areas, or entryways. The rustic aesthetic pairs beautifully with farmhouse, industrial, or eclectic décor styles.',
        'price' => 189.99,
        'discount_price' => 159.99,
        'stock' => 30,
        'frame_type' => 'Wood',
        'size' => 'Various',
        'color' => 'Brown',
        'status' => 'active',
        'images' => [
            'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=800',
            'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800'
        ]
    ],
    [
        'category_id' => 3,
        'name' => 'Geometric Metal Wall Sculpture',
        'slug' => 'geometric-metal-wall-sculpture',
        'description' => 'Add contemporary flair to your space with our Geometric Metal Wall Sculpture. This striking piece features interlocking geometric shapes in brushed gold and silver finishes. The three-dimensional design creates dynamic shadows and visual interest as light changes throughout the day. Perfect for modern living rooms, offices, or entryways. The sculpture includes integrated mounting hardware for easy installation and can be displayed horizontally or vertically to suit your space.',
        'price' => 159.99,
        'discount_price' => null,
        'stock' => 35,
        'frame_type' => 'Metal',
        'size' => '24x36 inches',
        'color' => 'Gold/Silver',
        'status' => 'active',
        'images' => [
            'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
            'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800'
        ]
    ],
    [
        'category_id' => 4,
        'name' => 'Ornate Baroque Mirror Frame',
        'slug' => 'ornate-baroque-mirror-frame',
        'description' => 'Make a grand statement with our Ornate Baroque Mirror Frame. This exquisite piece features intricate carvings and scrollwork inspired by 17th-century European design. The antique gold finish adds warmth and sophistication, while the high-quality mirror provides excellent reflection. Perfect for entryways, bedrooms, or dining rooms where you want to create a focal point. The frame includes D-rings for secure wall mounting and can be displayed horizontally or vertically.',
        'price' => 349.99,
        'discount_price' => 299.99,
        'stock' => 15,
        'frame_type' => 'Wood',
        'size' => '30x40 inches',
        'color' => 'Antique Gold',
        'status' => 'active',
        'images' => [
            'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800',
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'
        ]
    ],
    [
        'category_id' => 4,
        'name' => 'Minimalist Round Mirror',
        'slug' => 'minimalist-round-mirror',
        'description' => 'Achieve modern simplicity with our Minimalist Round Mirror. This sleek design features a thin brass frame that adds elegance without overwhelming the space. The round shape softens angular lines in your room while providing functional reflection. Perfect for bathrooms, bedrooms, or as an accent piece in living areas. The mirror includes a leather hanging strap for a stylish alternative to traditional mounting hardware.',
        'price' => 119.99,
        'discount_price' => null,
        'stock' => 45,
        'frame_type' => 'Metal',
        'size' => '24 inches diameter',
        'color' => 'Brass',
        'status' => 'active',
        'images' => [
            'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800',
            'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800'
        ]
    ],
    [
        'category_id' => 1,
        'name' => 'Vintage Distressed Frame',
        'slug' => 'vintage-distressed-frame',
        'description' => 'Add character to your photos with our Vintage Distressed Frame. Each frame is hand-finished to achieve an authentic aged appearance with subtle wear patterns and a warm patina. The distressed finish tells a story while protecting your cherished memories. Perfect for displaying vintage photographs, family heirlooms, or creating a gallery wall with nostalgic appeal. The frame includes glass and backing for complete protection.',
        'price' => 75.00,
        'discount_price' => 59.99,
        'stock' => 60,
        'frame_type' => 'Wood',
        'size' => '5x7 inches',
        'color' => 'Distressed Brown',
        'status' => 'active',
        'images' => [
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
            'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=800'
        ]
    ],
    [
        'category_id' => 2,
        'name' => 'Contemporary Shadow Box Frame',
        'slug' => 'contemporary-shadow-box-frame',
        'description' => 'Display three-dimensional art and memorabilia with our Contemporary Shadow Box Frame. This deep-set frame allows you to showcase objects, pressed flowers, medals, or collectibles with depth and dimension. The white matting creates a clean gallery look while the black frame provides elegant contrast. Perfect for creating personalized displays that tell your unique story. The frame includes easy-open tabs for convenient access to change displays.',
        'price' => 95.00,
        'discount_price' => null,
        'stock' => 55,
        'frame_type' => 'Wood',
        'size' => '12x16 inches',
        'color' => 'Black',
        'status' => 'active',
        'images' => [
            'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
            'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800'
        ]
    ],
];

foreach ($products as $product) {
    $images = $product['images'];
    unset($product['images']);
    
    Database::query(
        "INSERT INTO products (category_id, name, slug, description, price, discount_price, stock, frame_type, size, color, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))",
        [
            $product['category_id'],
            $product['name'],
            $product['slug'],
            $product['description'],
            $product['price'],
            $product['discount_price'],
            $product['stock'],
            $product['frame_type'],
            $product['size'],
            $product['color'],
            $product['status']
        ]
    );
    
    $productId = Database::lastInsertId();
    
    // Insert product images
    foreach ($images as $index => $imageUrl) {
        $isPrimary = ($index === 0) ? 1 : 0;
        Database::query(
            "INSERT INTO product_images (product_id, image_url, is_primary, created_at, updated_at) VALUES (?, ?, ?, datetime('now'), datetime('now'))",
            [$productId, $imageUrl, $isPrimary]
        );
    }
}

echo "Seeding reviews...\n";

// Insert Reviews
$reviews = [
    ['user_id' => 2, 'product_id' => 1, 'rating' => 5, 'comment' => 'Absolutely beautiful frame! The oak wood quality exceeded my expectations. Perfect for our family portrait.'],
    ['user_id' => 2, 'product_id' => 2, 'rating' => 4, 'comment' => 'Great modern frame, very sleek. Would have given 5 stars but the mounting hardware could be better.'],
    ['user_id' => 3, 'product_id' => 3, 'rating' => 5, 'comment' => 'This gold leaf frame is stunning! Worth every penny. My painting looks like a museum piece now.'],
    ['user_id' => 3, 'product_id' => 4, 'rating' => 5, 'comment' => 'Love the floating effect! The white color brightens up my living room perfectly.'],
    ['user_id' => 4, 'product_id' => 5, 'rating' => 4, 'comment' => 'Nice rustic set, adds great character to my dining room. One piece had a minor scratch but not noticeable.'],
    ['user_id' => 4, 'product_id' => 6, 'rating' => 5, 'comment' => 'The geometric design is incredible! Creates amazing shadows when the light hits it.'],
    ['user_id' => 2, 'product_id' => 7, 'rating' => 5, 'comment' => 'This mirror is absolutely gorgeous! The baroque detailing is exquisite. A true statement piece.'],
    ['user_id' => 3, 'product_id' => 8, 'rating' => 4, 'comment' => 'Simple and elegant. The brass finish is beautiful. Perfect for my bathroom.'],
    ['user_id' => 4, 'product_id' => 9, 'rating' => 5, 'comment' => 'The distressed finish looks so authentic! Great for vintage photos.'],
    ['user_id' => 2, 'product_id' => 10, 'rating' => 4, 'comment' => 'Perfect for displaying my medals. The shadow box depth is just right.'],
];

foreach ($reviews as $review) {
    Database::query(
        "INSERT INTO reviews (user_id, product_id, rating, comment, created_at, updated_at) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))",
        [$review['user_id'], $review['product_id'], $review['rating'], $review['comment']]
    );
}

echo "Seeding sample orders...\n";

// Insert Sample Orders
$orders = [
    ['user_id' => 2, 'order_number' => 'ORD-001', 'total_amount' => 169.98, 'payment_status' => 'paid', 'order_status' => 'delivered', 'shipping_address' => '123 Main St, City, State 12345', 'billing_address' => '123 Main St, City, State 12345', 'phone' => '+1234567891'],
    ['user_id' => 3, 'order_number' => 'ORD-002', 'total_amount' => 349.99, 'payment_status' => 'paid', 'order_status' => 'shipped', 'shipping_address' => '456 Oak Ave, Town, State 67890', 'billing_address' => '456 Oak Ave, Town, State 67890', 'phone' => '+1234567892'],
    ['user_id' => 4, 'order_number' => 'ORD-003', 'total_amount' => 239.98, 'payment_status' => 'pending', 'order_status' => 'processing', 'shipping_address' => '789 Pine Rd, Village, State 11223', 'billing_address' => '789 Pine Rd, Village, State 11223', 'phone' => '+1234567893'],
];

foreach ($orders as $order) {
    Database::query(
        "INSERT INTO orders (user_id, order_number, total_amount, payment_status, order_status, shipping_address, billing_address, phone, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))",
        [
            $order['user_id'],
            $order['order_number'],
            $order['total_amount'],
            $order['payment_status'],
            $order['order_status'],
            $order['shipping_address'],
            $order['billing_address'],
            $order['phone']
        ]
    );
    
    $orderId = Database::lastInsertId();
    
    // Insert order items
    if ($order['order_number'] === 'ORD-001') {
        Database::query("INSERT INTO order_items (order_id, product_id, quantity, price, created_at, updated_at) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))", [$orderId, 1, 2, 89.99]);
    } elseif ($order['order_number'] === 'ORD-002') {
        Database::query("INSERT INTO order_items (order_id, product_id, quantity, price, created_at, updated_at) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))", [$orderId, 7, 1, 349.99]);
    } elseif ($order['order_number'] === 'ORD-003') {
        Database::query("INSERT INTO order_items (order_id, product_id, quantity, price, created_at, updated_at) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))", [$orderId, 5, 1, 189.99]);
        Database::query("INSERT INTO order_items (order_id, product_id, quantity, price, created_at, updated_at) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))", [$orderId, 6, 1, 49.99]);
    }
}

echo "Seeding sample wishlist items...\n";

// Insert Wishlist Items
$wishlistItems = [
    ['user_id' => 2, 'product_id' => 3],
    ['user_id' => 2, 'product_id' => 7],
    ['user_id' => 3, 'product_id' => 1],
    ['user_id' => 3, 'product_id' => 8],
    ['user_id' => 4, 'product_id' => 4],
    ['user_id' => 4, 'product_id' => 10],
];

foreach ($wishlistItems as $item) {
    Database::query(
        "INSERT INTO wishlists (user_id, product_id, created_at, updated_at) VALUES (?, ?, datetime('now'), datetime('now'))",
        [$item['user_id'], $item['product_id']]
    );
}

echo "\nDatabase seeded successfully!\n";
echo "Admin login: admin@framio.com / admin123\n";
echo "Customer login: john@example.com / password123\n";
