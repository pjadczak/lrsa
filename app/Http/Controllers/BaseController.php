<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use \App\Models\User;
use \App\Repository\BaseRepository;

class BaseController extends Controller
{

    private BaseRepository $baseRepository;
    private User $user;

    public function __construct(BaseRepository $repository){

        $this->baseRepository = $repository;
        $this->user = Auth::guard('api')->user();

    }


    public function getBaseData(){

        $action = $this->baseRepository->getBaseData();
        if (!($action['result']??true)){
            return response([ 'comm' => $action['comm'] ], 422);
        }

        return response( $action , 200 );
        
    }
}
