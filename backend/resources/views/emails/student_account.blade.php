<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue à Tiko School</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td align="center" style="padding: 40px 0; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);">
                            <div style="font-size: 48px; margin-bottom: 10px;">🎓</div>
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Tiko School</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 24px; font-weight: 700;">Bienvenue à bord ! 🚀</h2>
                            <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #64748b;">
                                Félicitations ! Votre compte est maintenant actif et prêt à être utilisé.
                            </p>
                            
                            <!-- Credentials Card -->
                            <div style="background-color: #f1f5f9; border-radius: 12px; padding: 24px; margin-bottom: 32px; border: 1px solid #e2e8f0;">
                                <h3 style="margin: 0 0 16px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #475569; font-weight: 800;">Vos identifiants de connexion</h3>
                                
                                <div style="margin-bottom: 12px;">
                                    <span style="display: block; font-size: 12px; color: #94a3b8; margin-bottom: 4px;">E-mail</span>
                                    <strong style="font-size: 16px; color: #1e293b;">{{ $email }}</strong>
                                </div>
                                
                                <div>
                                    <span style="display: block; font-size: 12px; color: #94a3b8; margin-bottom: 4px;">Mot de passe temporaire</span>
                                    <strong style="font-size: 16px; color: #1e293b; font-family: monospace; background: #ffffff; padding: 4px 8px; border-radius: 4px; border: 1px dashed #cbd5e1;">{{ $password }}</strong>
                                </div>
                            </div>
                            
                            <p style="margin: 32px 0 0 0; font-size: 14px; line-height: 1.5; color: #94a3b8; text-align: center;">
                                <i style="font-style: italic;">Important : Pour votre sécurité, veuillez changer votre mot de passe lors de votre première connexion.</i>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding: 24px; background-color: #f8fafc; border-top: 1px solid #f1f5f9;">
                            <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                                &copy; {{ date('Y') }} Tiko School. Tous droits réservés.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>