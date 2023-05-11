<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\AuthenticateMiddleware;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::middleware(['auth:sanctum'])->group(function () {

    // PM API
    Route::post('/pm/store', 'App\Http\Controllers\PaymentMethodController@store');
    Route::put('/pm/{id}/update', 'App\Http\Controllers\PaymentMethodController@update');
    Route::delete('pm/{id}/destroy', 'App\Http\Controllers\PaymentMethodController@destroy');
    
    // AREA API
    Route::post('/areas/store', 'App\Http\Controllers\AreaController@store');
    Route::put('/areas/{id}/update', 'App\Http\Controllers\AreaController@update');
    Route::delete('areas/{id}/destroy', 'App\Http\Controllers\AreaController@destroy');

    // CONSTRUCTION API
    Route::post('/constructions/store', 'App\Http\Controllers\ConstructionController@store');
    Route::put('/constructions/{id}/update', 'App\Http\Controllers\ConstructionController@update');
    Route::delete('constructions/{id}/destroy', 'App\Http\Controllers\ConstructionController@destroy');

});

// AUTH
Route::post('/register', 'App\Http\Controllers\AuthController@register');
Route::post('/sign-in', 'App\Http\Controllers\AuthController@signin');
Route::get('/check-auth', 'App\Http\Controllers\AuthController@checkauth');
Route::post('/sign-out', 'App\Http\Controllers\AuthController@signout');

// PM INDEX
Route::get('/pm', 'App\Http\Controllers\PaymentMethodController@index');
// AREA INDEX
Route::get('/areas', 'App\Http\Controllers\AreaController@index');
// CONSTRUCTION INDEX
Route::get('/constructions', 'App\Http\Controllers\ConstructionController@index');

Route::get('/test', function (Request $request) {
    return Hash::make('mYgG#85y5KV@');
});



