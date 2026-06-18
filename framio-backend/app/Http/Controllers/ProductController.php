<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use App\Helpers\Auth;
use App\Helpers\ApiResponse;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;

class ProductController
{
    public function index()
    {
        $filters = $_GET;
        $products = Product::all($filters);
        
        foreach ($products as &$product) {
            $product['images'] = ProductImage::findByProduct($product['id']);
            $product['average_rating'] = Product::getAverageRating($product['id']);
        }
        
        ApiResponse::success(['products' => $products]);
    }
    
    public function show($id)
    {
        $product = Product::find($id);
        
        if (!$product) {
            ApiResponse::notFound('Product not found');
        }
        
        $product['images'] = ProductImage::findByProduct($product['id']);
        $product['reviews'] = Product::getReviews($product['id']);
        $product['average_rating'] = Product::getAverageRating($product['id']);
        
        ApiResponse::success(['product' => $product]);
    }
    
    public function store(StoreProductRequest $request)
    {
        $data = $request->all();
        
        // Generate slug if not provided
        if (empty($data['slug'])) {
            $data['slug'] = strtolower(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['name']));
        }
        
        $productId = Product::create($data);
        $product = Product::find($productId);
        
        ApiResponse::created(['product' => $product], 'Product created successfully');
    }
    
    public function update($id, UpdateProductRequest $request)
    {
        $data = $request->all();
        
        $product = Product::find($id);
        if (!$product) {
            ApiResponse::notFound('Product not found');
        }
        
        Product::updateStatic($id, $data);
        $updatedProduct = Product::find($id);
        
        ApiResponse::success(['product' => $updatedProduct], 'Product updated successfully');
    }
    
    public function destroy($id)
    {
        $user = Auth::requireAdmin();
        
        $product = Product::find($id);
        if (!$product) {
            ApiResponse::notFound('Product not found');
        }
        
        Product::deleteStatic($id);
        
        ApiResponse::success(null, 'Product deleted successfully');
    }
}
