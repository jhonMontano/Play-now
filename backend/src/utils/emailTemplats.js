export const sendResetPasswordEmail = (email, resetLink) => ({
  from: process.env.EMAIL_USER,
  to: email,
  subject: "🔐 Recuperación de contraseña - FlashDate",
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; border-radius: 8px; max-width: 500px; margin: auto;">
      <h2 style="color: #333;">Hola 👋</h2>
      <p style="font-size: 16px; color: #555; line-height: 1.5;">
        Recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para continuar.
      </p>
      <a href="${resetLink}" 
        style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
        Restablecer contraseña
      </a>
      <p style="font-size: 14px; color: #777; margin-top: 20px; line-height: 1.5;">
        Este enlace expirará en 1 hora. Si no solicitaste este cambio, puedes ignorar este mensaje.
      </p>
    </div>
  `,
});