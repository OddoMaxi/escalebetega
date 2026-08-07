<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\StockItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        $products = Product::with('category')->orderBy('name')->get()->map(fn (Product $product) => [
            'id' => $product->id,
            'name' => $product->name,
            'category' => $product->category->name,
            'price' => $product->price,
            'available' => $product->available,
            'visible_menu' => $product->visible_menu,
        ]);

        $categories = Category::orderBy('sort_order')->get(['id', 'name']);

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Products/Form', [
            'categories' => Category::orderBy('sort_order')->get(['id', 'name']),
            'product' => null,
        ]);
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        $product = Product::create([
            ...$request->validated(),
            'slug' => $this->uniqueSlug($request->slug()),
        ]);

        return redirect()->route('admin.products.index')->with('success', "Produit \"{$product->name}\" créé.");
    }

    public function edit(Product $product): Response
    {
        $product->load('recipe.items');

        return Inertia::render('Admin/Products/Form', [
            'categories' => Category::orderBy('sort_order')->get(['id', 'name']),
            'stockItems' => StockItem::orderBy('name')->get(['id', 'name', 'unit']),
            'product' => [
                'id' => $product->id,
                'category_id' => $product->category_id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price,
                'photo' => $product->photo,
                'available' => $product->available,
                'visible_menu' => $product->visible_menu,
                'stock_tracked' => $product->stock_tracked,
                'recipe' => $product->recipe?->items->map(fn ($item) => [
                    'stock_item_id' => $item->stock_item_id,
                    'quantity' => (float) $item->quantity,
                    'unit' => $item->unit,
                ]) ?? [],
            ],
        ]);
    }

    public function update(StoreProductRequest $request, Product $product): RedirectResponse
    {
        $data = $request->validated();

        if ($data['name'] !== $product->name) {
            $data['slug'] = $this->uniqueSlug($request->slug(), $product->id);
        }

        $product->update($data);

        return redirect()->route('admin.products.index')->with('success', "Produit \"{$product->name}\" mis à jour.");
    }

    public function destroy(Product $product): RedirectResponse
    {
        $name = $product->name;
        $product->delete();

        return back()->with('success', "Produit \"{$name}\" supprimé.");
    }

    public function updateRecipe(Request $request, Product $product): RedirectResponse
    {
        $data = $request->validate([
            'items' => ['array'],
            'items.*.stock_item_id' => ['required', 'integer', 'exists:stock_items,id'],
            'items.*.quantity' => ['required', 'numeric', 'min:0.001'],
            'items.*.unit' => ['required', 'string', 'max:20'],
        ]);

        $recipe = $product->recipe()->firstOrCreate([]);
        $recipe->items()->delete();

        foreach ($data['items'] ?? [] as $item) {
            $recipe->items()->create($item);
        }

        return back()->with('success', 'Recette mise à jour.');
    }

    private function uniqueSlug(string $base, ?int $ignoreId = null): string
    {
        $slug = $base;
        $suffix = 1;

        while (Product::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = "{$base}-".++$suffix;
        }

        return $slug;
    }
}
