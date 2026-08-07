<?php

use App\Enums\StockUnit;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_items', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('unit')->default(StockUnit::Unite->value);
            $table->decimal('quantity_current', 12, 3)->default(0);
            $table->decimal('alert_threshold', 12, 3)->default(0);
            $table->unsignedBigInteger('avg_cost')->default(0);
            $table->foreignId('main_supplier_id')->nullable()->constrained('suppliers')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_items');
    }
};
