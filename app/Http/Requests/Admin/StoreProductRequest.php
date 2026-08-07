<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:500'],
            'price' => ['required', 'integer', 'min:0'],
            'photo' => ['nullable', 'string', 'max:2048'],
            'available' => ['boolean'],
            'visible_menu' => ['boolean'],
            'stock_tracked' => ['boolean'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'available' => $this->boolean('available', true),
            'visible_menu' => $this->boolean('visible_menu', true),
            'stock_tracked' => $this->boolean('stock_tracked', false),
        ]);
    }

    public function slug(): string
    {
        return Str::slug($this->validated('name'));
    }
}
