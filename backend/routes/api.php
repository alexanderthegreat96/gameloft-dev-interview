<?php

use App\Http\Controllers\Api\V1\NewsController;
use App\Http\Controllers\Api\V1\SearchController;
use App\Http\Controllers\Api\V1\VideosController;
use App\Http\Controllers\Api\V1\SearchHistoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('api.key')->group(function() {
    Route::prefix('news')->group(function() {
        Route::get('/', [NewsController::class, 'index']);
        Route::get('/{id}',  [NewsController::class, 'show']);
    });

    Route::prefix('videos')->group(function() {
        Route::get('/', [VideosController::class, 'index']);
        Route::get('/{id}', [VideosController::class, 'show']);
    });

    Route::get('/search', [SearchController::class, 'search']);

    Route::prefix('history')->group(function() {
        Route::get('/', [SearchHistoryController::class, 'index']);
        Route::delete('/delete/{id}', [SearchHistoryController::class, 'delete']);
        Route::delete('/delete-all', [SearchHistoryController::class, 'deleteAll']);
    });
    
});
