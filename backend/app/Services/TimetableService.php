<?php

namespace App\Services;

use App\Models\ClassRoom;
use App\Models\ClassSubject;
use App\Models\Room;
use App\Models\Schedule;
use App\Models\TeacherAvailability;
use App\Models\TeacherSubject;
use Illuminate\Support\Facades\DB;

class TimetableService
{
    /**
     * Generate timetable for all classes
     */
    public function generate()
    {
        Schedule::truncate();

        $classes = \App\Models\SchoolClass::all();
        $timeSlots = \App\Models\TimeSlot::all();
        $rooms = Room::all();

        foreach ($classes as $class) {
            $classSubjects = ClassSubject::where('class_id', $class->id)->get();

            foreach ($classSubjects as $classSubject) {
                $hoursNeeded = $classSubject->hours_per_week;

                for ($i = 0; $i < $hoursNeeded; $i++) {
                    $assigned = false;
        
                    foreach ($timeSlots as $slot) {
                        $classBusy = Schedule::where('class_id', $class->id)
                            ->where('time_slot_id', $slot->id)
                            ->exists();
                        if ($classBusy) continue;
            
                        $teacherIds = TeacherSubject::where('subject_id', $classSubject->subject_id)
                            ->pluck('teacher_id');

                        $teacherId = null;

                        foreach ($teacherIds as $tid) {
                            $teacherAvailable = TeacherAvailability::where('teacher_id', $tid)
                                ->where('time_slot_id', $slot->id)
                                ->where('is_available', 1)
                                ->exists();

                            $teacherBusy = Schedule::where('teacher_id', $tid)
                                ->where('time_slot_id', $slot->id)
                                ->exists();

                            if ($teacherAvailable && !$teacherBusy) {
                                $teacherId = $tid;
                                break;
                            }
                        }

                        if (!$teacherId) continue;

                        $roomId = null;
                        foreach ($rooms as $room) {
                            $roomBusy = Schedule::where('room_id', $room->id)
                                ->where('time_slot_id', $slot->id)
                                ->exists();
                            if (!$roomBusy) {
                                $roomId = $room->id;
                                break;
                            }
                        }

                        if (!$roomId) continue;

                        Schedule::create([
                            'class_id'      => $class->id,
                            'subject_id'    => $classSubject->subject_id,
                            'teacher_id'    => $teacherId,
                            'room_id'       => $roomId,
                            'time_slot_id'  => $slot->id,
                        ]);

                        $assigned = true;
                        break; 
                    }

                    if (!$assigned) {

                    }
                }
            }
        }
    }
}