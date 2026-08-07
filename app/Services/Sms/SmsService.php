<?php

namespace App\Services\Sms;

use App\Models\Order;
use App\Models\SmsLog;

class SmsService
{
    public function __construct(private readonly SmsProviderInterface $provider)
    {
    }

    public function sendOrderReceived(Order $order): void
    {
        if (! $order->customer_phone) {
            return;
        }

        $message = "ESCALE BETEGA : votre commande {$order->order_number} au {$order->salon->name} a bien été enregistrée. Merci !";

        $this->dispatch($order, $order->customer_phone, $message, 'order_received');
    }

    public function sendOrderReady(Order $order): void
    {
        if (! $order->customer_phone) {
            return;
        }

        $message = "ESCALE BETEGA : votre commande {$order->order_number} est prête. Bonne dégustation chez ESCALE BETEGA !";

        $this->dispatch($order, $order->customer_phone, $message, 'order_ready');
    }

    private function dispatch(Order $order, string $phone, string $message, string $type): void
    {
        $sent = $this->provider->send($phone, $message);

        SmsLog::create([
            'order_id' => $order->id,
            'phone' => $phone,
            'message' => $message,
            'type' => $type,
            'status' => $sent ? 'sent' : 'failed',
        ]);
    }
}
