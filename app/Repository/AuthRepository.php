<?php

namespace App\Repository;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use \App\Models\Log;
use \App\Models\User;
use \App\Models\UserToken;
use Illuminate\Support\Str;
use \App\Repository\BaseRepository;

class AuthRepository{


    public function Login($data)
    {

        $validator = Validator::make($data->all(), [
            // 'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:3',
        ]);
        if ($validator->fails()){
            return [ 'result' => false, 'errors' => $validator->errors()->all(), 'errCode' => 1,'comm' => 'Incorrect login details' ];
        }

        // $user = User::where('email', $request->email)->first();
        $user = User::whereRaw("
        (
            (email like ? and email<>'')
            OR
            (login like ? and login<>'')
        )
        ",[$data->email,$data->email])->first();
        if ($user) {
            if (Hash::check($data->password, $user->password)) {

                if (!$user->active){
                    return [ 'result' => false, 'errors' => null, 'errCode' => 4, 'comm' => 'The user has not activated' ];
                }

                $user->last_login = date("Y-m-d H:i:s");
                $user->save();

                $user->tokens->each(function($token, $key) {
                    $token->delete();
                });

                $token = $user->createToken('Laravel Password Grant Client')->accessToken;
                $userData = BaseRepository::getUserData($user);
                Log::add($user,'login','user',$user->name.' '.$user->name);

                return [ 'token' => $token , 'name' => $user->name, 'email' => $user->email, 'id' => $user->id , 'userData' => $userData ];
            } else {
                return [ 'result' => false, 'errors' => null, 'comm'=>'Wrong password', 'errCode' => 2 ];
            }
        } else {
            return [ 'result' => false, 'errors'=>null, 'comm' => 'Incorrect login details', 'errCode' => 3 ];
        }
    }



    public function ForgetPassword($data){

        $login = $data->input('login');

        if (trim($login)==''){
            return [ 'result' => false, 'errors' => null, 'comm' => 'E-mail address / login not entered', 'errCode' => 1 ];
        }

        $user = User::
            where('active','=',1)
            ->where(function($q) use($login){
                $q->where('email','like',$login);
                $q->orWhere('login','like',$login);
            })
            ->first();
        if (empty($user)){
            return [ 'result' => false, 'errors' => null, 'comm' => 'User not found. Enter the correct E-mail or Login details', 'errCode' => 2 ];
        }

        if (!filter_var($user->email, FILTER_VALIDATE_EMAIL)) {
            return [ 'result' => false, 'errors' => null, 'comm' => 'There is no e-mail address assigned to this account', 'errCode' => 2 ];
        }

        $token = BaseRepository::generateRandomString(80);
        \App\Models\UserToken::create([
            'user_id' => $user->id,
            'date_end' => date('Y-m-d H:i:s',time()+(3600)),
            'token' => $token,
            'type' => 'forget-password'
        ]);

        $url = env('APP_URL').env('APP_PANEL_PREFIX').'/changePassword/'.$token;
        Mail::send('mails.forget', $data = [ 'link'=>$url  ], function($message) use($user){
            $message->from( trim(env('MAIL_USERNAME')), env('APP_NAME') );
            $message->subject('Zmiana hasła w serwisie '.env('APP_NAME_SHORT'));
            $message->to( $user->email );
        });
        Log::add($user,'forget_password','user',$user->name.' '.$user->name);

        return [ 'token' => $user->active_token, 'comm' => 'The manual has been sent to your e-mail address, check your e-mail.' ];
    }



    public function ChangePassword($data){

        $userToken = UserToken::where(['token'=>$data->token,'type'=>'forget-password'])->first();
        if (empty($userToken)){
            return [ 'result' => false, 'errors' => null, 'comm' => 'Invalid token' ];
        }

        $user = User::where(['id'=>$userToken->user_id,'active'=>1])->first();
        if (empty($user)){
            return [ 'result' => false, 'errors' => null, 'comm' => 'Wrong user' ];
        } else {
            $validData = [
                // 'name' => 'required|string|max:255',
                'password' => [
                    'required',
                    'string',
                    'confirmed',
                    'min:8',             // must be at least 10 characters in length
                    'regex:/[a-z]/',      // must contain at least one lowercase letter
                    'regex:/[A-Z]/',      // must contain at least one uppercase letter
                    'regex:/[0-9]/',      // must contain at least one digit
                    'regex:/[@$!%*#?&]/', // must contain a special character
                ],
            ];

            $validator = Validator::make($data->all(), $validData );
            if ($validator->fails())
            {
                return [ 'result' => false, 'errors' => $validator->errors()->all(), 'comm' => 'Wrong password format' ];
            }

            $user->password = Hash::make($data->password);
            $user->save();
            Log::add($user,'change_password','user',$user->name.' '.$user->name);

            $token = $user->createToken('Laravel Password Grant Client')->accessToken;
            $userData = BaseRepository::getUserData($user);

            return [ 'userData' => $userData, 'token' => $token, 'comm' => 'The password has been changed, you will be logged into the website in a moment' ];

        }

    }




    public function Logout(){

        $user = Auth::guard('api')->user();
        if (empty($user)){
            return [ 'result' => false, 'comm' => 'Unauthorized access' ];
        }
        Log::add($user,'logout','user',$user->name.' '.$user->name);

        $user->tokens->each(function($token, $key) {
            $token->delete();
        });
    
        return [ 'comm' => 'Logout' ];
    
    }



    public function IdleLogout(){

        $user = Auth::guard('api')->user();
        if (empty($user)){
            return [ 'result' => false, 'comm' => 'Unauthorized access' ];
        }

        $user->tokens->each(function($token, $key) {
            $token->delete();
        });

        $token = Str::random(50);
        $user->idle_token = $token;
        $user->save();

        return [ 'comm' => 'Logout idle', 'token' => $token ];

    }



    public function SetLoginFromIdle($data){
        $user = User::where(['idle_token'=>$data->token,'login'=>$data->login])->first();
        if (empty($user)){
            return [ 'result' => false, 'comm' => 'Wrong data' ];
        }

        if (!Hash::check($data->password, $user->password)){
            return [ 'result' => false, 'comm' => 'Wrong data'];
        }

        $token = $user->createToken('Laravel Password Grant Client')->accessToken;
        $userData = BaseRepository::getUserData($user);
        Log::add($user,'login','user','idle - '.$user->name.' '.$user->name);

        $user->idle_token = '';
        $user->save();

        return ['token' => $token, 'userData' => $userData ];

    }

}