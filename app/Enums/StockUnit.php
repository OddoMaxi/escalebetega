<?php

namespace App\Enums;

enum StockUnit: string
{
    case Kg = 'kg';
    case G = 'g';
    case Litre = 'litre';
    case Ml = 'ml';
    case Unite = 'unite';
    case Pack = 'pack';
    case Bouteille = 'bouteille';
}
