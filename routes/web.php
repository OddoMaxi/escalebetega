<?php

use App\Http\Controllers\Admin\CashierController as AdminCashierController;
use App\Http\Controllers\Admin\CustomerController as AdminCustomerController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\ExpenseController as AdminExpenseController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\PurchaseController as AdminPurchaseController;
use App\Http\Controllers\Admin\ReportController as AdminReportController;
use App\Http\Controllers\Admin\SalonController as AdminSalonController;
use App\Http\Controllers\Admin\StockItemController as AdminStockItemController;
use App\Http\Controllers\Admin\SettingController as AdminSettingController;
use App\Http\Controllers\Admin\SupplierController as AdminSupplierController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Bar\BoardController as BarBoardController;
use App\Http\Controllers\Client\AdditionController;
use App\Http\Controllers\Client\CartController;
use App\Http\Controllers\Client\MenuController;
use App\Http\Controllers\Client\MoiController;
use App\Http\Controllers\Client\OrderController as ClientOrderController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Serveur\HomeController as ServeurHomeController;
use App\Http\Controllers\Serveur\OrderController as ServeurOrderController;
use App\Http\Controllers\Serveur\SalonController as ServeurSalonController;
use App\Http\Controllers\Site\HomeController;
use App\Http\Controllers\Site\TableSelectController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/commander', [TableSelectController::class, 'index'])->name('site.order-select');

Route::prefix('q/{token}')->name('client.')->group(function () {
    Route::get('/', [MenuController::class, 'index'])->name('home');
    Route::get('/menu', [MenuController::class, 'index'])->name('menu');
    Route::get('/panier', [CartController::class, 'show'])->name('cart');
    Route::get('/addition', [AdditionController::class, 'show'])->name('addition');
    Route::get('/moi', [MoiController::class, 'show'])->name('moi');
    Route::post('/commandes', [ClientOrderController::class, 'store'])->name('orders.store');
    Route::get('/commandes/{order}/confirmation', [ClientOrderController::class, 'confirmation'])->name('orders.confirmation');
    Route::get('/commandes/{order}/poll', [ClientOrderController::class, 'poll'])->name('orders.poll');
    Route::get('/commandes/{order}', [ClientOrderController::class, 'show'])->name('orders.show');
});

Route::middleware(['auth', 'role:serveur,gerant'])->prefix('serveur')->name('serveur.')->group(function () {
    Route::get('/', [ServeurHomeController::class, 'index'])->name('home');
    Route::get('/salons', [ServeurSalonController::class, 'index'])->name('salons');
    Route::get('/salons/{salon}', [ServeurSalonController::class, 'show'])->name('salons.show');
    Route::post('/salons/{salon}/encaisser', [ServeurSalonController::class, 'pay'])->name('salons.pay');
    Route::post('/salons/{salon}/transferer', [ServeurSalonController::class, 'transfer'])->name('salons.transfer');
    Route::post('/salons/{salon}/fusionner', [ServeurSalonController::class, 'merge'])->name('salons.merge');
    Route::post('/salons/{salon}/diviser', [ServeurSalonController::class, 'split'])->name('salons.split');
    Route::get('/commandes', [ServeurOrderController::class, 'index'])->name('orders.index');
    Route::get('/commandes/nouvelle', [ServeurOrderController::class, 'create'])->name('orders.create');
    Route::post('/commandes', [ServeurOrderController::class, 'store'])->name('orders.store');
});

Route::middleware(['auth', 'role:bar,gerant'])->prefix('bar')->name('bar.')->group(function () {
    Route::get('/', [BarBoardController::class, 'index'])->name('board');
    Route::patch('/commandes/{order}/commencer', [BarBoardController::class, 'start'])->name('orders.start');
    Route::patch('/commandes/{order}/pret', [BarBoardController::class, 'ready'])->name('orders.ready');
});

Route::middleware(['auth', 'role:gerant'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

    Route::get('/salons', [AdminSalonController::class, 'index'])->name('salons.index');
    Route::patch('/salons/{salon}/regenerate', [AdminSalonController::class, 'regenerateToken'])->name('salons.regenerate');
    Route::patch('/salons/{salon}/toggle', [AdminSalonController::class, 'toggleActive'])->name('salons.toggle');

    Route::get('/produits', [AdminProductController::class, 'index'])->name('products.index');
    Route::get('/produits/nouveau', [AdminProductController::class, 'create'])->name('products.create');
    Route::post('/produits', [AdminProductController::class, 'store'])->name('products.store');
    Route::get('/produits/{product}/modifier', [AdminProductController::class, 'edit'])->name('products.edit');
    Route::put('/produits/{product}', [AdminProductController::class, 'update'])->name('products.update');
    Route::delete('/produits/{product}', [AdminProductController::class, 'destroy'])->name('products.destroy');
    Route::put('/produits/{product}/recette', [AdminProductController::class, 'updateRecipe'])->name('products.recipe');

    Route::get('/commandes', [AdminOrderController::class, 'index'])->name('orders.index');
    Route::get('/commandes/{order}', [AdminOrderController::class, 'show'])->name('orders.show');

    Route::get('/caisse', [AdminCashierController::class, 'index'])->name('caisse.index');
    Route::get('/caisse/{session}', [AdminCashierController::class, 'show'])->name('caisse.show');
    Route::post('/caisse/{session}/paiement', [AdminCashierController::class, 'storePayment'])->name('caisse.pay');

    Route::get('/depenses', [AdminExpenseController::class, 'index'])->name('expenses.index');
    Route::post('/depenses', [AdminExpenseController::class, 'store'])->name('expenses.store');
    Route::delete('/depenses/{expense}', [AdminExpenseController::class, 'destroy'])->name('expenses.destroy');

    Route::get('/stock', [AdminStockItemController::class, 'index'])->name('stock.index');
    Route::post('/stock', [AdminStockItemController::class, 'store'])->name('stock.store');
    Route::put('/stock/{stockItem}', [AdminStockItemController::class, 'update'])->name('stock.update');
    Route::delete('/stock/{stockItem}', [AdminStockItemController::class, 'destroy'])->name('stock.destroy');
    Route::post('/stock/{stockItem}/mouvement', [AdminStockItemController::class, 'adjust'])->name('stock.adjust');

    Route::get('/achats', [AdminPurchaseController::class, 'index'])->name('purchases.index');
    Route::post('/achats', [AdminPurchaseController::class, 'store'])->name('purchases.store');
    Route::post('/fournisseurs', [AdminSupplierController::class, 'store'])->name('suppliers.store');
    Route::delete('/fournisseurs/{supplier}', [AdminSupplierController::class, 'destroy'])->name('suppliers.destroy');

    Route::get('/clients', [AdminCustomerController::class, 'index'])->name('customers.index');

    Route::get('/rapports', [AdminReportController::class, 'index'])->name('reports.index');

    Route::get('/parametres', [AdminSettingController::class, 'edit'])->name('settings.edit');
    Route::put('/parametres', [AdminSettingController::class, 'update'])->name('settings.update');
});

// User account management touches role assignment (incl. super_admin), so
// it's restricted to super_admin only — gérant does not get this one.
Route::middleware(['auth', 'role:super_admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/utilisateurs', [AdminUserController::class, 'index'])->name('users.index');
    Route::get('/utilisateurs/nouveau', [AdminUserController::class, 'create'])->name('users.create');
    Route::post('/utilisateurs', [AdminUserController::class, 'store'])->name('users.store');
    Route::get('/utilisateurs/{user}/modifier', [AdminUserController::class, 'edit'])->name('users.edit');
    Route::put('/utilisateurs/{user}', [AdminUserController::class, 'update'])->name('users.update');
    Route::delete('/utilisateurs/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');
    Route::patch('/utilisateurs/{user}/toggle', [AdminUserController::class, 'toggleActive'])->name('users.toggle');
});

Route::get('/dashboard', function () {
    return match (auth()->user()->role) {
        \App\Enums\UserRole::SuperAdmin, \App\Enums\UserRole::Gerant, \App\Enums\UserRole::Caissier, \App\Enums\UserRole::StockManager => redirect()->route('admin.dashboard'),
        \App\Enums\UserRole::Serveur => redirect()->route('serveur.home'),
        \App\Enums\UserRole::Bar => redirect()->route('bar.board'),
    };
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
