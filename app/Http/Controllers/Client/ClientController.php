<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Salon;
use Illuminate\Http\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

abstract class ClientController extends Controller
{
    protected function resolveSalon(string $token): Salon
    {
        $salon = Salon::where('qr_token', $token)->where('active', true)->first();

        if (! $salon) {
            throw new NotFoundHttpException('Salon introuvable.');
        }

        return $salon;
    }
}
