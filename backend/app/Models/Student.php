<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'plain_password',
        'class_id',
        'birthDate'
    ];
    public function class(){
        return $this->belongsTo(SchoolClass::class,'class_id');
    }
}