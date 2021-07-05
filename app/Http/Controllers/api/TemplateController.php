<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use \App\Repository\BaseRepository;
use \App\Repository\TemplateRepository;
use \App\Models\User;

class TemplateController extends Controller
{
    private BaseRepository $baseRepository;
    private TemplateRepository $templateRepository;
    private User $user;

    public function __construct(BaseRepository $repository, TemplateRepository $templateRepository)
    {
        $this->baseRepository = $repository;
        $this->templateRepository = $templateRepository;

        $this->user = Auth::guard('api')->user();
        if (empty($this->user)){
            return response(['comm'=>'Unauthorized access'], 422);
        }
    }




    public function changeTemplatePhoto(Request $request,int $id){

        if (!$this->user->isRoot()){
            return response([ 'comm'=>'No access right' ], 422);
        }

        $action = $this->templateRepository->ChangeTemplatePhoto($id, $this->user, $request);
        if (!($action['result']??true)){
            return response([ 'comm'=>$action['comm'] ], 422);
        }
        
        return response($action, 200);

    }




    public function removeTemplatePhoto(int $id){

        if (!$this->user->isRoot()){
            return response([ 'comm'=>'No access right' ], 422);
        }

        $action = $this->templateRepository->RemoveTemplatePhoto($id,$this->user);
        if (!($action['result'])){
            return response([ 'comm'=>$action['comm'] ], 422);
        }

        return response($action, 200);

    }




    public function removeTemplate(int $id){

        if (!$this->user->isRoot()){
            return response(['comm'=>'No access right'], 422);
        }

        $action = $this->templateRepository->RemoveTemplate($id, $this->user);
        if (!($action['result']??true)){
            return response([ 'comm'=>$action['comm'] ], 422);
        }

        return response($action, 200);

    }





    public function getTemplatesList(Request $request){

        if (!$this->user->isRoot()){
            return response([ 'comm'=>'No access right' ], 422);
        }

        return response([
            'templates' => $this->templateRepository->GetTemplatesList($request),
        ], 200);

    }



    /*
     * Get e-mail templates
     * If new templates, let show not choosen types
     **/
    public function getTemplate($id){

        if (!$this->user->isRoot()){
            return response([ 'comm' => 'No access right' ], 422);
        }

        $action = $this->templateRepository->GetTemplate($id);
        if (!($action['result']??true)){
            return response([ 'comm' => $action['comm'] ], 422);
        }

        return response($action, 200);

    }




    public function saveTemplate(Request $request,$id){

        if (!$this->user->isRoot()){
            return response([ 'comm' => 'No access right' ], 422);
        }

        $action = $this->templateRepository->SaveTemplate($this->user,$request,$id);
        if (!($action['result']??true)){
            return response([ 'comm' => $action['comm'], 'errors' => $action['errors']??[] ], 422);
        }

        return response($action, 200);

    }



    public function testSendEmailTempate(Request $request){

        if ($this->templateRepository->TestSendEmailTempate($request)){
            return response([ 'comm'=>'Template test sent' ], 200);
        } else {
            return response([ 'comm'=>'Template sending error' ], 422);
        }

    }
}