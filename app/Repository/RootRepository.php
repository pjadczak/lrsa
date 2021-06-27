<?php

namespace App\Repository;

use \Akaunting\Setting\Facade as  Settings;

class RootRepository{


    public function ReadSettings(){
        
        return [
            'idle' => Settings::has('idle') ? intval(Settings::get('idle')) : 0,
            'idle_time' => Settings::has('idle_time') ? intval(Settings::get('idle_time')) : 900,
        ];

    }



    public function SaveSettings($data){

        Settings::set('idle',$data->idle);
        Settings::set('idle_time',$data->idleTime);
        Settings::save();

        return [
            'comm' => 'Configuration saved',
            'settings' => Settings::all(),
        ];

    }

}