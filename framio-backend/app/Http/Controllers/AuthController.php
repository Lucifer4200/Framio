<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Helpers\Auth;
use App\Helpers\ApiResponse;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;

class AuthController
{
    public function register(RegisterRequest $request)
    {
        $data = $request->all();
        
        // Check if email already exists
        $existingUser = User::findByEmail($data['email']);
        if ($existingUser) {
            ApiResponse::error('Email already registered', 409);
        }
        
        // Create user
        $userId = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'phone' => $data['phone'] ?? null,
            'role' => $data['role'] ?? 'customer'
        ]);
        
        $user = User::find($userId);
        $token = Auth::generateToken($userId, $user['role']);
        
        ApiResponse::created([
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role']
            ],
            'token' => $token,
            'token_type' => 'Bearer'
        ], 'Registration successful');
    }
    
    public function login(LoginRequest $request)
    {
        
        $data = $request->all();
        
        // Find user
        $user = User::findByEmail($data['email']);
        if (!$user) {
            ApiResponse::unauthorized('Invalid credentials');
        }
        
        // Verify password
        if (!password_verify($data['password'], $user['password'])) {
            ApiResponse::unauthorized('Invalid credentials');
        }
        
        // Check user status
        if ($user['status'] !== 'active') {
            ApiResponse::forbidden('Account is inactive');
        }
        
        $token = Auth::generateToken($user['id'], $user['role']);
        
        ApiResponse::success([
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role']
            ],
            'token' => $token,
            'token_type' => 'Bearer'
        ], 'Login successful');
    }
    
    public function logout()
    {
        // In a real implementation, you would blacklist the token
        ApiResponse::success(null, 'Logout successful');
    }
    
    public function me()
    {
        $user = Auth::requireAuth();
        
        ApiResponse::success([
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'phone' => $user['phone'],
                'role' => $user['role']
            ]
        ]);
    }
}
