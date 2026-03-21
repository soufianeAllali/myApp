<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SchoolClass extends Model
{
    protected $table = 'classes';

    protected $fillable = [
        'name',
        'level',
    ];

    public function subjects()
    {
        return $this->belongsToMany(
            Subject::class,
            'class_subject',
            'class_id',     
            'subject_id'   
        )->withPivot('hours_per_week')
        ->withTimestamps();
    }
    public function rooms()
    {
        return $this->belongsToMany(
            Room::class,
            'class_room',
            'class_id',
            'room_id'
        );
    }
}