<?php

namespace App\Services\Stock;

use App\Enums\StockMovementType;
use App\Models\Purchase;
use App\Models\Supplier;
use Illuminate\Support\Facades\DB;

class PurchaseService
{
    public function __construct(private readonly StockService $stock)
    {
    }

    /**
     * @param  array<int, array{stock_item_id: int, quantity: float, unit_cost: int}>  $items
     */
    public function create(Supplier $supplier, array $items, string $purchasedAt, ?int $userId, ?string $notes): Purchase
    {
        return DB::transaction(function () use ($supplier, $items, $purchasedAt, $userId, $notes) {
            $purchase = Purchase::create([
                'supplier_id' => $supplier->id,
                'user_id' => $userId,
                'purchased_at' => $purchasedAt,
                'total' => 0,
                'payment_status' => 'unpaid',
                'notes' => $notes,
            ]);

            $total = 0;

            foreach ($items as $item) {
                $stockItem = \App\Models\StockItem::findOrFail($item['stock_item_id']);
                $lineTotal = (int) round($item['quantity'] * $item['unit_cost']);
                $total += $lineTotal;

                $purchase->items()->create([
                    'stock_item_id' => $stockItem->id,
                    'quantity' => $item['quantity'],
                    'unit_cost' => $item['unit_cost'],
                    'total' => $lineTotal,
                ]);

                $this->updateAverageCost($stockItem, $item['quantity'], $item['unit_cost']);

                $this->stock->adjust(
                    item: $stockItem->fresh(),
                    delta: $item['quantity'],
                    type: StockMovementType::Entree,
                    userId: $userId,
                    notes: "Achat #{$purchase->id} — {$supplier->name}",
                );
            }

            $purchase->update(['total' => $total]);

            return $purchase;
        });
    }

    private function updateAverageCost(\App\Models\StockItem $item, float $quantity, int $unitCost): void
    {
        $existingValue = $item->quantity_current * $item->avg_cost;
        $incomingValue = $quantity * $unitCost;
        $newQuantity = $item->quantity_current + $quantity;

        $newAvgCost = $newQuantity > 0
            ? (int) round(($existingValue + $incomingValue) / $newQuantity)
            : $unitCost;

        $item->update(['avg_cost' => $newAvgCost]);
    }
}
