<?php

namespace App\Http\Requests\Product;

use App\Http\Requests\Request;

class UpdateProductRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        // Only admin can update products
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
            'name' => 'nullable|min:3|max:255',
            'slug' => 'nullable|max:255',
            'description' => 'nullable',
            'price' => 'nullable|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'category_id' => 'nullable|integer',
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
            'name.min' => 'Product name must be at least 3 characters',
            'price.numeric' => 'Price must be a valid number',
            'stock.integer' => 'Stock must be a whole number',
            'category_id.integer' => 'Category ID must be a valid integer',
            'status.in' => 'Status must be either active or inactive',
        ];
    }
}
