<?php

namespace Database\Seeders;

use App\Models\Salon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SalonSeeder extends Seeder
{
    public function run(): void
    {
        for ($number = 1; $number <= 10; $number++) {
            $code = sprintf('%02d', $number);

            Salon::firstOrCreate(
                ['code' => $code],
                [
                    'name' => "Salon {$code}",
                    'qr_token' => Str::random(32),
                ]
            );
        }
    }
}
