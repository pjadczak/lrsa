<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use \App\Models\User;
use \App\Repository\UserRepository;

class UsersController extends Controller
{
    const MIN_ACCESS_LVL = 4;
    const LIST_PARTS = 15;

    private UserRepository $userRepository;
    private User $user;

    public function __construct(UserRepository $userRepository){

        $this->userRepository = $userRepository;
        $this->user = Auth::guard('api')->user();

        if (empty($this->user)){
            return response([ 'comm' => 'Unauthorized access' ], 422 );
        }

        if ($this->user->roleLvl()<self::MIN_ACCESS_LVL){
            return response([ 'comm' => 'Unauthorized access' ], 422 );
        }

    }

    public function getUsers(Request $request){
        
        return response( $this->userRepository->GetUsers($request), 200 );
        
    }

    public function getUser($id){

        return response( $this->userRepository->GetUser($id), 200 );
    }

    public function saveUserSettings(Request $request,$id){

        $action = $this->userRepository->SaveUserSettings($request,$id,$this->user);
        if (!($action['result']??true)){
            return response([ 'comm' => $action['comm'], 'errors' => $action['errors'] ], 422);
        }

        return response( $action , 200 );

    }

    /*
     * Add/Change photo profile by self user
     **/
    public function uploadPhotoUser(Request $request,$id){

        $action = $this->userRepository->UploadPhotoUser($request,$id,$this->user);
        if (!($action['result']??true)){
            return response([ 'comm' => $action['comm'] ], 422);
        }

        return response( $action , 200 );

    }

    public function removePhotoUser(Request $request,$id){
        
        $action = $this->userRepository->RemovePhotoUser($id,$this->user);
        if (!($action['result']??true)){
            return response([ 'comm' => $action['comm'] ], 422);
        }

        return response( $action , 200 );

    }

    /*
     * Show/Hide left sidebar
     **/
    public function saveShowLeftBar(Request $request){

        return response( $this->userRepository->SaveShowLeftBar($request,$this->user) , 200);

    }
}
