<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserToken extends Model
{
    use HasFactory;

    protected $table= 'users_tokens';
    protected $fillable = [
        'date_end',
        'user_id',
        'token',
        'type'
    ];

    public $timestamps = false;
}
