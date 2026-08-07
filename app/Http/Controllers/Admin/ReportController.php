<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(): Response
    {
        $base = fn () => Order::where('status', '!=', OrderStatus::Annulee);

        $today = today();

        $salesToday = (clone $base())->whereDate('created_at', $today)->sum('total');
        $salesWeek = (clone $base())->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->sum('total');
        $salesMonth = (clone $base())->whereMonth('created_at', $today->month)->whereYear('created_at', $today->year)->sum('total');

        $topProducts = DB::table('order_items')
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('orders.status', '!=', OrderStatus::Annulee->value)
            ->select('products.name', DB::raw('SUM(order_items.quantity) as qty'), DB::raw('SUM(order_items.total) as revenue'))
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('qty')
            ->limit(10)
            ->get();

        $bySalon = DB::table('orders')
            ->join('salons', 'salons.id', '=', 'orders.salon_id')
            ->where('orders.status', '!=', OrderStatus::Annulee->value)
            ->select('salons.name', DB::raw('COUNT(*) as orders_count'), DB::raw('SUM(orders.total) as revenue'))
            ->groupBy('salons.id', 'salons.name')
            ->orderByDesc('revenue')
            ->get();

        $bySource = DB::table('orders')
            ->where('status', '!=', OrderStatus::Annulee->value)
            ->select('source', DB::raw('COUNT(*) as orders_count'), DB::raw('SUM(total) as revenue'))
            ->groupBy('source')
            ->get();

        $expensesMonth = Expense::whereMonth('spent_at', $today->month)->whereYear('spent_at', $today->year)->sum('amount');

        return Inertia::render('Admin/Reports/Index', [
            'sales' => [
                'today' => $salesToday,
                'week' => $salesWeek,
                'month' => $salesMonth,
            ],
            'topProducts' => $topProducts,
            'bySalon' => $bySalon,
            'bySource' => $bySource,
            'expensesMonth' => $expensesMonth,
            'marginEstimate' => $salesMonth - $expensesMonth,
        ]);
    }
}
