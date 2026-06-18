<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Helpers\Auth;
use App\Helpers\ApiResponse;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;

class CategoryController
{
    public function index()
    {
        $categories = Category::all();
        ApiResponse::success(['categories' => $categories]);
    }
    
    public function show($id)
    {
        $category = Category::find($id);
        
        if (!$category) {
            ApiResponse::notFound('Category not found');
        }
        
        ApiResponse::success(['category' => $category]);
    }
    
    public function store(StoreCategoryRequest $request)
    {
        $data = $request->all();
        
        // Generate slug if not provided
        if (empty($data['slug'])) {
            $data['slug'] = strtolower(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['name']));
        }
        
        $categoryId = Category::create($data);
        $category = Category::find($categoryId);
        
        ApiResponse::created(['category' => $category], 'Category created successfully');
    }
    
    public function update($id, UpdateCategoryRequest $request)
    {
        $data = $request->all();
        
        $category = Category::find($id);
        if (!$category) {
            ApiResponse::notFound('Category not found');
        }
        
        Category::updateStatic($id, $data);
        $updatedCategory = Category::find($id);
        
        ApiResponse::success(['category' => $updatedCategory], 'Category updated successfully');
    }
    
    public function destroy($id)
    {
        $user = Auth::requireAdmin();
        
        $category = Category::find($id);
        if (!$category) {
            ApiResponse::notFound('Category not found');
        }
        
        Category::deleteStatic($id);
        
        ApiResponse::success(null, 'Category deleted successfully');
    }
}
