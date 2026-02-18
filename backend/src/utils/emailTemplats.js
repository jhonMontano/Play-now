export const sendResetPasswordEmail = (email, resetLink) => ({
  from: process.env.EMAIL_USER,
  to: email,
  subject: "🔐 Recuperación de contraseña - FlashDate",
  html: `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px 20px; background: linear-gradient(135deg, #14532d 0%, #166534 100%); border-radius: 16px; max-width: 500px; margin: auto;">
      <div style="background: white; padding: 40px; border-radius: 12px; box-shadow: 0 20px 40px rgba(20,83,45,0.15); border: 1px solid #f0fdf4;">
        <!-- Logo o ícono con borde verde suave -->
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #166534 0%, #14532d 100%); border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center; border: 3px solid #f0fdf4; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
            <span style="font-size: 36px; color: white;">🔐</span>
          </div>
        </div>
        <!-- Título -->
        <h2 style="color: #14532d; margin: 0 0 10px; font-size: 26px; text-align: center; font-weight: 600;">
          ¿Olvidaste tu contraseña?
        </h2>
        <!-- Mensaje con borde verde suave -->
        <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #bbf7d0;">
          <p style="color: #166534; font-size: 16px; line-height: 1.6; text-align: center; margin: 0;">
            Recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para continuar con el proceso.
          </p>
        </div>
        <!-- Botón principal (verde oscuro) -->
        <a href="${resetLink}" 
          style="display: block; width: 240px; margin: 30px auto 25px; padding: 14px 0; background: #166534; color: white; text-align: center; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; letter-spacing: 0.3px; box-shadow: 0 4px 10px rgba(22,101,52,0.2); border: 1px solid #f0fdf4; transition: background 0.2s;">
          Restablecer contraseña
        </a>
        <!-- Información adicional con bordes verdes -->
        <div style="background: #f0fdf4; border-radius: 8px; padding: 16px; margin: 20px 0; border: 1px solid #bbf7d0;">
          <p style="color: #2b9453; margin: 0 0 8px; font-size: 14px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 5px;">
            <span style="font-size: 18px;">⏰</span> 
            <span>Este enlace expirará en <strong>1 hora</strong></span>
          </p>
          <p style="color: #4b7b5c; margin: 0; font-size: 14px; text-align: center;">
            Si no solicitaste este cambio, puedes ignorar este mensaje.
          </p>
        </div>
        <!-- Enlaces secundarios con bordes verdes -->
        <div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 2px solid #f0fdf4;">
          <div style="margin-top: 15px; padding: 10px; background: #f0fdf4; border-radius: 6px; border: 1px solid #bbf7d0;">
            <p style="color: #2b9453; font-size: 12px; margin: 0;">
              🔒 Plataforma segura de autenticación
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
});