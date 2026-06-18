<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@framio.com',
            'password' => bcrypt('password'),
            'phone' => '1234567890',
            'role' => 'admin',
            'status' => 'active',
        ]);

        User::create([
            'name' => 'Customer',
            'email' => 'customer@framio.com',
            'password' => bcrypt('password'),
            'phone' => '0987654321',
            'role' => 'customer',
            'status' => 'active',
        ]);
    }
}
