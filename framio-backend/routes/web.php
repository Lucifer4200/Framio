<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'Framio API',
        'version' => '1.0.0',
        'timestamp' => now()->toDateTimeString(),
    ]);
});
