<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = [
        'name',
        'capacity',
        'type'
    ];

    public function classes()
    {
        return $this->belongsToMany(
            SchoolClass::class,
            'class_room',
            'room_id',
            'class_id'
        );
    }
}