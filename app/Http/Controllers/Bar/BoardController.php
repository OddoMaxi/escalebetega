<?php

namespace App\Http\Controllers\Bar;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\Orders\OrderService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BoardController extends Controller
{
    public function __construct(private readonly OrderService $orders)
    {
    }

    public function index(): Response
    {
        $orders = Order::query()
            ->with(['salon', 'items.product'])
            ->whereIn('status', [OrderStatus::Nouvelle, OrderStatus::Confirmee, OrderStatus::EnPreparation, OrderStatus::Prete])
            ->oldest()
            ->get()
            ->map(fn (Order $order) => [
                'id' => $order->id,
                'number' => $order->order_number,
                'salon' => $order->salon->name,
                'status' => $order->status->value,
                'time' => $order->created_at->format('H:i'),
                'notes' => $order->notes,
                'items' => $order->items->map(fn ($item) => [
                    'name' => $item->product->name,
                    'quantity' => $item->quantity,
                    'notes' => $item->notes,
                ]),
            ]);

        return Inertia::render('Bar/Board', [
            'columns' => [
                'nouvelles' => $orders->whereIn('status', ['nouvelle', 'confirmee'])->values(),
                'en_preparation' => $orders->where('status', 'en_preparation')->values(),
                'pretes' => $orders->where('status', 'prete')->values(),
            ],
        ]);
    }

    public function start(Order $order): RedirectResponse
    {
        $this->orders->markInPreparation($order);

        return back();
    }

    public function ready(Order $order): RedirectResponse
    {
        $this->orders->markReady($order);

        return back();
    }
}
