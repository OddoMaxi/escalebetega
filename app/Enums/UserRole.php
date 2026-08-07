<?php

namespace App\Enums;

enum UserRole: string
{
    case SuperAdmin = 'super_admin';
    case Gerant = 'gerant';
    case Caissier = 'caissier';
    case Serveur = 'serveur';
    case Bar = 'bar';
    case StockManager = 'stock_manager';

    public function label(): string
    {
        return match ($this) {
            self::SuperAdmin => 'Super Admin',
            self::Gerant => 'Gérant',
            self::Caissier => 'Caissier',
            self::Serveur => 'Serveur',
            self::Bar => 'Bar',
            self::StockManager => 'Gestionnaire de stock',
        };
    }
}
