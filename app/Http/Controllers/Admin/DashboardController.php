<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Enums\SalonStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Salon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $today = today();

        $todayOrders = Order::whereDate('created_at', $today)->where('status', '!=', OrderStatus::Annulee);

        $stats = [
            'revenue' => (clone $todayOrders)->sum('total'),
            'orders' => (clone $todayOrders)->count(),
            'pending' => (clone $todayOrders)->whereIn('status', [
                OrderStatus::Nouvelle, OrderStatus::Confirmee, OrderStatus::EnPreparation,
            ])->count(),
            'ready' => (clone $todayOrders)->where('status', OrderStatus::Prete)->count(),
            'served' => (clone $todayOrders)->whereIn('status', [
                OrderStatus::Servie, OrderStatus::Payee, OrderStatus::Terminee,
            ])->count(),
        ];

        $hourly = Order::whereDate('created_at', $today)
            ->where('status', '!=', OrderStatus::Annulee)
            ->select(DB::raw('HOUR(created_at) as hour'), DB::raw('SUM(total) as total'))
            ->groupBy('hour')
            ->pluck('total', 'hour');

        $salesByHour = collect(range(0, 23))->map(fn ($hour) => [
            'hour' => sprintf('%02dh', $hour),
            'total' => (int) ($hourly[$hour] ?? 0),
        ])->values();

        $topProducts = DB::table('order_items')
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('orders.status', '!=', OrderStatus::Annulee->value)
            ->select('products.name', DB::raw('SUM(order_items.quantity) as qty'))
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('qty')
            ->limit(5)
            ->get();

        $recentOrders = Order::with('salon')
            ->latest()
            ->limit(6)
            ->get()
            ->map(fn (Order $order) => [
                'id' => $order->id,
                'number' => $order->order_number,
                'salon' => $order->salon->name,
                'client' => $order->customer_phone,
                'source' => $order->source->value,
                'time' => $order->created_at->format('H:i'),
                'total' => $order->total,
                'status' => $order->status->value,
            ]);

        $salonsActive = Salon::where('status', '!=', SalonStatus::Libre)->count();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'salesByHour' => $salesByHour,
            'topProducts' => $topProducts,
            'recentOrders' => $recentOrders,
            'salonsActive' => $salonsActive,
            'salonsTotal' => Salon::count(),
        ]);
    }
}
