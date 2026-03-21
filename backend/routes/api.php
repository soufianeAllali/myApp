<?php

use App\Http\Controllers\Api\ClasseController;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MetierController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\TimeSlotController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\AccountRequestController;
use App\Exports\StudentsExport;
use App\Exports\TeachersExport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Route;


Route::apiResource('teachers', TeacherController::class);
Route::apiResource('subjects', MetierController::class);
Route::apiResource('classes', ClasseController::class);
Route::apiResource('rooms', RoomController::class);
Route::apiResource('time_slots', TimeSlotController::class);
Route::get('teachers_with_availabilities', [TimeSlotController::class, 'teachersWithAvailabilities']);
Route::post('teacher_availabilities/toggle', [TimeSlotController::class, 'toggleAvailability']);
Route::apiResource('students', StudentController::class);
Route::get('/schedules', [ScheduleController::class, 'index']);
Route::post('/schedules/generate', [ScheduleController::class, 'generate']);

Route::post('/login', [AuthController::class, 'login']);

Route::post('/account-requests', [AccountRequestController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    Route::get('/teacher/schedules', [ScheduleController::class, 'getTeacherSchedules']);
    Route::get('/student/schedules', [ScheduleController::class, 'getStudentSchedules']);

    Route::get('/admin/account-requests', [AccountRequestController::class, 'index']);
    Route::post('/admin/account-requests/{id}/approve', [AccountRequestController::class, 'approve']);
    Route::delete('/admin/account-requests/{id}', [AccountRequestController::class, 'reject']);
});

Route::get('/export-students', function () {
    return Excel::download(new StudentsExport, 'students.xlsx');
});

Route::get('/export-teachers', function () {
    return Excel::download(new TeachersExport, 'teachers.xlsx');
});


Route::get('/birthday', [StudentController::class, 'sendBirthdayGreetings']);
