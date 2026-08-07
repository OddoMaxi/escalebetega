<?php

namespace App\Http\Controllers\Client;

use App\Enums\OrderSource;
use App\Http\Requests\Client\StoreClientOrderRequest;
use App\Models\Order;
use App\Services\Orders\OrderService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends ClientController
{
    public function __construct(private readonly OrderService $orders)
    {
    }

    public function store(StoreClientOrderRequest $request, string $token): RedirectResponse
    {
        $salon = $this->resolveSalon($token);

        $order = $this->orders->create(
            salon: $salon,
            items: $request->validated('items'),
            source: OrderSource::ClientQr,
            customerName: $request->validated('customer_name'),
            customerPhone: $request->validated('customer_phone'),
            notes: $request->validated('notes'),
        );

        return redirect()->route('client.orders.confirmation', ['token' => $token, 'order' => $order->id]);
    }

    public function confirmation(string $token, Order $order): Response
    {
        $salon = $this->resolveSalon($token);

        abort_unless($order->salon_id === $salon->id, 404);

        return Inertia::render('Client/Confirmation', [
            'salon' => ['token' => $salon->qr_token, 'name' => $salon->name],
            'order' => [
                'id' => $order->id,
                'number' => $order->order_number,
            ],
        ]);
    }

    public function show(string $token, Order $order): Response
    {
        $salon = $this->resolveSalon($token);

        abort_unless($order->salon_id === $salon->id, 404);

        return Inertia::render('Client/OrderStatus', [
            'salon' => ['token' => $salon->qr_token, 'name' => $salon->name],
            'order' => [
                'id' => $order->id,
                'number' => $order->order_number,
                'status' => $order->status->value,
            ],
        ]);
    }

    public function poll(string $token, Order $order)
    {
        $salon = $this->resolveSalon($token);

        abort_unless($order->salon_id === $salon->id, 404);

        return response()->json([
            'status' => $order->status->value,
        ]);
    }
}
