<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = ['Electronics', 'Books', 'Clothing', 'Home', 'Toys'];

        foreach ($categories as $name) {
            Category::firstOrCreate(
                ['slug' => strtolower(str_replace(' ', '-', $name))],
                [
                    'name' => $name,
                    'image' => null,
                    'status' => 'active',
                ]
            );
        }
    }
}
