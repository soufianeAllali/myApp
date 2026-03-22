<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimeSlot extends Model
{
    use HasFactory;

    protected $fillable = ['day', 'start_time', 'end_time'];
    public $timestamps = false;

    public function teacherAvailabilities()
    {
        return $this->hasMany(TeacherAvailability::class);
    }
}