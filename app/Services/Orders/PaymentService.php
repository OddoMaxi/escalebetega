<?php

namespace App\Services\Orders;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\SalonStatus;
use App\Models\Payment;
use App\Models\TableSession;
use Illuminate\Support\Facades\DB;

class PaymentService
{
    public function recordPayment(TableSession $session, int $amount, PaymentMethod $method, ?int $cashierId): Payment
    {
        return DB::transaction(function () use ($session, $amount, $method, $cashierId) {
            $payment = Payment::create([
                'table_session_id' => $session->id,
                'cashier_id' => $cashierId,
                'amount' => $amount,
                'method' => $method,
                'paid_at' => now(),
            ]);

            if ($session->remaining() <= 0) {
                $this->closeSession($session);
            }

            return $payment;
        });
    }

    public function closeSession(TableSession $session): void
    {
        $session->update(['closed_at' => now()]);

        $session->orders()
            ->whereNotIn('status', [OrderStatus::Annulee, OrderStatus::Terminee])
            ->update(['status' => OrderStatus::Payee]);

        $session->salon->update(['status' => SalonStatus::Libre]);
    }
}
