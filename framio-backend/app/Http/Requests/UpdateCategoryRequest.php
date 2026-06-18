<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'name' => 'sometimes|string|max:255',
            'slug' => "sometimes|string|max:255|unique:categories,slug,{$id}",
            'image' => 'nullable|string|max:255',
            'status' => 'nullable|in:active,inactive',
        ];
    }
}
