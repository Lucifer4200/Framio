<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Helpers\Auth;

class CartController
{
    public function index()
    {
        $user = Auth::requireAuth();
        
        $cart = Cart::findByUser($user['id']);
        $items = Cart::getItems($cart['id']);
        $total = Cart::getTotal($cart['id']);
        
        echo json_encode([
            'cart_id' => $cart['id'],
            'items' => $items,
            'total' => $total
        ]);
    }
    
    public function add()
    {
        $user = Auth::requireAuth();
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validation
        if (empty($data['product_id']) || empty($data['quantity'])) {
            http_response_code(422);
            echo json_encode(['error' => 'Product ID and quantity are required']);
            return;
        }
        
        $cart = Cart::findByUser($user['id']);
        $success = Cart::addItem($cart['id'], $data['product_id'], $data['quantity']);
        
        if (!$success) {
            http_response_code(400);
            echo json_encode(['error' => 'Could not add item to cart (insufficient stock or product not found)']);
            return;
        }
        
        $items = Cart::getItems($cart['id']);
        $total = Cart::getTotal($cart['id']);
        
        echo json_encode([
            'message' => 'Item added to cart successfully',
            'cart_id' => $cart['id'],
            'items' => $items,
            'total' => $total
        ]);
    }
    
    public function update()
    {
        $user = Auth::requireAuth();
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validation
        if (empty($data['product_id']) || empty($data['quantity'])) {
            http_response_code(422);
            echo json_encode(['error' => 'Product ID and quantity are required']);
            return;
        }
        
        $cart = Cart::findByUser($user['id']);
        $success = Cart::updateItem($cart['id'], $data['product_id'], $data['quantity']);
        
        if (!$success) {
            http_response_code(400);
            echo json_encode(['error' => 'Could not update item (insufficient stock or product not found)']);
            return;
        }
        
        $items = Cart::getItems($cart['id']);
        $total = Cart::getTotal($cart['id']);
        
        echo json_encode([
            'message' => 'Cart updated successfully',
            'cart_id' => $cart['id'],
            'items' => $items,
            'total' => $total
        ]);
    }
    
    public function remove()
    {
        $user = Auth::requireAuth();
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validation
        if (empty($data['product_id'])) {
            http_response_code(422);
            echo json_encode(['error' => 'Product ID is required']);
            return;
        }
        
        $cart = Cart::findByUser($user['id']);
        Cart::removeItem($cart['id'], $data['product_id']);
        
        $items = Cart::getItems($cart['id']);
        $total = Cart::getTotal($cart['id']);
        
        echo json_encode([
            'message' => 'Item removed from cart successfully',
            'cart_id' => $cart['id'],
            'items' => $items,
            'total' => $total
        ]);
    }
    
    public function clear()
    {
        $user = Auth::requireAuth();
        
        $cart = Cart::findByUser($user['id']);
        Cart::clear($cart['id']);
        
        echo json_encode(['message' => 'Cart cleared successfully']);
    }
}
