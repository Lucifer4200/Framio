<?php

namespace App\Http\Requests\Product;

use App\Http\Requests\Request;

class StoreProductRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        // Only admin can create products
        $user = \App\Helpers\Auth::user();
        return $user && $user['role'] === 'admin';
    }
    
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required|min:3|max:255',
            'slug' => 'nullable|max:255',
            'description' => 'nullable',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category_id' => 'required|integer',
            'frame_type' => 'nullable|max:100',
            'size' => 'nullable|max:100',
            'color' => 'nullable|max:100',
            'status' => 'nullable|in:active,inactive',
            'images' => 'nullable|array',
        ];
    }
    
    /**
     * Get custom error messages for validator errors.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'name.required' => 'Product name is required',
            'price.required' => 'Product price is required',
            'price.numeric' => 'Price must be a valid number',
            'stock.required' => 'Stock quantity is required',
            'stock.integer' => 'Stock must be a whole number',
            'category_id.required' => 'Category is required',
            'category_id.integer' => 'Category ID must be a valid integer',
            'status.in' => 'Status must be either active or inactive',
        ];
    }
}
