<?php

namespace App\Enums;

enum StockMovementType: string
{
    case Entree = 'entree';
    case SortieVente = 'sortie_vente';
    case SortieManuelle = 'sortie_manuelle';
    case Perte = 'perte';
    case Ajustement = 'ajustement';
    case Inventaire = 'inventaire';
}
