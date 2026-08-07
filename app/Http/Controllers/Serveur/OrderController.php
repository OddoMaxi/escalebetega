<?php

namespace App\Http\Controllers\Serveur;

use App\Enums\OrderSource;
use App\Http\Controllers\Controller;
use App\Http\Requests\Serveur\StoreServeurOrderRequest;
use App\Models\Category;
use App\Models\Order;
use App\Models\Salon;
use App\Services\Orders\OrderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(private readonly OrderService $orders)
    {
    }

    public function index(): Response
    {
        $orders = Order::query()
            ->with('salon')
            ->latest()
            ->limit(30)
            ->get()
            ->map(fn (Order $order) => [
                'id' => $order->id,
                'number' => $order->order_number,
                'salon' => $order->salon->name,
                'status' => $order->status->value,
                'total' => $order->total,
                'source' => $order->source->value,
                'time' => $order->created_at->format('H:i'),
            ]);

        return Inertia::render('Serveur/Orders', [
            'orders' => $orders,
        ]);
    }

    public function create(): Response
    {
        $salons = Salon::where('active', true)->orderBy('code')->get(['id', 'name', 'code']);

        $categories = Category::query()
            ->where('visible', true)
            ->orderBy('sort_order')
            ->with(['products' => function ($query) {
                $query->where('available', true)->orderBy('sort_order');
            }])
            ->get()
            ->map(fn (Category $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'products' => $category->products->map(fn ($product) => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                ]),
            ])
            ->filter(fn ($category) => $category['products']->isNotEmpty())
            ->values();

        return Inertia::render('Serveur/NewOrder', [
            'salons' => $salons,
            'categories' => $categories,
        ]);
    }

    public function store(StoreServeurOrderRequest $request): RedirectResponse
    {
        $salon = Salon::findOrFail($request->validated('salon_id'));

        $order = $this->orders->create(
            salon: $salon,
            items: $request->validated('items'),
            source: OrderSource::Serveur,
            customerName: $request->validated('customer_name'),
            customerPhone: $request->validated('customer_phone'),
            createdBy: Auth::id(),
            notes: $request->validated('notes'),
        );

        return redirect()->route('serveur.home')->with('success', "Commande {$order->order_number} envoyée.");
    }
}
