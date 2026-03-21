<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TimeSlot;
use App\Models\TeacherAvailability;
use App\Models\Teacher;
use Illuminate\Http\Request;

class TimeSlotController extends Controller
{
    public function index()
    {
        return TimeSlot::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'day' => 'required|string|max:20',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        $slot = TimeSlot::create($request->all());
        return response()->json($slot, 201);
    }

    public function show(TimeSlot $timeSlot)
    {
        return $timeSlot;
    }

    public function update(Request $request, TimeSlot $timeSlot)
    {
        $request->validate([
            'day' => 'required|string|max:20',
            'start_time' => 'required',
            'end_time' => 'required|after:start_time',
        ]);

        $timeSlot->update($request->all());
        return response()->json($timeSlot);
    }

    public function destroy(TimeSlot $timeSlot)
    {
        $timeSlot->delete();
        return response()->json(['message' => 'Créneau horaire supprimé avec succès']);
    }

    public function teachersWithAvailabilities()
    {
        return Teacher::with('availabilities')->get();
    }

    public function toggleAvailability(Request $request)
    {
        $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'time_slot_id' => 'required|exists:time_slots,id'
        ]);

        $availability = TeacherAvailability::firstOrCreate([
            'teacher_id' => $request->teacher_id,
            'time_slot_id' => $request->time_slot_id
        ], [
            'is_available' => true 
        ]);

        $availability->is_available = !$availability->is_available;
        $availability->save();

        return response()->json($availability);
    }
}