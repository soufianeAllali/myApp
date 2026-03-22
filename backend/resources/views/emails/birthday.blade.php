<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Joyeux anniversaire !</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f6f8;
            margin: 0;
            padding: 0;
            color: #333333;
        }
        .email-container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            text-align: center;
        }
        .header {
            background-color: #4F46E5;
            color: #ffffff;
            padding: 30px 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
        }
        .body {
            padding: 30px 25px;
        }
        .body h2 {
            color: #FF6F61;
            font-size: 24px;
            margin: 0 0 20px 0;
        }
        .body p {
            font-size: 16px;
            line-height: 1.6;
        }
        .footer {
            background-color: #f0f0f5;
            padding: 15px;
            font-size: 12px;
            color: #777777;
        }
        .birthday-image {
            margin: 20px 0;
            width: 150px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>🎉 Joyeux anniversaire de la part de Tiko School ! 🎉</h1>
        </div>

        <div class="body">
            <h2>Cher(e) {{ $name ?? 'Élève' }},</h2>
            <p>
                Nous vous souhaitons une journée pleine de bonheur, de rires et de souvenirs inoubliables !  
                Que votre année à venir soit pleine de succès et de joie. 🌟
            </p>
            <p>
                De la part de nous tous à <strong>Tiko School</strong>, Joyeux Anniversaire ! 🥳
            </p>
        </div>
    </div>
</body>
</html>