<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Salon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
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
            'token' => $salon->qr_token,
            'status' => $salon->status->value,
            'active' => $salon->active,
        ]);

        return Inertia::render('Admin/Salons', [
            'salons' => $salons,
        ]);
    }

    public function regenerateToken(Salon $salon): RedirectResponse
    {
        $salon->update(['qr_token' => Str::random(32)]);

        return back()->with('success', "QR code du {$salon->name} régénéré.");
    }

    public function toggleActive(Salon $salon): RedirectResponse
    {
        $salon->update(['active' => ! $salon->active]);

        return back()->with('success', "{$salon->name} mis à jour.");
    }
}
