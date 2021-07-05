<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use \App\Repository\ProfileRepository;
use \App\Models\User;

class ProfileController extends Controller
{

    private ProfileRepository $profileRepository;
    private User $user;

    public function __construct(ProfileRepository $repository){

        $this->profileRepository = $repository;
        $this->user = Auth::guard('api')->user();

        if (empty($this->user)){
            return response(['comm'=>'Unauthorized access'], 422);
        }

    }

    public function getRoles(){
        
        $action = $this->profileRepository->GetRoles($this->user);
        if (!($action['result']??true)){
            return response(['comm'=>$action['comm']], 422);
        }
        return response($action, 200);

    }

    /*
     * Add photo profile by self user
     **/
    public function uploadPhotoProfile(Request $request){
        
        $action = $this->profileRepository->UploadPhotoProfile($request,$this->user);
        if (!($action['result']??true)){
            return response(['comm'=>$action['comm']], 422);
        }
        return response($action, 200);

    }

    /*
     * Remove photo profile by self user
     **/
    public function removePhotoProfile(Request $request){

        return response( $this->profileRepository->RemovePhotoProfile($request,$this->user), 200);

    }

    public function saveDataProfile(Request $request){
        
        $action = $this->profileRepository->SaveDataProfile($request,$this->user);
        if (!($action['result']??true)){
            return response(['comm'=>$action['comm'], 'errors' => $action['errors']??[] ], 422);
        }
        return response($action, 200);

    }
}
