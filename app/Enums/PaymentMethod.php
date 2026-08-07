<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case Especes = 'especes';
    case OrangeMoney = 'orange_money';
    case MobileMoney = 'mobile_money';
    case Carte = 'carte';
    case Autre = 'autre';
}
