<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserTokensTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users_tokens', function (Blueprint $table) {
            $table->id('id');
            $table->timestamp('date_end');
            $table->index('date_end');
            $table->bigInteger('user_id')->unsigned();
            $table->index('user_id');
            $table->string('token',80)->default('');
            $table->index('token');
            $table->string('type',20)->default(null)->nullable();
            $table->index('type');

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }
}
