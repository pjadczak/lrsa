<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use \App\Models\User;
use \App\Repository\AuthRepository;

class AuthController extends Controller
{

    private AuthRepository $authRepository;
    private User $user;

    public function __construct(AuthRepository $repository){

        $this->authRepository = $repository;

    }

    public function login(Request $request)
    {

        $action = $this->authRepository->Login($request);
        if (!($action['result']??true)){
            return response(['comm'=>$action['comm']], 422);
        }
        return response($action, 200);

    }

    public function forgetPassword(Request $request){
        
        $action = $this->authRepository->ForgetPassword($request);
        if (!($action['result']??true)){
            return response(['comm'=>$action['comm']], 422);
        }
        return response($action, 200);

    }

    public function changePassword(Request $request){

        $action = $this->authRepository->ChangePassword($request);
        if (!($action['result']??true)){
            return response(['comm'=>$action['comm']], 422);
        }
        return response($action, 200);

    }

    /*
     * Remove tokens
     **/
    public function logout(){
        
        $action = $this->authRepository->Logout();
        if (!($action['result']??true)){
            return response(['comm'=>$action['comm']], 422);
        }
        return response($action, 200);

    }
    
    public function idleLogout(){
        
        $action = $this->authRepository->IdleLogout();
        if (!($action['result']??true)){
            return response(['comm'=>$action['comm']], 422);
        }
        return response($action, 200);

    }

    public function setLoginFromIdle(Request $request){
        
        $action = $this->authRepository->SetLoginFromIdle($request);
        if (!($action['result']??true)){
            return response(['comm'=>$action['comm']], 422);
        }
        return response($action, 200);

    }
}
