<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WarehouseCategory extends Model
{
    use HasFactory;
    protected $fillable = ['name','active','user_id'];
    public $timestamps = false;
}
