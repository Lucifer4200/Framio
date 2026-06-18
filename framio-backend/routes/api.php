<?php

// Load autoloader
require_once __DIR__ . '/../app/autoload.php';

// Load helpers
require_once __DIR__ . '/../app/Helpers/Database.php';
require_once __DIR__ . '/../app/Helpers/Auth.php';

// Load Router
require_once __DIR__ . '/../app/Http/Router.php';

// Import controllers and requests
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\AdminController;

use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;

use App\Http\Router;

// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Professional Route Definitions

// Authentication Routes
Router::group(['prefix' => 'auth'], function() {
    Router::post('register', function() {
        $controller = new AuthController();
        $request = new RegisterRequest();
        $controller->register($request);
    })->name('auth.register');

    Router::post('login', function() {
        $controller = new AuthController();
        $request = new LoginRequest();
        $controller->login($request);
    })->name('auth.login');

    Router::post('logout', [AuthController::class, 'logout'])->name('auth.logout');
    Router::get('me', [AuthController::class, 'me'])->name('auth.me');
});

// Category Routes - Standard API Resource with request handling
Router::get('categories', function() {
    $controller = new CategoryController();
    $controller->index();
})->name('categories.index');

Router::post('categories', function() {
    $controller = new CategoryController();
    $request = new StoreCategoryRequest();
    $controller->store($request);
})->name('categories.store');

Router::get('categories/{id}', function($id) {
    $controller = new CategoryController();
    $controller->show($id);
})->name('categories.show');

Router::put('categories/{id}', function($id) {
    $controller = new CategoryController();
    $request = new UpdateCategoryRequest();
    $controller->update($id, $request);
})->name('categories.update');

Router::delete('categories/{id}', function($id) {
    $controller = new CategoryController();
    $controller->destroy($id);
})->name('categories.destroy');

// Product Routes - Standard API Resource with request handling
Router::get('products', function() {
    $controller = new ProductController();
    $controller->index();
})->name('products.index');

Router::post('products', function() {
    $controller = new ProductController();
    $request = new StoreProductRequest();
    $controller->store($request);
})->name('products.store');

Router::get('products/{id}', function($id) {
    $controller = new ProductController();
    $controller->show($id);
})->name('products.show');

Router::put('products/{id}', function($id) {
    $controller = new ProductController();
    $request = new UpdateProductRequest();
    $controller->update($id, $request);
})->name('products.update');

Router::delete('products/{id}', function($id) {
    $controller = new ProductController();
    $controller->destroy($id);
})->name('products.destroy');

// Cart Routes - Controller Grouping for custom actions
Router::controller(CartController::class)->group(function() {
    Router::get('cart', 'index')->name('cart.index');
    Router::post('cart/add', 'add')->name('cart.add');
    Router::post('cart/update', 'update')->name('cart.update');
    Router::post('cart/remove', 'remove')->name('cart.remove');
    Router::post('cart/clear', 'clear')->name('cart.clear');
});

// Wishlist Routes - Controller Grouping for custom actions
Router::controller(WishlistController::class)->group(function() {
    Router::get('wishlist', 'index')->name('wishlist.index');
    Router::post('wishlist/add', 'add')->name('wishlist.add');
    Router::post('wishlist/remove', 'remove')->name('wishlist.remove');
    Router::post('wishlist/clear', 'clear')->name('wishlist.clear');
});

// Order Routes - Resource + Custom Actions with request handling
Router::get('orders', function() {
    $controller = new OrderController();
    $controller->index();
})->name('orders.index');

Router::post('orders', function() {
    $controller = new OrderController();
    $controller->store();
})->name('orders.store');

Router::get('orders/{id}', function($id) {
    $controller = new OrderController();
    $controller->show($id);
})->name('orders.show');

Router::put('orders/{id}/status', function($id) {
    $controller = new OrderController();
    $controller->updateStatus($id);
})->name('orders.updateStatus');

// Payment Routes
Router::get('payments/order/{orderId}', function($orderId) {
    $controller = new PaymentController();
    $controller->show($orderId);
})->name('payments.show');

Router::post('payments', function() {
    $controller = new PaymentController();
    $controller->store();
})->name('payments.store');

Router::put('payments/{id}/status', function($id) {
    $controller = new PaymentController();
    $controller->updateStatus($id);
})->name('payments.updateStatus');

// Admin Routes - Grouped with middleware
Router::group(['prefix' => 'admin'], function() {
    Router::get('dashboard', function() {
        $controller = new AdminController();
        $controller->dashboard();
    })->name('admin.dashboard');

    Router::get('reports/sales', function() {
        $controller = new AdminController();
        $controller->salesReport();
    })->name('admin.reports.sales');

    Router::get('reports/products', function() {
        $controller = new AdminController();
        $controller->productReport();
    })->name('admin.reports.products');

    Router::get('reports/customers', function() {
        $controller = new AdminController();
        $controller->customerReport();
    })->name('admin.reports.customers');

    Router::get('orders', function() {
        $controller = new AdminController();
        $controller->allOrders();
    })->name('admin.orders');

    Router::get('customers', function() {
        $controller = new AdminController();
        $controller->allCustomers();
    })->name('admin.customers');
});

// Dispatch the current request
Router::dispatch();