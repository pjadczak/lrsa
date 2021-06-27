<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateArticlesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->integerIncrements('id')->unsigned();
            $table->bigInteger('user_id')->nullable()->default(null)->unsigned()->comment('Author');
            $table->string('title',250)->default('');
            $table->index('title');
            $table->string('slug_title',255)->default('');
            $table->index('slug_title');
            $table->string('photo',70)->default('');
            $table->json('content');
            $table->text('contentHtml');
            $table->tinyInteger('active')->default(0);
            $table->tinyInteger('special')->default(0);
            $table->integer('read_counter')->default(null)->nullable();
            $table->dateTime('last_read')->default(null)->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete(DB::raw('set null'))->onChange('cascade');
        });

        DB::unprepared('ALTER TABLE articles CHANGE created_at created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP;');
        DB::unprepared('ALTER TABLE articles CHANGE updated_at updated_at TIMESTAMP on update CURRENT_TIMESTAMP NULL DEFAULT NULL;');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('articles');
    }
}
