<?php

namespace Database\Seeders;

use App\Enums\UserRole;
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

        $this->call([
            SalonSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
        ]);
    }
}
