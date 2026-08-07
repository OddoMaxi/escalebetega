<?php

namespace App\Services\Stock;

use App\Enums\StockMovementType;
use App\Models\Order;
use App\Models\StockItem;
use App\Models\StockMovement;
use Illuminate\Support\Facades\DB;

class StockService
{
    public function adjust(
        StockItem $item,
        float $delta,
        StockMovementType $type,
        ?int $userId = null,
        ?int $orderId = null,
        ?string $notes = null,
    ): StockMovement {
        return DB::transaction(function () use ($item, $delta, $type, $userId, $orderId, $notes) {
            $item->update(['quantity_current' => max(0, $item->quantity_current + $delta)]);

            return StockMovement::create([
                'stock_item_id' => $item->id,
                'type' => $type,
                'quantity' => abs($delta),
                'order_id' => $orderId,
                'user_id' => $userId,
                'notes' => $notes,
            ]);
        });
    }

    /**
     * Decrement stock for an order's items based on each product's recipe.
     * Guarded by the order's stock_deducted flag to avoid double decrement.
     */
    public function decrementForOrder(Order $order): void
    {
        if ($order->stock_deducted) {
            return;
        }

        $order->loadMissing('items.product.recipe.items.stockItem');

        foreach ($order->items as $orderItem) {
            $recipe = $orderItem->product->recipe;

            if (! $orderItem->product->stock_tracked || ! $recipe) {
                continue;
            }

            foreach ($recipe->items as $recipeItem) {
                $this->adjust(
                    item: $recipeItem->stockItem,
                    delta: -($recipeItem->quantity * $orderItem->quantity),
                    type: StockMovementType::SortieVente,
                    orderId: $order->id,
                );
            }
        }

        $order->update(['stock_deducted' => true]);
    }
}
