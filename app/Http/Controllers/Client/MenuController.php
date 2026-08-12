<?php

namespace App\Http\Controllers\Client;

use App\Models\Category;
use Inertia\Inertia;
use Inertia\Response;

class MenuController extends ClientController
{
    public function index(string $token): Response
    {
        $salon = $this->resolveSalon($token);
        $session = $salon->activeSession();

        $categories = Category::query()
            ->where('visible', true)
            ->orderBy('sort_order')
            ->with(['products' => function ($query) {
                $query->where('visible_menu', true)->orderBy('sort_order');
            }])
            ->get()
            ->map(fn (Category $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'products' => $category->products->map(fn ($product) => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'description' => $product->description,
                    'price' => $product->price,
                    'photo' => $product->photo,
                    'available' => $product->available,
                ]),
            ])
            ->filter(fn ($category) => $category['products']->isNotEmpty())
            ->values();

        return Inertia::render('Client/Menu', [
            'salon' => [
                'token' => $salon->qr_token,
                'name' => $salon->name,
            ],
            'categories' => $categories,
            'session' => $session ? [
                'ordersCount' => $session->orders()->count(),
                'total' => $session->total,
            ] : null,
        ]);
    }
}
