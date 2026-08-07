<?php

namespace App\Http\Controllers\Serveur;

use App\Http\Controllers\Controller;
use App\Models\Salon;
use Inertia\Inertia;
use Inertia\Response;

class SalonController extends Controller
{
    public function index(): Response
    {
        $salons = Salon::orderBy('code')->get()->map(fn (Salon $salon) => [
            'id' => $salon->id,
            'name' => $salon->name,
            'code' => $salon->code,
            'status' => $salon->status->value,
        ]);

        return Inertia::render('Serveur/Salons', [
            'salons' => $salons,
        ]);
    }
}
