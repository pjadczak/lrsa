<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateEmailTemplatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('email_templates', function (Blueprint $table) {
            $table->integerIncrements('id');
            $table->string('name',150)->default('');
            $table->text('content')->nullable();
            $table->string('photo',70)->default('');
            $table->smallInteger('template_type_id')->unsigned();
            $table->index('template_type_id');
            $table->timestamps();

            $table->foreign('template_type_id')->references('id')->on('email_template_headers')->onDelete('cascade');
        });
        DB::unprepared('ALTER TABLE email_templates CHANGE created_at created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP;');
        DB::unprepared('ALTER TABLE email_templates CHANGE updated_at updated_at TIMESTAMP on update CURRENT_TIMESTAMP NULL DEFAULT NULL;');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('email_templates');
    }
}
