<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductCatalogSeeder extends Seeder
{
    /**
     * Real menu import (photos + prices supplied in /produit). Replaces the
     * placeholder seed menu — old products are deactivated rather than
     * deleted so they stay valid on any historical orders that reference
     * them.
     */
    public function run(): void
    {
        $categories = [
            ['slug' => 'jus-naturels-presses', 'name' => 'Jus naturels pressés', 'sort_order' => 1],
            ['slug' => 'jus-naturels', 'name' => 'Jus naturels', 'sort_order' => 2],
            ['slug' => 'coco', 'name' => 'Coco', 'sort_order' => 3],
            ['slug' => 'cocktails', 'name' => 'Cocktails', 'sort_order' => 4],
            ['slug' => 'specialites-escale', 'name' => 'Spécialités Escale', 'sort_order' => 5],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(['slug' => $category['slug']], $category);
        }

        $products = [
            ['name' => 'Jus d\'Ananas Pressé', 'category' => 'jus-naturels-presses', 'price' => 30000, 'image' => 'jus-ananas-presse.jpg'],
            ['name' => 'Jus de Pastèque Pressé', 'category' => 'jus-naturels-presses', 'price' => 25000, 'image' => 'jus-pasteque-presse.jpg'],
            ['name' => 'Jus d\'Orange Pressé', 'category' => 'jus-naturels-presses', 'price' => 25000, 'image' => 'jus-orange-presse.jpg'],
            ['name' => 'Jus de Gingembre', 'category' => 'jus-naturels', 'price' => 15000, 'image' => 'jus-gingembre.jpg'],
            ['name' => 'Jus de Bissap', 'category' => 'jus-naturels', 'price' => 15000, 'image' => 'jus-bissap.jpg'],
            ['name' => 'Coco Fraîche', 'category' => 'coco', 'price' => 20000, 'image' => 'coco-fraiche.jpg'],
            ['name' => 'Cocktail Naturel (Bissap + Gingembre)', 'category' => 'cocktails', 'price' => 20000, 'image' => 'cocktail-naturel.jpg'],
            ['name' => 'Cocktail Pressé', 'category' => 'cocktails', 'price' => 30000, 'image' => 'cocktail-presse.jpg'],
            ['name' => 'Virgin Mojito', 'category' => 'cocktails', 'price' => 30000, 'image' => 'virgin-mojito.jpg'],
            ['name' => 'Mojito', 'category' => 'cocktails', 'price' => 35000, 'image' => 'mojito.jpg'],
            ['name' => 'Cocktail Mix (Fruits de saison)', 'category' => 'cocktails', 'price' => 30000, 'image' => 'cocktail-mix.jpg'],
            ['name' => 'Menthe au Lait', 'category' => 'specialites-escale', 'price' => 25000, 'image' => 'menthe-au-lait.jpg'],
            ['name' => 'Coco au Lait', 'category' => 'specialites-escale', 'price' => 30000, 'image' => 'coco-au-lait.jpg'],
            ['name' => 'Takonko Milkshake', 'category' => 'specialites-escale', 'price' => 40000, 'image' => 'takonko-milkshake.jpg'],
        ];

        foreach ($products as $index => $data) {
            $category = Category::where('slug', $data['category'])->first();

            if (! $category) {
                continue;
            }

            Product::updateOrCreate(
                ['slug' => Str::slug($data['name'])],
                [
                    'category_id' => $category->id,
                    'name' => $data['name'],
                    'price' => $data['price'],
                    'photo' => '/images/products/'.$data['image'],
                    'available' => true,
                    'visible_menu' => true,
                    'sort_order' => $index + 1,
                ]
            );
        }

        // Retire the old placeholder menu from client view without deleting
        // it (existing orders still reference these product rows).
        Product::whereIn('name', [
            "Jus d'Ananas",
            'Jus de Mangue',
            "Jus d'Orange",
            'Jus de Gingembre',
            'Coco Fraîche',
            'Cocktail Mangue',
        ])->whereNotIn('slug', array_map(fn ($p) => Str::slug($p['name']), $products))
            ->update(['available' => false, 'visible_menu' => false]);
    }
}
