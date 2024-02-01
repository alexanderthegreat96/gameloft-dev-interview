<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('video_items', function (Blueprint $table) {
            $table->id();
            $table->string('guid');
            $table->string("title", 120);
            $table->text("description");
            $table->string("thumbnail");
            $table->string("link");
            $table->datetime("publish_date");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('video_items');
    }
};
