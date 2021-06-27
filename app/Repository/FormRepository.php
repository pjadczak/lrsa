<?php

namespace App\Repository;

use \App\Models\Form;
use Illuminate\Support\Facades\DB;
use \App\Models\Log;

class FormRepository{
    
    const MIN_ACCESS = 3;


    public function GetList($user,$data){

        $userLvl = $user->roleLvl();
        if ($userLvl<self::MIN_ACCESS){
            return [ 'result' => false, 'comm' => 'Unauthorized access'];
        }

        $parts = 15;
        $page = $data->pagCurrent>0 ? ($data->pagCurrent-1)*$parts : 1;
        $formsCount = null;

        $forms = Form::
            skip($page-1)
            ->take($parts);
        
        if ($data->search!=''){
            $forms = $forms
                ->where('name','like','%'.$data->search.'%')
                ->orWhere('email','like','%'.$data->search.'%')
                ->orWhere('content','like','%'.$data->search.'%');
            ;
        }

        if ($page==0 || $page==1){
            $formsCount = $forms->count();
        }

        $forms = $forms
            ->orderBy('id','DESC')
            ->groupBy('id')
            ->get([
                'id',
                'name',
                'email',
                'content',
                'ip',
                'dataRead',
                DB::raw('DATE_FORMAT(created_at, "%Y-%m-%d %H:%m") as dateAdd')
            ]);

        return [
            'forms'=>$forms,
            'forms_count' => $formsCount,
            'parts' => $parts
        ];

    }


    public function MakeRead($id,$user){

        $userLvl = $user->roleLvl();
        if ($userLvl<self::MIN_ACCESS){
            return [ 'result' => false, 'comm' => 'Unauthorized access'];
        }

        $form = Form::where(['id'=>$id])->first();

        if (empty($form)){
            return response(['comm'=>'I have not found a report'], 422);
        }

        $form->dataRead = date("Y-m-d H:i:s");
        $form->save();
        Log::add($user,'manage','form',$form->id.'|'.$form->name);

        return [ 'comm' => 'Changed' , 'dataRead' => $form->dataRead ];

    }


}