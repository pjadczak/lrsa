<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('logs', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id')->nullable()->default(null)->unsigned();
            $table->index('user_id');
            $table->string('user_name',50)->default(null)->nullable();
            $table->index('user_name');
            $table->string('type_operation',30)->default('update')->comment('update,insert,delete,manage,login,logout');
            $table->index('type_operation');
            $table->string('object_operation',30)->default(null)->nullable()->comment('user,settings,form,article itp');
            $table->index('object_operation');
            $table->string('value',100)->default(null)->nullable();
            $table->index('value');
            $table->dateTime('created_at');
            $table->index('created_at');

            $table->foreign('user_id')->references('id')->on('users')->onDelete(DB::raw('set null'))->onChange('cascade');
        });

        DB::unprepared('ALTER TABLE logs CHANGE created_at created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP;');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('logs');
    }
}
