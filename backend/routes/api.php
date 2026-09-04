<?php

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

use App\Http\Controllers\Api\ImageUploadController;
use App\Http\Controllers\Api\ContentController;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'Laravel backend is healthy and running',
        'timestamp' => now()->toIso8601String(),
    ]);
});

Route::post('/upload-image', [ImageUploadController::class, 'upload']);
Route::get('/site-content', [ContentController::class, 'get']);
Route::post('/site-content', [ContentController::class, 'save']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

