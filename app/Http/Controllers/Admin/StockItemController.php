<?php

namespace App\Http\Controllers\Admin;

use App\Enums\StockMovementType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreStockItemRequest;
use App\Models\StockItem;
use App\Models\Supplier;
use App\Services\Stock\StockService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class StockItemController extends Controller
{
    public function __construct(private readonly StockService $stock)
    {
    }

    public function index(): Response
    {
        $items = StockItem::with('mainSupplier')->orderBy('name')->get()->map(fn (StockItem $item) => [
            'id' => $item->id,
            'name' => $item->name,
            'unit' => $item->unit->value,
            'quantity_current' => (float) $item->quantity_current,
            'alert_threshold' => (float) $item->alert_threshold,
            'avg_cost' => $item->avg_cost,
            'supplier' => $item->mainSupplier?->name,
            'low' => $item->isLow(),
        ]);

        return Inertia::render('Admin/Stock/Index', [
            'items' => $items,
            'suppliers' => Supplier::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreStockItemRequest $request): RedirectResponse
    {
        StockItem::create($request->validated());

        return back()->with('success', 'Article de stock créé.');
    }

    public function update(StoreStockItemRequest $request, StockItem $stockItem): RedirectResponse
    {
        $stockItem->update($request->validated());

        return back()->with('success', "\"{$stockItem->name}\" mis à jour.");
    }

    public function destroy(StockItem $stockItem): RedirectResponse
    {
        $name = $stockItem->name;
        $stockItem->delete();

        return back()->with('success', "\"{$name}\" supprimé.");
    }

    public function adjust(Request $request, StockItem $stockItem): RedirectResponse
    {
        $data = $request->validate([
            'type' => ['required', 'string', 'in:entree,sortie_manuelle,perte,ajustement,inventaire'],
            'quantity' => ['required', 'numeric', 'min:0.001'],
            'notes' => ['nullable', 'string', 'max:255'],
        ]);

        $type = StockMovementType::from($data['type']);
        $delta = in_array($type, [StockMovementType::SortieManuelle, StockMovementType::Perte], true)
            ? -$data['quantity']
            : $data['quantity'];

        $this->stock->adjust($stockItem, $delta, $type, Auth::id(), null, $data['notes'] ?? null);

        return back()->with('success', 'Mouvement de stock enregistré.');
    }
}
