<?php

namespace App\Models;

use App\Enums\SalonStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Salon extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'qr_token',
        'status',
        'active',
    ];

    protected $casts = [
        'status' => SalonStatus::class,
        'active' => 'boolean',
    ];

    public function tableSessions(): HasMany
    {
        return $this->hasMany(TableSession::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function activeSession(): ?TableSession
    {
        return $this->tableSessions()->whereNull('closed_at')->latest('opened_at')->first();
    }
}
