<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{

    protected $fillable = ['first_name', 'last_name', 'email', 'phone', 'plain_password'];

    public function subjects()
    {
        return $this->belongsToMany(Subject::class, 'teacher_subject');
    }
    public function availabilities()
    {
        return $this->hasMany(TeacherAvailability::class);
    }
}