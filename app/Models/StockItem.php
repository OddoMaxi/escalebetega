<?php

namespace App\Models;

use App\Enums\StockUnit;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StockItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'unit',
        'quantity_current',
        'alert_threshold',
        'avg_cost',
        'main_supplier_id',
    ];

    protected $casts = [
        'unit' => StockUnit::class,
        'quantity_current' => 'decimal:3',
        'alert_threshold' => 'decimal:3',
        'avg_cost' => 'integer',
    ];

    public function mainSupplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class, 'main_supplier_id');
    }

    public function movements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    public function isLow(): bool
    {
        return $this->quantity_current <= $this->alert_threshold;
    }
}
