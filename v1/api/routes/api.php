<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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


Route::get('/test', function (Request $request) {
    return 'this is testing';
});

// AREA API
Route::get('/areas', 'App\Http\Controllers\AreaController@index');
Route::post('/areas/store', 'App\Http\Controllers\AreaController@store');
Route::put('/areas/{id}/update', 'App\Http\Controllers\AreaController@update');
Route::delete('areas/{id}/destroy', 'App\Http\Controllers\AreaController@destroy');