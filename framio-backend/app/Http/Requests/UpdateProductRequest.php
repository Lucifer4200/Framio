<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'category_id' => 'nullable|exists:categories,id',
            'name' => 'sometimes|string|max:255',
            'slug' => "sometimes|string|max:255|unique:products,slug,{$id}",
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0|lt:price',
            'stock' => 'nullable|integer|min:0',
            'frame_type' => 'nullable|string|max:50',
            'size' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:50',
            'status' => 'nullable|in:active,inactive',
        ];
    }
}
