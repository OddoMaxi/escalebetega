<?php

namespace App\Providers;

use App\Services\Sms\InteractSmsProvider;
use App\Services\Sms\LogSmsProvider;
use App\Services\Sms\SmsProviderInterface;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(SmsProviderInterface::class, match (config('services.sms_provider', 'log')) {
            'interact' => InteractSmsProvider::class,
            default => LogSmsProvider::class,
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
    }
}
