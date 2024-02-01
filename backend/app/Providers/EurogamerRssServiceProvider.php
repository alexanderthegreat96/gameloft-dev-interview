<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\EurogamerRssService;

class EurogamerRssServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(EurogamerRssService::class, function ($app) {
            return new EurogamerRssService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
