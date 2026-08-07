<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreExpenseRequest;
use App\Models\Expense;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ExpenseController extends Controller
{
    public function index(): Response
    {
        $expenses = Expense::with('user')
            ->latest('spent_at')
            ->limit(100)
            ->get()
            ->map(fn (Expense $expense) => [
                'id' => $expense->id,
                'category' => $expense->category->value,
                'amount' => $expense->amount,
                'date' => $expense->spent_at->format('d/m/Y'),
                'notes' => $expense->notes,
                'user' => $expense->user?->name,
            ]);

        return Inertia::render('Admin/Expenses/Index', [
            'expenses' => $expenses,
            'totalThisMonth' => Expense::whereMonth('spent_at', now()->month)
                ->whereYear('spent_at', now()->year)
                ->sum('amount'),
        ]);
    }

    public function store(StoreExpenseRequest $request): RedirectResponse
    {
        Expense::create([
            ...$request->validated(),
            'user_id' => Auth::id(),
        ]);

        return back()->with('success', 'Dépense enregistrée.');
    }

    public function destroy(Expense $expense): RedirectResponse
    {
        $expense->delete();

        return back()->with('success', 'Dépense supprimée.');
    }
}
