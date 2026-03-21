<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    protected $fillable = [
        'class_id',
        'subject_id',
        'teacher_id',
        'room_id',
        'time_slot_id',
    ];


    public function class()
    {
        return $this->belongsTo(\App\Models\SchoolClass::class, 'class_id');
    }

    public function subject()
    {
        return $this->belongsTo(\App\Models\Subject::class, 'subject_id');
    }

    public function teacher()
    {
        return $this->belongsTo(\App\Models\Teacher::class, 'teacher_id');
    }

    public function room()
    {
        return $this->belongsTo(\App\Models\Room::class, 'room_id');
    }

    public function timeSlot()
    {
        return $this->belongsTo(\App\Models\TimeSlot::class, 'time_slot_id');
    }
}