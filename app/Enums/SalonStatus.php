<?php

namespace App\Enums;

enum SalonStatus: string
{
    case Libre = 'libre';
    case Occupe = 'occupe';
    case NouvelleCommande = 'nouvelle_commande';
    case EnPreparation = 'en_preparation';
    case Prete = 'prete';
    case AEncaisser = 'a_encaisser';

    public function label(): string
    {
        return match ($this) {
            self::Libre => 'Libre',
            self::Occupe => 'Occupé',
            self::NouvelleCommande => 'Nouvelle commande',
            self::EnPreparation => 'En préparation',
            self::Prete => 'Prête',
            self::AEncaisser => 'À encaisser',
        };
    }
}
