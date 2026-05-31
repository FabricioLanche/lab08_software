export interface EmailTemplateData {
  cardNumber: string;
  email: string;
  dinnerId: string;
  rewardType: string;
  rewardValue: number;
  message: string;
}

export function buildEmailHtml(data: EmailTemplateData): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background: #f4f4f8; }
    .container { max-width: 600px; margin: 24px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #6a11cb, #2575fc); padding: 32px; text-align: center; }
    .header h1 { color: #fff; margin: 0; font-size: 22px; font-weight: 600; }
    .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px; }
    .body { padding: 32px; }
    .detail { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
    .detail:last-child { border-bottom: none; }
    .label { color: #666; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
    .value { color: #222; font-size: 15px; font-weight: 500; }
    .reward-badge { display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; }
    .reward-POINTS { background: #e8f5e9; color: #2e7d32; }
    .reward-CASHBACK { background: #fff3e0; color: #e65100; }
    .footer { background: #fafafa; padding: 20px 32px; text-align: center; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 ¡Recompensa Recibida!</h1>
      <p>Gracias por preferirnos</p>
    </div>
    <div class="body">
      <div class="detail">
        <span class="label">Tarjeta</span>
        <span class="value">${data.cardNumber}</span>
      </div>
      <div class="detail">
        <span class="label">Email</span>
        <span class="value">${data.email}</span>
      </div>
      <div class="detail">
        <span class="label">Cena</span>
        <span class="value">${data.dinnerId}</span>
      </div>
      <div class="detail">
        <span class="label">Recompensa</span>
        <span class="value"><span class="reward-badge reward-${data.rewardType}">${data.rewardValue} ${data.rewardType}</span></span>
      </div>
      <div class="detail" style="border-bottom: none;">
        <span class="label">Mensaje</span>
        <span class="value">${data.message}</span>
      </div>
    </div>
    <div class="footer">
      Sistema de Recompensas — Este es un correo informativo
    </div>
  </div>
</body>
</html>`.trim();
}
