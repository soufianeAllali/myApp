<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeacherAvailability extends Model
{
    use HasFactory;

    protected $fillable = ['teacher_id', 'time_slot_id', 'is_available'];
    public $timestamps = false;
    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function timeSlot()
    {
        return $this->belongsTo(TimeSlot::class);
    }

}
