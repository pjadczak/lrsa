<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('surname',60)->default('');
            $table->string('login',35)->default(null)->nullable();
            $table->index('login');
            $table->tinyInteger('active')->default(0);
            $table->dateTime('last_login')->default(null)->nullable();
            $table->string('email')->unique();
            $table->string('photo',50)->default('');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('idle_token',50)->default(null)->nullable();
            $table->index('idle_token');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
