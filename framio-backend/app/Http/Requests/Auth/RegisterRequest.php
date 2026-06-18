<?php

namespace App\Http\Requests\Auth;

use App\Http\Requests\Request;

class RegisterRequest extends Request
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required|min:3|max:255',
            'email' => 'required|email|max:255',
            'password' => 'required|min:6|max:255',
            'phone' => 'nullable|max:20',
            'role' => 'nullable|in:customer,admin',
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
            'email.email' => 'Please provide a valid email address',
            'password.min' => 'Password must be at least 6 characters',
            'role.in' => 'Role must be either customer or admin',
        ];
    }
}
