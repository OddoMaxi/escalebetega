<?php

namespace App\Services\Orders;

use App\Models\Salon;
use App\Models\TableSession;

class TableSessionService
{
    public function openOrReuse(Salon $salon): TableSession
    {
        $session = $salon->tableSessions()->whereNull('closed_at')->latest('opened_at')->first();

        if ($session) {
            return $session;
        }

        return $salon->tableSessions()->create([
            'opened_at' => now(),
        ]);
    }

    public function refreshTotal(TableSession $session): void
    {
        $total = $session->orders()->sum('total');

        $session->update(['total' => $total]);
    }
}
