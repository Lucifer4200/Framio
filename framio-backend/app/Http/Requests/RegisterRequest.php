<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|min:3|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:6|max:255',
            'phone' => 'nullable|string|max:20',
            'role' => 'nullable|in:customer,admin',
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'Email already registered',
            'email.email' => 'Please provide a valid email address',
            'password.min' => 'Password must be at least 6 characters',
            'role.in' => 'Role must be either customer or admin',
        ];
    }
}
