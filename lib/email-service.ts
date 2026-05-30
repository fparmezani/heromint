// Serviço de email simplificado usando Resend ou Nodemailer

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

// Usando Resend (recomendado - mais simples)
export async function sendEmailWithResend({
  to,
  subject,
  html,
  attachments = [],
}: EmailParams) {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'HeroMint <noreply@heromint.com>', // Configure seu domínio
        to: [to],
        subject,
        html,
        attachments: attachments.map(att => ({
          filename: att.filename,
          content: att.content.toString('base64'),
          type: att.contentType,
        })),
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro no Resend: ${response.status}`);
    }

    const result = await response.json();
    return { success: true, messageId: result.id };
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw error;
  }
}

// Alternativa com Nodemailer (mais configuração)
export async function sendEmailWithNodemailer({
  to,
  subject,
  html,
  attachments = [],
}: EmailParams) {
  // Implementação com Nodemailer se preferir
  // Requer mais configuração de SMTP
  throw new Error('Nodemailer não implementado - use Resend');
}

// Função principal de envio
export async function sendEmail(params: EmailParams) {
  if (process.env.RESEND_API_KEY) {
    return sendEmailWithResend(params);
  } else {
    throw new Error('Configure RESEND_API_KEY no .env.local');
  }
}

// Template de email para entrega de imagens
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
      <title>Suas imagens HeroMint estão prontas!</title>
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
          <h1>🎉 Suas imagens estão prontas!</h1>
          <p>HEROMINT - Transforme sua foto em uma lenda</p>
        </div>
        
        <div class="content">
          <h2>Olá, ${userName}!</h2>
          
          <p>Suas imagens épicas no estilo <strong>${themeName}</strong> foram geradas com sucesso!</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>📦 Detalhes do seu pedido:</h3>
            <ul>
              <li><strong>Tema:</strong> ${themeName}</li>
              <li><strong>Pacote:</strong> ${packageType}</li>
              <li><strong>Total de imagens:</strong> ${totalImages}</li>
              <li><strong>Qualidade:</strong> Alta resolução (sem marca d'água)</li>
            </ul>
          </div>
          
          ${downloadUrl ? `
            <div style="text-align: center;">
              <a href="${downloadUrl}" class="button">📥 Baixar Minhas Imagens</a>
            </div>
          ` : ''}
          
          <p><strong>Suas imagens estão anexadas neste email!</strong> 📎</p>
          
          <p>Obrigado por escolher o HeroMint! Esperamos que você ame suas novas imagens épicas.</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          
          <p><strong>💡 Dica:</strong> Compartilhe suas imagens nas redes sociais e marque @heromint!</p>
        </div>
        
        <div class="footer">
          <p>© 2026 HeroMint - Transformando fotos em lendas</p>
          <p>Se você não solicitou essas imagens, pode ignorar este email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
