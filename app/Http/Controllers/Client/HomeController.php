<?php

namespace App\Http\Controllers\Client;

use Inertia\Inertia;
use Inertia\Response;

class HomeController extends ClientController
{
    public function show(string $token): Response
    {
        $salon = $this->resolveSalon($token);

        return Inertia::render('Client/Home', [
            'salon' => [
                'token' => $salon->qr_token,
                'name' => $salon->name,
                'code' => $salon->code,
            ],
        ]);
    }
}
