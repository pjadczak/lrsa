<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateWarehouseItemActionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('warehouse_item_actions', function (Blueprint $table) {
            $table->integerIncrements('id');
            $table->integer('warehouse_item_id')->unsigned()->nullable()->default(null);
            $table->index('warehouse_item_id');
            $table->integer('warehouse_id')->unsigned()->nullable()->default(null);
            $table->index('warehouse_id');
            $table->bigInteger('user_id')->unsigned()->nullable()->default(null);
            $table->index('user_id');
            $table->string('user_name')->default('');
            $table->text('comment');
            $table->date('date_suggested')->nullable()->default(null);
            $table->tinyInteger('status')->default(0)->comment('1 - move to warehouse, 2 - borrow, 3 - sell, 99 - utylize');
            $table->tinyInteger('state')->nullable()->default(null)->comment('1 - small changes, 3 - big changes, 4 - destroy');
            $table->bigInteger('moderator_user_id')->unsigned()->nullable()->default(null);
            $table->index('moderator_user_id');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete(DB::raw('set null'))->onChange('cascade');
            $table->foreign('moderator_user_id')->references('id')->on('users')->onDelete(DB::raw('set null'))->onChange('cascade');
            $table->foreign('warehouse_id')->references('id')->on('warehouse')->onDelete(DB::raw('set null'))->onChange('cascade');
            $table->foreign('warehouse_item_id')->references('id')->on('warehouse_items')->onDelete(DB::raw('set null'))->onChange('cascade');
        });

        DB::unprepared('ALTER TABLE warehouse_item_actions CHANGE created_at created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP;');
        DB::unprepared('ALTER TABLE warehouse_item_actions CHANGE updated_at updated_at TIMESTAMP on update CURRENT_TIMESTAMP NULL DEFAULT NULL;');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('warehouse_item_actions');
    }
}
