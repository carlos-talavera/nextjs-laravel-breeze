<?php

use App\Http\Controllers\UserController;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return UserResource::make($request->user());
});

// Users
Route::middleware('auth:sanctum')->group(function () {
    Route::get('users', [UserController::class, 'index']);
});
