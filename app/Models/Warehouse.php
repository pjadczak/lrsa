<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use \App\Models\WarehouseItem;
use \App\Models\WarehouseItemAction;

class Warehouse extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $table = 'warehouse';
    protected $fillable = [
        'name',
        'def',
        'address'
    ];

    public function items(){
        return $this->hasMany(WarehouseItem::class);
    }

    public function itemsActions(){
        return $this->hasMany(WarehouseItemAction::class);
    }
}
