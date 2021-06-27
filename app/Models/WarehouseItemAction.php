<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use \App\Models\Warehouse;

class WarehouseItemAction extends Model
{
    use HasFactory;
    protected $fillable = [
        'warehouse_item_id',
        'warehouse_id',
        'moderator_user_id',
        'user_id',
        'user_name',
        'comment',
        'date_suggested',
        'status',
        'state',
        'name'
    ];

    protected $casts = [
        'warehouse_item_id' => 'integer',
        'warehouse_id' => 'integer',
        'moderator_user_id' => 'integer',
        'user_id' => 'integer',
        'status' => 'integer'
    ];

    public function warehouse(){
        return $this->belongsTo(Warehouse::class);
    }

}
