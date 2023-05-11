<?php

namespace App\Http\Controllers;

use App\Models\Cc;
use App\Models\Area;
use App\Models\User;
use App\Models\Construction;
use Illuminate\Http\Request;
use App\Models\PaymentMethod;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;

class AuthController extends Controller
{

    /**
     * Register
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function register(Request $request)
    {
        $data = $request->all();

        // check email exists or not
        $emailUser = User::where('email', $data['email'])->first();
        if($emailUser) {
            return response()->json(-2);
        }

        $cardData = [
            'aid' => 126030,
            'rt' => 0,
            'cod' => '',
            'em' => '',
            'pn' => '',
            'iid' => 'P001',
            'tkn' => $data['tkn']
        ];

        try {
            $response = Http::get('https://credit.j-payment.co.jp/gateway/gateway_token.aspx', $cardData);
        } catch (\Exception $e) {
            return response()->json(-1);
        }
    
        if (preg_replace('/\s+/', '', (string) $response->getBody()) == 'OK') {
            // payment success
            // store card info
            try {
                $cc = Cc::create([
                    'cn' => $data['card_number'],
                    'ed_month' => $data['expire_month'],
                    'ed_year' => $data['expire_year'],
                    'cvv' => $data['security_code'],
                    'fn' => $data['cardholder_name'],
                    'ln' => $data['cardholder_surname']
                ]);
            } catch (\Exception $e) {
                return response()->json(-1);
            }

            // store user
            try {
                $user = User::create([
                    'name' => $data['fname'].' '.$data['lname'],
                    'kana_name' => $data['kata_fname'].' '.$data['kata_lname'],
                    'company_name' => $data['company_name'],
                    'tel' => $data['tel'],
                    'url' => $data['company_url'],
                    'address01' => $data['address01'],
                    'address02' => $data['address02'],
                    'email' => $data['email'],
                    'password' => Hash::make($data['password']),
                    'cc_id' => $cc->id,
                    'payment_method_id' => $this->getPaymentMethodIdByName($data['payment_method']),
                    'role_id' => 2,
                    'status' => 1,
                    'order' => 1,
                ]);
            } catch (\Exception $e) {
                return response()->json(-1);
            }

            // store user_area and user_construction
            try {
                DB::table('area_user')->insert([
                    'area_id' => $this->getAreaIdByName($data['area']),
                    'user_id' => $user->id
                ]);
            } catch (\Exception $e) {
                return response()->json(-1);
            }

            if(isset($data['construction'])) {
                foreach ($data['construction'] as $con) {
                    $conId = $this->getConstructionIdByName($con);
            
                    if ($conId) {
                        try {
                            DB::table('construction_user')->insert([
                                'construction_id' => $conId,
                                'user_id' => $user->id,
                            ]);
                        } catch (\Exception $e) {
                            return response()->json(-1);
                        }
                    }
                }
            }

            return response()->json(1);

        } else {
            return response()->json(-1);
        }

        return response()->json(0);
    }


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

    public function getAreaIdByName($areaName)
    {
        $area = Area::where('name', $areaName)->first();

        if ($area) {
            return $area->id;
        }

        return null;
    }

    public function getConstructionIdByName($conName)
    {
        $con = Construction::where('name', $conName)->first();

        if ($con) {
            return $con->id;
        }

        return null;
    }

    public function getPaymentMethodIdByName($pmName)
    {
        $pm = PaymentMethod::where('name', $pmName)->first();

        if ($pm) {
            return $pm->id;
        }

        return null;
    }
}
