<?php

namespace App\Http\Controllers\Client;

use App\Models\Order;
use Inertia\Inertia;
use Inertia\Response;

class AdditionController extends ClientController
{
    public function show(string $token): Response
    {
        $salon = $this->resolveSalon($token);
        $session = $salon->activeSession();

        $session?->load(['orders' => fn ($query) => $query->orderBy('created_at'), 'orders.items.product']);

        return Inertia::render('Client/Addition', [
            'salon' => [
                'token' => $salon->qr_token,
                'name' => $salon->name,
            ],
            'session' => $session ? [
                'total' => $session->total,
                'openedAt' => $session->opened_at->format('H:i'),
                'orders' => $session->orders->map(fn (Order $order) => [
                    'id' => $order->id,
                    'number' => $order->order_number,
                    'time' => $order->created_at->format('H:i'),
                    'status' => $order->status->value,
                    'total' => $order->total,
                    'items' => $order->items->map(fn ($item) => [
                        'name' => $item->product->name,
                        'quantity' => $item->quantity,
                        'total' => $item->total,
                    ]),
                ]),
            ] : null,
        ]);
    }
}
