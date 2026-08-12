<?php

namespace App\Services\Orders;

use App\Enums\SalonStatus;
use App\Models\Salon;
use App\Models\TableSession;
use Illuminate\Support\Facades\DB;
use RuntimeException;

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

    /**
     * Move an entire active session (and its orders) to a different, free salon.
     * e.g. the client asks to move from Salon 05 to Salon 08.
     */
    public function transfer(TableSession $session, Salon $toSalon): void
    {
        if ($session->salon_id === $toSalon->id) {
            throw new RuntimeException('Le salon de destination est identique au salon actuel.');
        }

        if ($toSalon->status !== SalonStatus::Libre) {
            throw new RuntimeException("Le {$toSalon->name} n'est pas libre.");
        }

        DB::transaction(function () use ($session, $toSalon) {
            $fromSalon = $session->salon;
            $status = $fromSalon->status;

            $session->orders()->update(['salon_id' => $toSalon->id]);
            $session->update(['salon_id' => $toSalon->id]);

            $toSalon->update(['status' => $status]);
            $fromSalon->update(['status' => SalonStatus::Libre]);
        });
    }

    /**
     * Merge another salon's open session into this one — one shared bill.
     * The secondary salon's session closes and the salon frees up.
     */
    public function merge(TableSession $primary, TableSession $secondary): void
    {
        if ($primary->id === $secondary->id) {
            throw new RuntimeException('Impossible de fusionner un salon avec lui-même.');
        }

        if ($primary->payments()->exists() || $secondary->payments()->exists()) {
            throw new RuntimeException('Impossible de fusionner : un paiement a déjà été enregistré sur l\'une des deux sessions.');
        }

        DB::transaction(function () use ($primary, $secondary) {
            $hasPendingOrders = $secondary->orders()
                ->whereNotIn('status', ['servie', 'payee', 'terminee', 'annulee'])
                ->exists();

            $secondary->orders()->update([
                'table_session_id' => $primary->id,
                'salon_id' => $primary->salon_id,
            ]);

            $secondary->update(['closed_at' => now(), 'total' => 0]);
            $secondary->salon->update(['status' => SalonStatus::Libre]);

            if ($hasPendingOrders) {
                $primary->salon->update(['status' => SalonStatus::NouvelleCommande]);
            }

            $this->refreshTotal($primary);
        });
    }

    /**
     * Move a subset of a session's orders onto a new, separate bill on a
     * free salon — e.g. splitting one table into two separate additions.
     *
     * @param  array<int>  $orderIds
     */
    public function split(TableSession $session, array $orderIds, Salon $toSalon): TableSession
    {
        if ($toSalon->status !== SalonStatus::Libre) {
            throw new RuntimeException("Le {$toSalon->name} n'est pas libre.");
        }

        if ($session->payments()->exists()) {
            throw new RuntimeException('Impossible de diviser : un paiement a déjà été enregistré.');
        }

        if (empty($orderIds)) {
            throw new RuntimeException('Sélectionnez au moins une commande à déplacer.');
        }

        return DB::transaction(function () use ($session, $orderIds, $toSalon) {
            $fromSalon = $session->salon;
            $status = $fromSalon->status;

            $newSession = $toSalon->tableSessions()->create(['opened_at' => now()]);

            $session->orders()->whereIn('id', $orderIds)->update([
                'table_session_id' => $newSession->id,
                'salon_id' => $toSalon->id,
            ]);

            $this->refreshTotal($newSession);
            $this->refreshTotal($session);

            $toSalon->update(['status' => $status]);

            if ($session->orders()->count() === 0) {
                $session->update(['closed_at' => now()]);
                $fromSalon->update(['status' => SalonStatus::Libre]);
            }

            return $newSession;
        });
    }
}
