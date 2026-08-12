<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@escalebetega.com'],
            [
                'name' => 'Admin',
                'password' => bcrypt('password'),
                'role' => UserRole::SuperAdmin,
                'email_verified_at' => now(),
            ]
        );

        User::firstOrCreate(
            ['email' => 'serveur@escalebetega.com'],
            [
                'name' => 'Aminata (Serveur)',
                'password' => bcrypt('password'),
                'role' => UserRole::Serveur,
                'email_verified_at' => now(),
            ]
        );

        User::firstOrCreate(
            ['email' => 'bar@escalebetega.com'],
            [
                'name' => 'Bar',
                'password' => bcrypt('password'),
                'role' => UserRole::Bar,
                'email_verified_at' => now(),
            ]
        );

        Setting::firstOrCreate([], [
            'business_name' => 'Escale Betega',
            'tagline' => "Savourez la nature, vivez l'escale.",
            'phone' => '+224 620 00 00 00',
            'whatsapp' => '+224 620 00 00 00',
            'email' => 'contact@escalebetega.com',
            'address' => 'Takonko Beach, Conakry',
            'hours_label' => 'Tous les jours, 09h00 – 23h00',
        ]);

        $this->call([
            SalonSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
            ProductCatalogSeeder::class,
        ]);
    }
}
