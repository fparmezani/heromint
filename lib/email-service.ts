interface EmailParams {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}

export async function sendEmailWithResend({
  to,
  subject,
  html,
  attachments = [],
}: EmailParams) {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "HeroMint <suporte@heromint.net>",
        to: [to],
        subject,
        html,
        attachments: attachments.map((attachment) => ({
          filename: attachment.filename,
          content: attachment.content.toString("base64"),
          type: attachment.contentType,
        })),
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Erro no Resend: ${response.status} ${errorBody}`);
    }

    const result = await response.json();
    return { success: true, messageId: result.id as string };
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    throw error;
  }
}

export async function sendEmailWithNodemailer(): Promise<never> {
  throw new Error("Nodemailer nao implementado - use Resend");
}

export async function sendEmail(params: EmailParams) {
  if (process.env.RESEND_API_KEY) {
    return sendEmailWithResend(params);
  }

  throw new Error("Configure RESEND_API_KEY no ambiente");
}

export function createDeliveryEmailTemplate({
  userName,
  themeName,
  packageType,
  totalImages,
  downloadUrl,
}: {
  userName: string;
  themeName: string;
  packageType: string;
  totalImages: number;
  downloadUrl?: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Suas imagens HeroMint estao prontas!</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #7C3AED, #2563EB); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #2563EB; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Suas imagens estao prontas!</h1>
          <p>HEROMINT - Transforme sua foto em uma lenda</p>
        </div>
        <div class="content">
          <h2>Ola, ${userName}!</h2>
          <p>Suas imagens no estilo <strong>${themeName}</strong> foram geradas com sucesso.</p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Detalhes do seu pedido:</h3>
            <ul>
              <li><strong>Tema:</strong> ${themeName}</li>
              <li><strong>Pacote:</strong> ${packageType}</li>
              <li><strong>Total de imagens:</strong> ${totalImages}</li>
              <li><strong>Qualidade:</strong> Alta resolucao sem marca d'agua</li>
            </ul>
          </div>
          ${downloadUrl ? `
            <div style="text-align: center;">
              <a href="${downloadUrl}" class="button">Baixar Minhas Imagens</a>
            </div>
          ` : ""}
          <p>Obrigado por escolher o HeroMint. Esperamos que voce ame suas novas imagens.</p>
        </div>
        <div class="footer">
          <p>HeroMint - Transformando fotos em lendas</p>
          <p>Se voce nao solicitou essas imagens, pode ignorar este email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function createRecoveryEmailTemplate({
  userName,
  recoveryUrl,
  coupon = "AMIGO40",
}: {
  userName: string;
  recoveryUrl: string;
  coupon?: string;
}) {
  const displayName = userName?.trim() || "tudo bem";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Seu card HeroMint ficou quase pronto</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; background: #f8fafc; margin: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 24px; }
        .header { background: #0f172a; color: white; padding: 28px; text-align: center; border-radius: 12px 12px 0 0; }
        .content { background: white; padding: 28px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: 0; }
        .coupon { display: inline-block; background: #fbbf24; color: #0f172a; padding: 8px 14px; border-radius: 999px; font-weight: 800; letter-spacing: 1px; }
        .button { display: inline-block; background: #2563eb; color: white !important; padding: 14px 24px; text-decoration: none; border-radius: 10px; font-weight: bold; margin: 18px 0; }
        .footer { color: #64748b; font-size: 13px; margin-top: 24px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">HeroMint</h1>
          <p style="margin: 8px 0 0;">Seu card ficou quase pronto</p>
        </div>
        <div class="content">
          <p>Oi, ${displayName}?</p>
          <p>Vimos que voce comecou a criar seu card na HeroMint, mas nao finalizou a compra.</p>
          <p>Teve algum problema no processo? Sem pressa: voce pode voltar ao site, fazer sua imagem novamente e ganhar <strong>40% de desconto</strong> na primeira compra.</p>
          <p><span class="coupon">${coupon}</span></p>
          <p>O botao abaixo ja leva voce com o cupom <strong>${coupon}</strong> preparado para o checkout.</p>
          <p style="text-align: center;">
            <a href="${recoveryUrl}" class="button">Criar meu card com desconto</a>
          </p>
          <p>Se voce ja concluiu sua compra, pode ignorar este email.</p>
          <p>Abracos,<br>Equipe HeroMint</p>
        </div>
        <div class="footer">
          <p>HeroMint - Transformando fotos em lendas</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
