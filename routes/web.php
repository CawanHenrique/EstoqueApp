<?php

use App\Http\Controllers\Estoque;
use App\Http\Controllers\EstoqueController;
use App\Http\Controllers\HistoricoController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('LoginPage', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/historico' , function () {
    return Inertia::render('Historico');
})->middleware(['auth', 'verified'])->name('historico');

// get usuarios route
Route::get('/usuarios', function () {
    return Inertia::render('Usuarios');
})->middleware(['auth', 'verified'])->name('usuarios');

Route::get('/estoque', [EstoqueController::class, 'listarEstoque']);
Route::post('/estoque', [EstoqueController::class, 'criarEstoque']);
Route::delete('/estoque/{id}', [EstoqueController::class, 'deletarEstoque']);
Route::put('/estoque/{id}', [EstoqueController::class, 'atualizar']);
Route::put('/estoque/{id}/consumir', [EstoqueController::class, 'consumirQuantidadeEstoque']);

Route::prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'getAllUsers']);
    Route::get('/{id}', [UserController::class, 'getUserById']);
    Route::post('/', [UserController::class, 'createUser']);
    Route::put('/{id}', [UserController::class, 'updateUser']);
    Route::delete('/{id}', [UserController::class, 'deleteUser']);
});

Route::prefix('historico')->group(function () {
    Route::get('/getAllHistory', [HistoricoController::class, 'getAllHistory']);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
