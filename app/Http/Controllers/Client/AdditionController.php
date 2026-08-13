<?php

namespace App\Http\Controllers\Client;

use App\Models\Order;
use App\Models\TableSession;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdditionController extends ClientController
{
    public function show(Request $request, string $token): Response
    {
        $salon = $this->resolveSalon($token);
        $session = null;

        if ($request->filled('session')) {
            $session = TableSession::query()
                ->where('id', $request->integer('session'))
                ->where('salon_id', $salon->id)
                ->where(function ($query) {
                    $query->whereNull('closed_at')->orWhere('closed_at', '>=', now()->subHours(6));
                })
                ->first();
        }

        $session ??= $salon->activeSession();

        $session?->load(['orders' => fn ($query) => $query->orderBy('created_at'), 'orders.items.product']);

        return Inertia::render('Client/Addition', [
            'salon' => [
                'token' => $salon->qr_token,
                'name' => $salon->name,
            ],
            'session' => $session ? [
                'id' => $session->id,
                'total' => $session->total,
                'openedAt' => $session->opened_at->format('H:i'),
                'closed' => (bool) $session->closed_at,
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
