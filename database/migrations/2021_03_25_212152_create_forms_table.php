<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateFormsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('forms', function (Blueprint $table) {
            $table->integerIncrements('id');
            $table->string('name',50)->default('');
            $table->string('email',180)->default('');
            $table->text('content');
            $table->string('ip',15)->default(null)->nullable();
            $table->dateTime('dataRead')->default(null)->nullable();
            $table->timestamps();
        });

        DB::unprepared('ALTER TABLE forms CHANGE created_at created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP;');
        DB::unprepared('ALTER TABLE forms CHANGE updated_at updated_at TIMESTAMP on update CURRENT_TIMESTAMP NULL DEFAULT NULL;');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('forms');
    }
}
