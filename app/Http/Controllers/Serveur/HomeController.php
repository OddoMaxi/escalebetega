<?php

namespace App\Http\Controllers\Serveur;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Salon;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $today = today();

        return Inertia::render('Serveur/Home', [
            'stats' => [
                'ordersToday' => Order::whereDate('created_at', $today)->count(),
                'salonsOccupied' => Salon::whereIn('status', [
                    \App\Enums\SalonStatus::Occupe,
                    \App\Enums\SalonStatus::NouvelleCommande,
                    \App\Enums\SalonStatus::EnPreparation,
                    \App\Enums\SalonStatus::Prete,
                    \App\Enums\SalonStatus::AEncaisser,
                ])->count(),
                'salonsTotal' => Salon::count(),
            ],
        ]);
    }
}
