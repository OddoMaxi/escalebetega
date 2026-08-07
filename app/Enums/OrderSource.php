<?php

namespace App\Enums;

enum OrderSource: string
{
    case ClientQr = 'client_qr';
    case Serveur = 'serveur';
}
