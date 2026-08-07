<?php

namespace App\Enums;

enum ExpenseCategory: string
{
    case Transport = 'transport';
    case Glace = 'glace';
    case Eau = 'eau';
    case Electricite = 'electricite';
    case Nettoyage = 'nettoyage';
    case Personnel = 'personnel';
    case Reparation = 'reparation';
    case AchatUrgent = 'achat_urgent';
    case Divers = 'divers';
}
