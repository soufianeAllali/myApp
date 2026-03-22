<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Mail\StudentAccountMail;    
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Mail;
use App\Mail\BirthdayMail;

class StudentController extends Controller
{
    public function index()
    {
        return Student::with('class')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|email|unique:students,email',
            'phone'      => 'required|string|max:20',
            'class_id'   => 'required|exists:classes,id'
        ]);

        $password = 'student_' . Str::random(10);

        $student = Student::create([
            'first_name'     => $validated['first_name'],
            'last_name'      => $validated['last_name'],
            'email'          => $validated['email'],
            'phone'          => $validated['phone'],
            'plain_password' => Crypt::encryptString($password),
            'class_id'       => $validated['class_id'],
        ]);


        User::create([
            'email'      => $student->email,
            'password'   => Hash::make($password),
            'role'       => 'student',
            'student_id' => $student->id
        ]);

        Mail::to($student->email)->send(new StudentAccountMail($student->email, $password));

        return response()->json($student->load('class'), 201);
    }

    public function show(Student $student)
    {
        return $student->load('class');
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|email|unique:students,email,' . $student->id,
            'phone'      => 'required|string|max:20',
            'class_id'   => 'required|exists:classes,id'
        ]);

        $student->update($validated);

        return response()->json($student->load('class'));
    }

    public function destroy(Student $student)
    {
        User::where('email', $student->email)->delete();
        $student->delete();

        return response()->json(['message' => 'Deleted']);
    }

    public function sendBirthdayGreetings()
    {
        $today = date('m-d'); 
        $students = Student::whereRaw("DATE_FORMAT(birthDate, '%m-%d') = ?", [$today])->get();

        foreach ($students as $student) {
            Mail::to($student->email)->send(new BirthdayMail($student));
        }

        return response()->json(['message' => 'Birthday emails sent', 'count' => $students->count()]);
    }
}