<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEmailTemplateHeadersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('email_template_headers', function (Blueprint $table) {
            $table->smallIncrements('id');
            $table->string('name',100)->default('');
            $table->string('slug',40)->default('');
            $table->index('slug');
            $table->string('variables',300)->default('')->comment('Zmienne po przecinku');
            $table->text('description')->default(null)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('email_template_headers');
    }
}
