<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateWarehouseItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('warehouse_items', function (Blueprint $table) {
            $table->integerIncrements('id');
            $table->integer('warehouse_category_id')->unsigned()->nullable()->default(null);
            $table->index('warehouse_category_id');
            $table->integer('warehouse_id')->unsigned()->default(null)->nullable();
            $table->index('warehouse_id');
            $table->tinyInteger('on_state')->default(1)->comment('Item located in state');
            $table->bigInteger('user_id')->unsigned()->default(null)->nullable()->comment('Moderator');
            $table->index('user_id');
            $table->string('name',120)->default('');
            $table->string('code',50)->default('');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete(DB::raw('set null'))->onChange('cascade');
            $table->foreign('warehouse_category_id')->references('id')->on('warehouse_categories')->onDelete(DB::raw('set null'))->onChange('cascade');
            $table->foreign('warehouse_id')->references('id')->on('warehouse')->onDelete(DB::raw('set null'))->onChange('cascade');
        });

        DB::unprepared('ALTER TABLE warehouse_items CHANGE created_at created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP;');
        DB::unprepared('ALTER TABLE warehouse_items CHANGE updated_at updated_at TIMESTAMP on update CURRENT_TIMESTAMP NULL DEFAULT NULL;');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('warehouse_items');
    }
}
