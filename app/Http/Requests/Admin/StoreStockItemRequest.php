<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreStockItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'unit' => ['required', 'string', 'in:kg,g,litre,ml,unite,pack,bouteille'],
            'quantity_current' => ['required', 'numeric', 'min:0'],
            'alert_threshold' => ['required', 'numeric', 'min:0'],
            'avg_cost' => ['integer', 'min:0'],
            'main_supplier_id' => ['nullable', 'integer', 'exists:suppliers,id'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'avg_cost' => $this->input('avg_cost') ?: 0,
        ]);
    }
}
