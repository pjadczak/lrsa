<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateWarehouseCategoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('warehouse_categories', function (Blueprint $table) {
            $table->integerIncrements('id');
            $table->string('name',100)->default('');
            $table->tinyInteger('active')->default(1);
            $table->bigInteger('user_id')->default(null)->nullable()->unsigned()->comm('User creator');
            $table->foreign('user_id')->references('id')->on('users')->onDelete(DB::raw('set null'))->onChange('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('warehouse_categories');
    }
}
