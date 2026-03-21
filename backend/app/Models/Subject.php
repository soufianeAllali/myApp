<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{

    protected $fillable = ['name'];

    public function teachers()
    {
        return $this->belongsToMany(Teacher::class, 'teacher_subject');
    }
    public function classes()
    {
        return $this->belongsToMany(
            SchoolClass::class,
            'class_subject',
            'subject_id',
            'class_id'
        )->withPivot('hours_per_week')
        ->withTimestamps();
    }
}