<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use App\Mail\StudentAccountMail;    
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Crypt;

class TeacherController extends Controller
{
    public function index()
    {
        return Teacher::with('subjects')->get();
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|email|unique:teachers,email',
            'phone'      => 'required|string|max:20',
            'subjects'   => 'required|array|min:1'
        ]);

        $password = 'teacher_' . Str::random(6); 
        
        $teacher = Teacher::create([
            'first_name'     => $validated['first_name'],
            'last_name'      => $validated['last_name'],
            'email'          => $validated['email'],
            'phone'          => $validated['phone'],
            'plain_password' => Crypt::encryptString($password),
        ]);

        $teacher->subjects()->sync($validated['subjects']);

        User::create([
            'email'      => $teacher->email,
            'role'       => 'teacher',
            'teacher_id' => $teacher->id,
            'password'   => Hash::make($password)
        ]);
        Mail::to($teacher->email)->send(new StudentAccountMail($teacher->email, $password));

        return response()->json([
            'teacher' => $teacher->load('subjects'),
            'generated_password' => $password
        ], 201);
    }

    public function show(Teacher $teacher)
    {
        return $teacher->load('subjects');
    }

    public function update(Request $request, Teacher $teacher)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|email|unique:teachers,email,' . $teacher->id,
            'phone'      => 'required|string|max:20',
            'subjects'   => 'required|array|min:1'
        ]);

        $teacher->update([
            'first_name' => $validated['first_name'],
            'last_name'  => $validated['last_name'],
            'email'      => $validated['email'],
            'phone'      => $validated['phone'],
        ]);

        $teacher->subjects()->sync($validated['subjects']);

        return response()->json($teacher->load('subjects'));
    }

    public function destroy(Teacher $teacher)
    {
        $teacher->subjects()->detach();
        User::where('email', $teacher->email)->delete();
        $teacher->delete();
        return response()->json(['message' => 'Supprimé']);
    }
}






