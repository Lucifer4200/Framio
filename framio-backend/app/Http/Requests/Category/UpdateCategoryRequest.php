<?php

namespace App\Http\Requests\Category;

use App\Http\Requests\Request;

class UpdateCategoryRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        // Only admin can update categories
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
            'image' => 'nullable|url',
            'description' => 'nullable',
            'status' => 'nullable|in:active,inactive',
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
            'name.min' => 'Category name must be at least 3 characters',
            'image.url' => 'Image must be a valid URL',
            'status.in' => 'Status must be either active or inactive',
        ];
    }
}
