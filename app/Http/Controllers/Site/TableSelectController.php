<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Salon;
use Inertia\Inertia;
use Inertia\Response;

class TableSelectController extends Controller
{
    public function index(): Response
    {
        $salons = Salon::query()
            ->where('active', true)
            ->orderBy('code')
            ->get()
            ->map(fn (Salon $salon) => [
                'token' => $salon->qr_token,
                'name' => $salon->name,
                'code' => $salon->code,
            ]);

        return Inertia::render('Site/ChoisirSalon', [
            'salons' => $salons,
        ]);
    }
}
