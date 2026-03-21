<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AccountRequest;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Mail\StudentAccountMail;
use Illuminate\Validation\ValidationException;

class AccountRequestController extends Controller
{
    /**
     * Store a new account request (Public).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name'      => 'required|string|min:2|max:255',
            'last_name'       => 'required|string|min:2|max:255',
            'email'           => 'required|email|unique:students,email|unique:account_requests,email',
            'phone'           => 'required|regex:/^([0-9\s\-\+\(\)]*)$/|min:10',
            'additional_info' => 'nullable|array',
        ]);

        $accountRequest = AccountRequest::create($validated);

        return response()->json([
            'message' => 'Your request has been sent successfully!',
            'data'    => $accountRequest
        ], 201);
    }

    /**
     * List all pending account requests (Admin).
     */
    public function index()
    {
        return AccountRequest::where('status', 'pending')->orderBy('created_at', 'desc')->get();
    }

    /**
     * Approve an account request.
     */
    public function approve(Request $request, $id)
    {
        $accountRequest = AccountRequest::findOrFail($id);

        if ($accountRequest->status !== 'pending') {
            return response()->json(['message' => 'This request has already been processed.'], 400);
        }

        $request->validate([
            'class_id' => 'required|exists:classes,id'
        ]);

        $student = Student::create([
            'first_name' => $accountRequest->first_name,
            'last_name'  => $accountRequest->last_name,
            'email'      => $accountRequest->email,
            'phone'      => $accountRequest->phone,
            'class_id'   => $request->class_id
        ]);

        $password = 'student_' . Str::random(10);
        User::create([
            'email'      => $student->email,
            'password'   => Hash::make($password),
            'role'       => 'student',
            'student_id' => $student->id
        ]);

        $accountRequest->update(['status' => 'approved']);

        try {
            Mail::to($student->email)->send(new StudentAccountMail($student->email, $password));
        } catch (\Exception $e) {
            Log::error("Failed to send welcome email to {$student->email}: " . $e->getMessage());
        }

        return response()->json([
            'message' => 'Request approved and account created successfully!',
            'student' => $student->load('class')
        ]);
    }

    /**
     * Reject an account request.
     */
    public function reject($id)
    {
        $accountRequest = AccountRequest::findOrFail($id);

        try {
            Mail::to($accountRequest->email)->send(new \App\Mail\RejectCountMail($accountRequest->first_name, $accountRequest->last_name));
        } catch (\Exception $e) {
            Log::error("Failed to send rejection email to {$accountRequest->email}: " . $e->getMessage());
        }

        $accountRequest->delete();

        return response()->json(['message' => 'Request rejected.']);
    }
}
