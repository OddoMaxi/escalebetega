<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'business_name',
        'tagline',
        'phone',
        'whatsapp',
        'email',
        'address',
        'hours_label',
        'facebook_url',
        'instagram_url',
    ];

    public static function current(): self
    {
        return Cache::rememberForever('settings.current', function () {
            return self::query()->firstOrCreate([]);
        });
    }

    protected static function booted(): void
    {
        static::saved(fn () => Cache::forget('settings.current'));
    }
}
