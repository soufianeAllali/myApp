<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Models\Student;

class BirthdayMail extends Mailable
{
    use Queueable, SerializesModels;

    public $student;

    /**
     * Create a new message instance.
     */
    public function __construct(Student $student)
    {
        $this->student = $student;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('🎉 Joyeux anniversaire !')
                    ->view('emails.birthday')
                    ->with([
                        'name' => $this->student->first_name,
                    ]);
    }
}