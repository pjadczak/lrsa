<?php

namespace App\Repository;

use \App\Models\Log;

class LogRepository{

    const LIST_PARTS = 30;

    public function GetList($data){

        $page = $data->pagCurrent>0 ? ($data->pagCurrent-1)*self::LIST_PARTS : 1;
        $logsCount = null;

        $logs = Log::
            skip($page-1)
            ->take(self::LIST_PARTS);
        
        if ($data->search!=''){
            $logs = $logs
                ->where('user_name','like','%'.$data->search.'%')
                ->orWhere('value','like','%'.$data->search.'%');
            ;
        }

        if (is_array($data->objs) && count($data->objs)){
            $logs = $logs->whereIn('object_operation',$data->objs);
        }

        if (!empty($data->date_start)){
            $logs = $logs->where('created_at','>=',$data->date_start.' 00:00:00');
        }
        if (!empty($data->date_end)){
            $logs = $logs->where('created_at','<=',$data->date_end.' 23:59:59');
        }

        if ($page==0 || $page==1){
            $logsCount = $logs->count();
        }

        $logs = $logs
            ->orderBy('id','DESC')
            ->get();

        return [
            'logs'=>$logs,
            'logs_count' => $logsCount,
            'parts' => self::LIST_PARTS,
            'objs' => $this->getTypes()
        ];
    }



    /******************************************************************************
     * 
     * Get log type
     * 
     *****************************************************************************/
    private function getTypes(){
        return [
            'article'=>'Articles',
            'user'=>'Users',
            'profile'=>'User profile',
            'form'=>'Send form requests',
            'template'=>'Templates',
        ];
    }


}