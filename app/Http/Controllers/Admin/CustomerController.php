<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $customers = Customer::query()
            ->when($request->search, fn ($q, $search) => $q->where(fn ($q2) => $q2
                ->where('name', 'like', "%{$search}%")
                ->orWhere('phone', 'like', "%{$search}%")))
            ->orderByDesc('total_spent')
            ->paginate(20)
            ->withQueryString()
            ->through(fn (Customer $customer) => [
                'id' => $customer->id,
                'name' => $customer->name,
                'phone' => $customer->phone,
                'visits_count' => $customer->visits_count,
                'total_spent' => $customer->total_spent,
                'last_visit_at' => $customer->last_visit_at?->format('d/m/Y H:i'),
            ]);

        return Inertia::render('Admin/Customers/Index', [
            'customers' => $customers,
            'search' => $request->search,
        ]);
    }
}
