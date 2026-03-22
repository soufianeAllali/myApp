<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('name');
            $table->foreignId('teacher_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('student_id')->nullable()->constrained()->cascadeOnDelete();

        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {

            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();

            $table->dropForeign(['teacher_id']);
            $table->dropForeign(['student_id']);

            $table->dropColumn(['teacher_id', 'student_id']);
        });
    }
};