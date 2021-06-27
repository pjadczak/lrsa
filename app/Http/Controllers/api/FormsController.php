<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use \App\Models\Form;
use Illuminate\Support\Facades\DB;
use \App\Models\Log;
use \App\Models\User;
use \App\Repository\FormRepository;

class FormsController extends Controller
{

    private User $user;
    private FormRepository $formRepository;

    public function __construct(FormRepository $repository){
        $this->formRepository = $repository;
        $this->user = Auth::guard('api')->user();
    }


    public function getList(Request $request){
        
        $action = $this->formRepository->GetList($this->user,$request);
        if (!($action['result']??true)){
            return response(['comm'=>$action['comm']], 422);
        }
        return response($action, 200);

    }

    public function makeRead($id){
        
        $action = $this->formRepository->MakeRead($id,$this->user);
        if (!($action['result']??true)){
            return response(['comm'=>$action['comm']], 422);
        }

        return response($action, 200);

    }
}
