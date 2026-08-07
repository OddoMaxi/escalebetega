<?php

namespace App\Services\Sms;

use Illuminate\Support\Facades\Log;

class LogSmsProvider implements SmsProviderInterface
{
    public function send(string $phone, string $message): bool
    {
        Log::info("[SMS] To: {$phone} | {$message}");

        return true;
    }
}
