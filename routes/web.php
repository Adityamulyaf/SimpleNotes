<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\NoteController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/notes', [NoteController::class, 'index']);
    Route::get('/notes/create', [NoteController::class, 'create']);
    Route::post('/notes', [NoteController::class, 'store']);
    
    // EDIT
    Route::get('/notes/{id}/edit', [NoteController::class, 'edit']);
    Route::put('/notes/{id}', [NoteController::class, 'update']);

    // DELETE
    Route::delete('/notes/{id}', [NoteController::class, 'destroy']);
});

require __DIR__.'/auth.php';
