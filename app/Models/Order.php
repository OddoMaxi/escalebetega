<?php

namespace App\Models;

use App\Enums\OrderSource;
use App\Enums\OrderStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'table_session_id',
        'salon_id',
        'customer_id',
        'created_by',
        'source',
        'status',
        'subtotal',
        'discount',
        'total',
        'customer_name',
        'customer_phone',
        'notes',
        'stock_deducted',
    ];

    protected $casts = [
        'source' => OrderSource::class,
        'status' => OrderStatus::class,
        'subtotal' => 'integer',
        'discount' => 'integer',
        'total' => 'integer',
        'stock_deducted' => 'boolean',
    ];

    public function tableSession(): BelongsTo
    {
        return $this->belongsTo(TableSession::class);
    }

    public function salon(): BelongsTo
    {
        return $this->belongsTo(Salon::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
