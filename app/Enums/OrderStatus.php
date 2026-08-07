<?php

namespace App\Enums;

enum OrderStatus: string
{
    case Nouvelle = 'nouvelle';
    case Confirmee = 'confirmee';
    case EnPreparation = 'en_preparation';
    case Prete = 'prete';
    case Servie = 'servie';
    case AEncaisser = 'a_encaisser';
    case Payee = 'payee';
    case Terminee = 'terminee';
    case Annulee = 'annulee';

    public function label(): string
    {
        return match ($this) {
            self::Nouvelle => 'Nouvelle',
            self::Confirmee => 'Confirmée',
            self::EnPreparation => 'En préparation',
            self::Prete => 'Prête',
            self::Servie => 'Servie',
            self::AEncaisser => 'À encaisser',
            self::Payee => 'Payée',
            self::Terminee => 'Terminée',
            self::Annulee => 'Annulée',
        };
    }
}
