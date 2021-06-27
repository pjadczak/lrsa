<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use \App\Models\Warehouse;

class WarehouseItem extends Model
{
    use HasFactory;
    protected $fillable = [
        'warehouse_category_id',
        'warehouse_id',
        'on_state',
        'user_id',
        'name',
        'code'
    ];

    protected $casts = [
        'disabled' => 'integer',
        'warehouse_category_id' => 'integer',
        'warehouse_id' => 'integer',
        'on_state' => 'integer',
        'user_id' => 'integer'
    ];

    public function warehouse(){
        return $this->belongsTo(Warehouse::class);
    }
}
