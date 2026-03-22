<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class StudentAccountMail extends Mailable
{
    use Queueable, SerializesModels;

    public $email;
    public $password;

    /**
     * Create a new message instance.
     */
    public function __construct($email, $password)
    {
        $this->email = $email;
        $this->password = $password;
    }

    /**
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Mot de passe de votre compte',
        );
    }

    /**
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.student_account',
            with: [
                'email' => $this->email,
                'password' => $this->password
            ]
        );
    }

    /**
     * attachments
     */
    public function attachments(): array
    {
        return [];
    }
}