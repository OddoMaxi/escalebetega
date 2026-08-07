<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            ['name' => "Jus d'Ananas", 'category' => 'Jus Naturels', 'description' => 'Ananas frais pressé', 'price' => 25000],
            ['name' => 'Jus de Mangue', 'category' => 'Jus Naturels', 'description' => 'Mangue fraîche', 'price' => 30000],
            ['name' => "Jus d'Orange", 'category' => 'Jus Naturels', 'description' => 'Orange fraîche', 'price' => 25000],
            ['name' => 'Jus de Gingembre', 'category' => 'Jus Naturels', 'description' => 'Gingembre frais', 'price' => 20000],
            ['name' => 'Coco Fraîche', 'category' => 'Coco Fraîche', 'description' => '100% fraîche', 'price' => 20000],
            ['name' => 'Cocktail Mangue', 'category' => 'Cocktails', 'description' => 'Saveurs tropicales', 'price' => 35000],
        ];

        foreach ($products as $index => $data) {
            $category = Category::where('name', $data['category'])->first();

            if (! $category) {
                continue;
            }

            Product::firstOrCreate(
                ['slug' => Str::slug($data['name'])],
                [
                    'category_id' => $category->id,
                    'name' => $data['name'],
                    'description' => $data['description'],
                    'price' => $data['price'],
                    'sort_order' => $index + 1,
                ]
            );
        }
    }
}
