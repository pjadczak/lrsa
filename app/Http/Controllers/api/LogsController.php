<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use \App\Models\Log;
use Illuminate\Support\Facades\DB;
use \App\Repository\LogRepository;
use \App\Models\User;

class LogsController extends Controller
{

    private LogRepository $logRepository;
    private User $user;

    public function __construct(LogRepository $repository){
        $this->logRepository = $repository;
        $this->user = Auth::guard('api')->user();

        if (empty($user)){
            return response(['comm'=>'Unauthorized access'], 422);
        }

        $userLvl = $this->user->roles->roleLvl();
        if ($userLvl<4){
            return response(['comm'=>'Unauthorized access'], 422);
        }
    }

    public function getList(Request $request){

        return response($this->logRepository->GetList($request), 200);

    }

}
