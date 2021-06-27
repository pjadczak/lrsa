<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateArticleAddsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('article_adds', function (Blueprint $table) {
            $table->integerIncrements('id')->unsigned();
            $table->bigInteger('user_id')->nullable()->default(null)->unsigned();
            $table->index('user_id');
            $table->string('categories',50)->default('');
            $table->string('title',250)->default('');
            $table->string('slug_title',255)->default('');
            $table->string('photo',70)->default('');
            $table->json('content');
            $table->tinyInteger('active')->default(0);
            $table->tinyInteger('special')->default(0);

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('article_adds');
    }
}
