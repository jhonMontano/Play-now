export const sendResetPasswordEmail = (email, resetLink) => ({
  from: process.env.EMAIL_USER,
  to: email,
  subject: "🔐 Recuperación de contraseña - PlayNow",
  html: `
    <div style="
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
      padding:40px 20px;
      background:linear-gradient(135deg,#16a34a 0%,#052e16 100%);
      border-radius:16px;
    ">

      <div style="
        background:#07110d;
        padding:40px;
        border-radius:22px;
        box-shadow:0 20px 45px rgba(0,0,0,.35);
        border:1px solid rgba(34,197,94,0.15);
        max-width:520px;
        margin:auto;
      ">
        
        <!-- ICON -->
        <div style="text-align:center;margin-bottom:30px;">
          <div style="
            width:88px;
            height:88px;
            background:linear-gradient(135deg,#22c55e 0%,#166534 100%);
            border-radius:50%;
            margin:0 auto;
            display:flex;
            align-items:center;
            justify-content:center;
            border:3px solid rgba(255,255,255,0.08);
            box-shadow:0 10px 25px rgba(34,197,94,.25);
          ">
            <span style="
              font-size:38px;
              color:white;
            ">
              🔐
            </span>
          </div>
        </div>
        
        <!-- TITLE -->
        <h2 style="
          color:#ffffff;
          margin:0 0 12px;
          font-size:30px;
          text-align:center;
          font-weight:800;
          line-height:1.2;
        ">
          ¿Olvidaste tu contraseña?
        </h2>
        
        <!-- MESSAGE -->
        <div style="
          background:#0b1411;
          border-radius:16px;
          padding:22px;
          margin:24px 0;
          border:1px solid rgba(255,255,255,0.06);
        ">
          <p style="
            color:#d1fae5;
            font-size:16px;
            line-height:1.8;
            text-align:center;
            margin:0;
          ">
            Recibimos una solicitud para restablecer tu contraseña.
            Haz clic en el botón de abajo para continuar con el proceso.
          </p>
        </div>
        
        <!-- BUTTON -->
        <a 
          href="${resetLink}" 
          style="
            display:block;
            width:250px;
            margin:32px auto 26px;
            padding:15px 0;
            background:#22c55e;
            color:#02120a;
            text-align:center;
            text-decoration:none;
            border-radius:12px;
            font-weight:800;
            font-size:16px;
            letter-spacing:.3px;
            box-shadow:0 10px 20px rgba(34,197,94,.2);
          "
        >
          Restablecer contraseña
        </a>
        
        <!-- INFO -->
        <div style="
          background:#0b1411;
          border-radius:16px;
          padding:18px;
          margin:20px 0;
          border:1px solid rgba(255,255,255,0.06);
        ">
          <p style="
            color:#86efac;
            margin:0 0 10px;
            font-size:14px;
            text-align:center;
            line-height:1.7;
          ">
            ⏰ Este enlace expirará en <strong>1 hora</strong>
          </p>

          <p style="
            color:#94a3b8;
            margin:0;
            font-size:14px;
            text-align:center;
            line-height:1.7;
          ">
            Si no solicitaste este cambio, puedes ignorar este mensaje.
          </p>
        </div>
        
        <!-- FOOTER -->
        <div style="
          text-align:center;
          margin-top:28px;
          padding-top:22px;
          border-top:1px solid rgba(255,255,255,0.06);
        ">
          <div style="
            margin-top:15px;
            padding:12px;
            background:rgba(34,197,94,0.08);
            border-radius:10px;
            border:1px solid rgba(34,197,94,0.18);
          ">
            <p style="
              color:#86efac;
              font-size:12px;
              margin:0;
              letter-spacing:.3px;
            ">
              🔒 Plataforma segura de autenticación
            </p>
          </div>
        </div>

      </div>
    </div>
  `,
});
