<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Purchase;
use App\Models\StockItem;
use App\Models\Supplier;
use App\Services\Stock\PurchaseService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PurchaseController extends Controller
{
    public function __construct(private readonly PurchaseService $purchases)
    {
    }

    public function index(): Response
    {
        $purchases = Purchase::with('supplier')->latest('purchased_at')->limit(50)->get()
            ->map(fn (Purchase $purchase) => [
                'id' => $purchase->id,
                'supplier' => $purchase->supplier->name,
                'date' => $purchase->purchased_at->format('d/m/Y'),
                'total' => $purchase->total,
                'payment_status' => $purchase->payment_status,
            ]);

        return Inertia::render('Admin/Purchases/Index', [
            'purchases' => $purchases,
            'suppliers' => Supplier::orderBy('name')->get(['id', 'name', 'phone']),
            'stockItems' => StockItem::orderBy('name')->get(['id', 'name', 'unit']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'supplier_id' => ['required', 'integer', 'exists:suppliers,id'],
            'purchased_at' => ['required', 'date'],
            'notes' => ['nullable', 'string', 'max:500'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.stock_item_id' => ['required', 'integer', 'exists:stock_items,id'],
            'items.*.quantity' => ['required', 'numeric', 'min:0.001'],
            'items.*.unit_cost' => ['required', 'integer', 'min:0'],
        ]);

        $supplier = Supplier::findOrFail($data['supplier_id']);

        $this->purchases->create($supplier, $data['items'], $data['purchased_at'], Auth::id(), $data['notes'] ?? null);

        return back()->with('success', 'Achat enregistré, stock mis à jour.');
    }
}
