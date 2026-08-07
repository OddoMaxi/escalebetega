<?php

namespace App\Http\Controllers\Admin;

use App\Enums\PaymentMethod;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePaymentRequest;
use App\Models\TableSession;
use App\Services\Orders\PaymentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CashierController extends Controller
{
    public function __construct(private readonly PaymentService $payments)
    {
    }

    public function index(): Response
    {
        $sessions = TableSession::query()
            ->with('salon')
            ->whereNull('closed_at')
            ->get()
            ->map(fn (TableSession $session) => [
                'id' => $session->id,
                'salon' => $session->salon->name,
                'opened_at' => $session->opened_at->format('H:i'),
                'total' => $session->total,
                'paid' => $session->paidTotal(),
                'remaining' => $session->remaining(),
                'ordersCount' => $session->orders()->count(),
            ]);

        return Inertia::render('Admin/Cashier/Index', [
            'sessions' => $sessions,
        ]);
    }

    public function show(TableSession $session): Response
    {
        $session->load(['salon', 'orders.items.product', 'payments']);

        return Inertia::render('Admin/Cashier/Show', [
            'session' => [
                'id' => $session->id,
                'salon' => $session->salon->name,
                'total' => $session->total,
                'paid' => $session->paidTotal(),
                'remaining' => $session->remaining(),
                'closed' => (bool) $session->closed_at,
                'orders' => $session->orders->map(fn ($order) => [
                    'number' => $order->order_number,
                    'status' => $order->status->value,
                    'total' => $order->total,
                    'items' => $order->items->map(fn ($item) => [
                        'name' => $item->product->name,
                        'quantity' => $item->quantity,
                        'total' => $item->total,
                    ]),
                ]),
                'payments' => $session->payments->map(fn ($payment) => [
                    'amount' => $payment->amount,
                    'method' => $payment->method->value,
                    'time' => $payment->paid_at->format('H:i'),
                ]),
            ],
        ]);
    }

    public function storePayment(StorePaymentRequest $request, TableSession $session): RedirectResponse
    {
        $amount = min($request->validated('amount'), $session->remaining());

        $this->payments->recordPayment(
            $session,
            $amount,
            PaymentMethod::from($request->validated('method')),
            Auth::id(),
        );

        return redirect()->route('admin.caisse.index')->with('success', 'Paiement enregistré.');
    }
}
