export const sendContactFormEmailTemplate = ({ nombre, email, tipo, mensaje, }) => ({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_ADMIN || process.env.EMAIL_USER,
    subject: `📩 Nuevo contacto PlayNow - ${tipo}`,
    replyTo: email,

    html: `
  <div style="
    margin:0;
    padding:40px 20px;
    background-color:#020617;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
    color:#ffffff;
  ">
    
    <div style="
      max-width:700px;
      margin:auto;
      background:#07110d;
      border:1px solid rgba(34,197,94,0.15);
      border-radius:24px;
      overflow:hidden;
      box-shadow:0 0 40px rgba(34,197,94,0.08);
    ">

      <!-- HEADER -->
      <div style="
        background:
          linear-gradient(
            135deg,
            #16a34a 0%,
            #22c55e 50%,
            #15803d 100%
          );
        padding:40px 30px;
        text-align:center;
      ">
        <div style="
          display:inline-block;
          padding:8px 16px;
          border-radius:999px;
          background:rgba(255,255,255,0.12);
          color:#dcfce7;
          font-size:13px;
          font-weight:600;
          margin-bottom:18px;
        ">
          ⚽ PLAYNOW CONTACTO
        </div>

        <h1 style="
          margin:0;
          font-size:34px;
          line-height:1.2;
          color:white;
          font-weight:800;
        ">
          Nuevo mensaje recibido
        </h1>

        <p style="
          margin:14px 0 0;
          color:#ecfdf5;
          font-size:16px;
          line-height:1.6;
        ">
          Un usuario se contactó desde la plataforma PlayNow.
        </p>
      </div>

      <!-- CONTENT -->
      <div style="padding:35px 30px;">

        <div style="
          background:#0b1411;
          border:1px solid rgba(255,255,255,0.06);
          border-radius:18px;
          overflow:hidden;
        ">

          <!-- ROW -->
          <div style="
            display:flex;
            border-bottom:1px solid rgba(255,255,255,0.06);
          ">
            <div style="
              width:180px;
              padding:18px;
              background:#0f1f18;
              color:#22c55e;
              font-weight:700;
              font-size:14px;
            ">
              👤 Nombre
            </div>

            <div style="
              flex:1;
              padding:18px;
              color:#f8fafc;
              font-size:15px;
            ">
              ${nombre}
            </div>
          </div>

          <!-- ROW -->
          <div style="
            display:flex;
            border-bottom:1px solid rgba(255,255,255,0.06);
          ">
            <div style="
              width:180px;
              padding:18px;
              background:#0f1f18;
              color:#22c55e;
              font-weight:700;
              font-size:14px;
            ">
              📧 Email
            </div>

            <div style="
              flex:1;
              padding:18px;
              color:#f8fafc;
              font-size:15px;
            ">
              ${email}
            </div>
          </div>

          <!-- ROW -->
          <div style="
            display:flex;
          ">
            <div style="
              width:180px;
              padding:18px;
              background:#0f1f18;
              color:#22c55e;
              font-weight:700;
              font-size:14px;
            ">
              🏟️ Tipo
            </div>

            <div style="
              flex:1;
              padding:18px;
            ">
              <span style="
                display:inline-block;
                padding:8px 14px;
                background:rgba(34,197,94,0.12);
                color:#4ade80;
                border:1px solid rgba(34,197,94,0.25);
                border-radius:999px;
                font-size:13px;
                font-weight:700;
              ">
                ${tipo}
              </span>
            </div>
          </div>

        </div>

        <!-- MESSAGE -->
        <div style="
          margin-top:28px;
          background:#0b1411;
          border:1px solid rgba(255,255,255,0.06);
          border-radius:18px;
          padding:24px;
        ">
          <div style="
            color:#22c55e;
            font-size:14px;
            font-weight:700;
            margin-bottom:14px;
            text-transform:uppercase;
            letter-spacing:1px;
          ">
            💬 Mensaje
          </div>

          <p style="
            margin:0;
            color:#e5e7eb;
            font-size:16px;
            line-height:1.8;
          ">
            ${mensaje.replace(/\n/g, "<br />")}
          </p>
        </div>

        <!-- CTA -->
        <div style="
          margin-top:30px;
          text-align:center;
        ">
          <a 
            href="mailto:${email}" 
            style="
              display:inline-block;
              background:#22c55e;
              color:#02120a;
              text-decoration:none;
              padding:14px 28px;
              border-radius:14px;
              font-weight:800;
              font-size:15px;
            "
          >
            Responder al usuario
          </a>
        </div>

      </div>

      <!-- FOOTER -->
      <div style="
        border-top:1px solid rgba(255,255,255,0.06);
        background:#050b08;
        padding:24px;
        text-align:center;
      ">
        <p style="
          margin:0;
          color:#94a3b8;
          font-size:13px;
          line-height:1.7;
        ">
          © 2026 PlayNow · Plataforma de reservas deportivas
        </p>

        <p style="
          margin:8px 0 0;
          color:#64748b;
          font-size:12px;
        ">
          Este correo fue generado automáticamente desde el formulario de contacto.
        </p>
      </div>

    </div>
  </div>
  `,
});
