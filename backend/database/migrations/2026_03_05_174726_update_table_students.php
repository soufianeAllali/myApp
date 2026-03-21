<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {

            if (Schema::hasColumn('students', 'user_id')) {
                $table->dropForeign(['user_id']);
                $table->dropColumn('user_id');
            }

            $table->string('first_name')->after('id');
            $table->string('last_name')->after('first_name');
            $table->string('email')->nullable()->unique()->after('last_name');
            $table->string('phone')->nullable()->after('email');

        });
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {

            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->dropColumn(['first_name', 'last_name', 'email', 'phone']);
        });
    }
};