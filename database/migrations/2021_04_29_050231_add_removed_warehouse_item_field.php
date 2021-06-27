<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRemovedWarehouseItemField extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('warehouse_items', function (Blueprint $table) {
            $table->tinyInteger('disabled')->default(0)->after('code');
            $table->index('disabled');
        });
    }
}
