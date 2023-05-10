<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Sign in
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function signin(Request $request)
    {
        $data = $request->all();
        if((isset($data['email']) && $data['email'] != '') && (isset($data['password']) && $data['password'] != '')) {
            $credentials = $request->only('email', 'password');
            if (Auth::attempt($credentials)) {
                $request->session()->regenerate();
                return response()->json('success');
            } else {
                return response()->json([
                    'error' => 'Invalid email or password'
                ], 401);
            }
        } else {
            return response()->json([
                'response' => 0
            ]);
        }
    }

    /**
     * Check Auth
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function checkauth(Request $request)
    {
        return response()->json(auth('sanctum')->check());
    }

    /**
     * Sign Out
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function signout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        return response()->json(auth('sanctum')->check());
    }
}
