<?php

namespace App\Services\Sms;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class InteractSmsProvider implements SmsProviderInterface
{
    public function send(string $phone, string $message): bool
    {
        $config = config('services.interact_sms');

        if (! $config['user'] || ! $config['hash']) {
            Log::warning('[SMS/Interact] Missing INTERACT_SMS_USER or INTERACT_SMS_HASH, message not sent.');

            return false;
        }

        try {
            $response = Http::timeout(8)->get($config['base_url'], [
                'app' => 'ws',
                'u' => $config['user'],
                'h' => $config['hash'],
                'op' => 'pv',
                'to' => $this->normalizePhone($phone),
                'msg' => $message,
                'from' => $config['from'],
            ]);

            if (! $response->successful()) {
                Log::error("[SMS/Interact] HTTP {$response->status()} sending to {$phone}: {$response->body()}");

                return false;
            }

            $status = $response->json('data.0.status');

            if ($status !== 'OK') {
                Log::error("[SMS/Interact] Gateway rejected message to {$phone}: {$response->body()}");

                return false;
            }

            return true;
        } catch (\Throwable $e) {
            Log::error("[SMS/Interact] Exception sending to {$phone}: {$e->getMessage()}");

            return false;
        }
    }

    private function normalizePhone(string $phone): string
    {
        return preg_replace('/\D/', '', $phone);
    }
}
