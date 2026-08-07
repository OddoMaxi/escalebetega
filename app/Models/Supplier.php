<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Supplier extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'notes',
    ];

    public function stockItems(): HasMany
    {
        return $this->hasMany(StockItem::class, 'main_supplier_id');
    }

    public function purchases(): HasMany
    {
        return $this->hasMany(Purchase::class);
    }
}
