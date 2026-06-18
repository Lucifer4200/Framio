<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\WishlistController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'Framio API',
        'version' => '1.0.0',
        'timestamp' => now()->toDateTimeString(),
    ]);
});

Route::controller(AuthController::class)->prefix('auth')->group(function () {
    Route::post('register', 'register')->name('auth.register');
    Route::post('login', 'login')->name('auth.login');
    Route::post('logout', 'logout')->middleware('auth.token')->name('auth.logout');
    Route::get('me', 'me')->middleware('auth.token')->name('auth.me');
});

Route::get('categories', [CategoryController::class, 'index'])->name('categories.index');
Route::get('categories/{id}', [CategoryController::class, 'show'])->name('categories.show');

Route::middleware(['auth.token', 'admin.token'])->group(function () {
    Route::post('categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::put('categories/{id}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('categories/{id}', [CategoryController::class, 'destroy'])->name('categories.destroy');
});

Route::get('products', [ProductController::class, 'index'])->name('products.index');
Route::get('products/{id}', [ProductController::class, 'show'])->name('products.show');

Route::middleware(['auth.token', 'admin.token'])->group(function () {
    Route::post('products', [ProductController::class, 'store'])->name('products.store');
    Route::put('products/{id}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('products/{id}', [ProductController::class, 'destroy'])->name('products.destroy');
});

Route::middleware('auth.token')->group(function () {
    Route::get('cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('cart/add', [CartController::class, 'add'])->name('cart.add');
    Route::post('cart/update', [CartController::class, 'update'])->name('cart.update');
    Route::post('cart/remove', [CartController::class, 'remove'])->name('cart.remove');
    Route::post('cart/clear', [CartController::class, 'clear'])->name('cart.clear');

    Route::get('wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
    Route::post('wishlist/add', [WishlistController::class, 'add'])->name('wishlist.add');
    Route::post('wishlist/remove', [WishlistController::class, 'remove'])->name('wishlist.remove');
    Route::post('wishlist/clear', [WishlistController::class, 'clear'])->name('wishlist.clear');

    Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
    Route::post('orders', [OrderController::class, 'store'])->name('orders.store');
    Route::get('orders/{id}', [OrderController::class, 'show'])->name('orders.show');

    Route::get('payments/order/{orderId}', [PaymentController::class, 'show'])->name('payments.show');
    Route::post('payments', [PaymentController::class, 'store'])->name('payments.store');
});

Route::middleware(['auth.token', 'admin.token'])->prefix('admin')->group(function () {
    Route::get('dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('reports/sales', [AdminController::class, 'salesReport'])->name('admin.reports.sales');
    Route::get('reports/products', [AdminController::class, 'productReport'])->name('admin.reports.products');
    Route::get('reports/customers', [AdminController::class, 'customerReport'])->name('admin.reports.customers');
    Route::get('orders', [AdminController::class, 'allOrders'])->name('admin.orders');
    Route::get('customers', [AdminController::class, 'allCustomers'])->name('admin.customers');

    Route::put('orders/{id}/status', [OrderController::class, 'updateStatus'])->name('orders.updateStatus');
    Route::put('payments/{id}/status', [PaymentController::class, 'updateStatus'])->name('payments.updateStatus');
});
