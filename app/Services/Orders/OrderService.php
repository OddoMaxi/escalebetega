<?php

namespace App\Services\Orders;

use App\Enums\OrderSource;
use App\Enums\OrderStatus;
use App\Enums\SalonStatus;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use App\Models\Salon;
use App\Services\Sms\SmsService;
use App\Services\Stock\StockService;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function __construct(
        private readonly TableSessionService $tableSessions,
        private readonly SmsService $sms,
        private readonly StockService $stock,
    ) {
    }

    /**
     * @param  array<int, array{product_id: int, quantity: int, notes?: ?string}>  $items
     */
    public function create(
        Salon $salon,
        array $items,
        OrderSource $source,
        ?string $customerName = null,
        ?string $customerPhone = null,
        ?int $createdBy = null,
        ?string $notes = null,
    ): Order {
        return DB::transaction(function () use ($salon, $items, $source, $customerName, $customerPhone, $createdBy, $notes) {
            $session = $this->tableSessions->openOrReuse($salon);

            $products = Product::whereIn('id', array_column($items, 'product_id'))
                ->where('available', true)
                ->get()
                ->keyBy('id');

            $customer = null;

            if ($customerPhone) {
                $customer = Customer::firstOrCreate(
                    ['phone' => $customerPhone],
                    ['name' => $customerName]
                );

                $customer->increment('visits_count');
                $customer->update(['last_visit_at' => now()]);
            }

            $order = Order::create([
                'order_number' => 'PENDING',
                'table_session_id' => $session->id,
                'salon_id' => $salon->id,
                'customer_id' => $customer?->id,
                'created_by' => $createdBy,
                'source' => $source,
                'status' => OrderStatus::Nouvelle,
                'subtotal' => 0,
                'discount' => 0,
                'total' => 0,
                'customer_name' => $customerName,
                'customer_phone' => $customerPhone,
                'notes' => $notes,
            ]);

            $subtotal = 0;

            foreach ($items as $item) {
                $product = $products->get($item['product_id']);

                if (! $product) {
                    continue;
                }

                $quantity = max(1, (int) $item['quantity']);
                $lineTotal = $product->price * $quantity;
                $subtotal += $lineTotal;

                $order->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price' => $product->price,
                    'total' => $lineTotal,
                    'notes' => $item['notes'] ?? null,
                ]);
            }

            $order->update([
                'order_number' => 'EB-'.str_pad((string) $order->id, 5, '0', STR_PAD_LEFT),
                'subtotal' => $subtotal,
                'total' => $subtotal,
            ]);

            if ($customer) {
                $customer->increment('total_spent', $subtotal);
            }

            $salon->update(['status' => SalonStatus::NouvelleCommande]);

            $this->tableSessions->refreshTotal($session);

            $order->refresh();

            $this->stock->decrementForOrder($order);

            $this->sms->sendOrderReceived($order);

            return $order;
        });
    }

    public function markInPreparation(Order $order): Order
    {
        $order->update(['status' => OrderStatus::EnPreparation]);
        $order->salon->update(['status' => SalonStatus::EnPreparation]);

        return $order;
    }

    public function markReady(Order $order): Order
    {
        $order->update(['status' => OrderStatus::Prete]);
        $order->salon->update(['status' => SalonStatus::Prete]);

        $this->sms->sendOrderReady($order);

        return $order;
    }

    public function markServed(Order $order): Order
    {
        $order->update(['status' => OrderStatus::Servie]);

        return $order;
    }
}
