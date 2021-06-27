<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use \App\Repository\RootRepository;
use \App\Models\User;

class RootController extends Controller
{
    const MIN_ACCESS_LVL = 5;

    private User $user;
    private RootRepository $rootRepository;

    public function __construct(RootRepository $repository){
        $this->rootRepository = $repository;
        $this->user = Auth::guard('api')->user();
        if (empty($this->user)){
            return response(['comm'=>'Unauthorized access'], 422);
        }

        if ($this->user->roleLvl()<self::MIN_ACCESS_LVL){
            return response(['comm'=>'Unauthorized access'], 422);
        }

    }

    public function readSettings(){
        
        return response( $this->rootRepository->ReadSettings(), 200 );
    
    }

    public function saveSettings(Request $request){

        return response( $this->rootRepository->SaveSettings($request), 200);

    }
}
