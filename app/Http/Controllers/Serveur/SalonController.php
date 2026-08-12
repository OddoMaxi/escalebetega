<?php

namespace App\Http\Controllers\Serveur;

use App\Enums\SalonStatus;
use App\Http\Controllers\Controller;
use App\Models\Salon;
use App\Services\Orders\TableSessionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;

class SalonController extends Controller
{
    public function __construct(private readonly TableSessionService $tableSessions)
    {
    }

    public function index(): Response
    {
        $salons = Salon::orderBy('code')->get()->map(fn (Salon $salon) => [
            'id' => $salon->id,
            'name' => $salon->name,
            'code' => $salon->code,
            'status' => $salon->status->value,
        ]);

        return Inertia::render('Serveur/Salons', [
            'salons' => $salons,
        ]);
    }

    public function show(Salon $salon): Response
    {
        $session = $salon->activeSession();
        $session?->load(['orders.items.product']);

        $otherSalons = Salon::where('id', '!=', $salon->id)
            ->where('active', true)
            ->orderBy('code')
            ->get()
            ->map(fn (Salon $s) => [
                'id' => $s->id,
                'name' => $s->name,
                'status' => $s->status->value,
                'free' => $s->status === SalonStatus::Libre,
            ]);

        return Inertia::render('Serveur/SalonDetail', [
            'salon' => [
                'id' => $salon->id,
                'name' => $salon->name,
                'status' => $salon->status->value,
            ],
            'session' => $session ? [
                'id' => $session->id,
                'total' => $session->total,
                'hasPayments' => $session->payments()->exists(),
                'orders' => $session->orders->map(fn ($order) => [
                    'id' => $order->id,
                    'number' => $order->order_number,
                    'status' => $order->status->value,
                    'total' => $order->total,
                    'items' => $order->items->map(fn ($item) => [
                        'name' => $item->product->name,
                        'quantity' => $item->quantity,
                    ]),
                ]),
            ] : null,
            'otherSalons' => $otherSalons,
        ]);
    }

    public function transfer(Request $request, Salon $salon): RedirectResponse
    {
        $data = $request->validate([
            'to_salon_id' => ['required', 'integer', 'exists:salons,id'],
        ]);

        $session = $salon->activeSession();

        if (! $session) {
            return back()->with('error', 'Aucune session active sur ce salon.');
        }

        try {
            $this->tableSessions->transfer($session, Salon::findOrFail($data['to_salon_id']));
        } catch (RuntimeException $e) {
            return back()->with('error', $e->getMessage());
        }

        return redirect()->route('serveur.salons')->with('success', 'Salon transféré.');
    }

    public function merge(Request $request, Salon $salon): RedirectResponse
    {
        $data = $request->validate([
            'from_salon_id' => ['required', 'integer', 'exists:salons,id'],
        ]);

        $primary = $salon->activeSession();
        $secondarySalon = Salon::findOrFail($data['from_salon_id']);
        $secondary = $secondarySalon->activeSession();

        if (! $primary || ! $secondary) {
            return back()->with('error', 'Les deux salons doivent avoir une session active.');
        }

        try {
            $this->tableSessions->merge($primary, $secondary);
        } catch (RuntimeException $e) {
            return back()->with('error', $e->getMessage());
        }

        return redirect()->route('serveur.salons')->with('success', "{$secondarySalon->name} fusionné avec {$salon->name}.");
    }

    public function split(Request $request, Salon $salon): RedirectResponse
    {
        $data = $request->validate([
            'order_ids' => ['required', 'array', 'min:1'],
            'order_ids.*' => ['integer', 'exists:orders,id'],
            'to_salon_id' => ['required', 'integer', 'exists:salons,id'],
        ]);

        $session = $salon->activeSession();

        if (! $session) {
            return back()->with('error', 'Aucune session active sur ce salon.');
        }

        try {
            $this->tableSessions->split($session, $data['order_ids'], Salon::findOrFail($data['to_salon_id']));
        } catch (RuntimeException $e) {
            return back()->with('error', $e->getMessage());
        }

        return redirect()->route('serveur.salons')->with('success', 'Commande(s) déplacée(s) vers un nouveau salon.');
    }
}
