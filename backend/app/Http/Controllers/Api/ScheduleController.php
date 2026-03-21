<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use App\Models\Student;
use App\Models\Schedule;
use App\Services\TimetableService;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    protected $timetableService;

    public function __construct(TimetableService $timetableService)
    {
        $this->timetableService = $timetableService;
    }

    public function generate()
    {
        try {
            $this->timetableService->generate();
            return response()->json(['message' => 'Timetable generated successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function index()
    {
        $schedules = Schedule::with(['class','subject','teacher','room','timeSlot'])->get();
        return response()->json($schedules);
    }

    public function getTeacherSchedules(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'teacher') {
            return response()->json(['error' => 'Unauthorized. Only teachers can access this.'], 403);
        }

        $teacher = Teacher::where('email', $user->email)->first();
        if (!$teacher) {
            return response()->json(['error' => 'Teacher profile not found for this email.'], 404);
        }

        $schedules = Schedule::where('teacher_id', $teacher->id)
            ->with(['class', 'subject', 'room', 'timeSlot'])
            ->get();

        return response()->json($schedules);
    }

    public function getStudentSchedules(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'student') {
            return response()->json(['error' => 'Unauthorized. Only students can access this.'], 403);
        }

        $student = Student::where('email', $user->email)->first();
        if (!$student) {
            return response()->json(['error' => 'Student profile not found for this email.'], 404);
        }

        $schedules = Schedule::where('class_id', $student->class_id)
            ->with(['subject', 'teacher', 'room', 'timeSlot', 'class'])
            ->get();

        return response()->json($schedules);
    }
}