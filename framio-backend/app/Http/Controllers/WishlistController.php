<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use App\Helpers\Auth;

class WishlistController
{
    public function index()
    {
        $user = Auth::requireAuth();
        
        $items = Wishlist::findByUser($user['id']);
        
        echo json_encode(['items' => $items]);
    }
    
    public function add()
    {
        $user = Auth::requireAuth();
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validation
        if (empty($data['product_id'])) {
            http_response_code(422);
            echo json_encode(['error' => 'Product ID is required']);
            return;
        }
        
        $success = Wishlist::add($user['id'], $data['product_id']);
        
        if (!$success) {
            http_response_code(400);
            echo json_encode(['error' => 'Product already in wishlist']);
            return;
        }
        
        $items = Wishlist::findByUser($user['id']);
        
        echo json_encode([
            'message' => 'Product added to wishlist successfully',
            'items' => $items
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
        
        Wishlist::remove($user['id'], $data['product_id']);
        
        $items = Wishlist::findByUser($user['id']);
        
        echo json_encode([
            'message' => 'Product removed from wishlist successfully',
            'items' => $items
        ]);
    }
    
    public function clear()
    {
        $user = Auth::requireAuth();
        
        Wishlist::clear($user['id']);
        
        echo json_encode(['message' => 'Wishlist cleared successfully']);
    }
}
