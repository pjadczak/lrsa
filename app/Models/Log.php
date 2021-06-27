<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Log extends Model
{
    use HasFactory;
    public $timestamps = false;
    public $fillable = [
        'user_id',
        'user_name',
        'type_operation',
        'object_operation',
        'value'
    ];

    static public function add($user,$type_operation,$object_operation,$value = null){
        self::create([
            'user_id' => (!empty($user) ? $user->id : null),
            'user_name' => (!empty($user) ? $user->name.' '.$user->surname : null),
            'type_operation' => Str::limit((String) $type_operation,30,''),
            'object_operation' => (!empty($object_operation) ? Str::limit($object_operation,30,'') : null),
            'value' => (!empty($value) ? Str::limit($value,100,'') : null)
        ]);
    }

}
