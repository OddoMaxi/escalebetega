<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $orders = Order::query()
            ->with('salon')
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->when($request->source, fn ($q, $source) => $q->where('source', $source))
            ->latest()
            ->paginate(20)
            ->withQueryString()
            ->through(fn (Order $order) => [
                'id' => $order->id,
                'number' => $order->order_number,
                'salon' => $order->salon->name,
                'client' => $order->customer_phone,
                'source' => $order->source->value,
                'status' => $order->status->value,
                'total' => $order->total,
                'time' => $order->created_at->format('d/m H:i'),
            ]);

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['status', 'source']),
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load(['salon', 'customer', 'createdBy', 'items.product', 'tableSession.payments']);

        return Inertia::render('Admin/Orders/Show', [
            'order' => [
                'id' => $order->id,
                'number' => $order->order_number,
                'salon' => $order->salon->name,
                'status' => $order->status->value,
                'source' => $order->source->value,
                'subtotal' => $order->subtotal,
                'discount' => $order->discount,
                'total' => $order->total,
                'customer_name' => $order->customer_name,
                'customer_phone' => $order->customer_phone,
                'notes' => $order->notes,
                'created_by' => $order->createdBy?->name,
                'created_at' => $order->created_at->format('d/m/Y H:i'),
                'items' => $order->items->map(fn ($item) => [
                    'name' => $item->product->name,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'total' => $item->total,
                    'notes' => $item->notes,
                ]),
                'table_session_id' => $order->table_session_id,
            ],
        ]);
    }
}
