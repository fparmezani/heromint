import { google } from "googleapis";

interface UploadImageParams {
  imageBuffer: Buffer;
  fileName: string;
  mimeType: string;
  accessToken: string;
  userEmail: string;
}

interface UploadResult {
  fileId: string;
  webViewLink: string;
  webContentLink: string;
  fileName: string;
}

// Configura o cliente Google Drive
function getDriveClient(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  
  return google.drive({ version: "v3", auth });
}

// Faz upload de uma imagem para o Google Drive do usuário
export async function uploadImageToDrive({
  imageBuffer,
  fileName,
  mimeType,
  accessToken,
  userEmail,
}: UploadImageParams): Promise<UploadResult> {
  try {
    const drive = getDriveClient(accessToken);

    // Cria pasta HeroMint se não existir
    const folderId = await getOrCreateHeroMintFolder(drive, userEmail);

    // Upload da imagem
    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [folderId],
        description: `Card gerado pelo HeroMint para ${userEmail}`,
      },
      media: {
        mimeType,
        body: imageBuffer,
      },
      fields: "id,webViewLink,webContentLink,name",
    });

    const file = response.data;
    
    if (!file.id) {
      throw new Error("Falha ao fazer upload da imagem");
    }

    // Torna o arquivo público para visualização
    await drive.permissions.create({
      fileId: file.id,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    return {
      fileId: file.id,
      webViewLink: file.webViewLink || "",
      webContentLink: file.webContentLink || "",
      fileName: file.name || fileName,
    };
  } catch (error) {
    console.error("Erro ao fazer upload para Google Drive:", error);
    throw new Error("Falha no upload para Google Drive");
  }
}

// Cria ou encontra a pasta HeroMint no Drive do usuário
async function getOrCreateHeroMintFolder(drive: any, userEmail: string): Promise<string> {
  try {
    // Procura pasta existente
    const searchResponse = await drive.files.list({
      q: "name='HeroMint Cards' and mimeType='application/vnd.google-apps.folder' and trashed=false",
      fields: "files(id,name)",
    });

    if (searchResponse.data.files && searchResponse.data.files.length > 0) {
      return searchResponse.data.files[0].id;
    }

    // Cria nova pasta
    const createResponse = await drive.files.create({
      requestBody: {
        name: "HeroMint Cards",
        mimeType: "application/vnd.google-apps.folder",
        description: `Cards épicos gerados pelo HeroMint para ${userEmail}`,
      },
      fields: "id",
    });

    return createResponse.data.id;
  } catch (error) {
    console.error("Erro ao criar pasta no Google Drive:", error);
    throw new Error("Falha ao criar pasta no Google Drive");
  }
}

// Faz upload de múltiplas imagens
export async function uploadMultipleImages({
  images,
  accessToken,
  userEmail,
  collectibleId,
  themeName,
}: {
  images: Array<{ buffer: Buffer; templateUsed: string; index: number }>;
  accessToken: string;
  userEmail: string;
  collectibleId: string;
  themeName: string;
}): Promise<UploadResult[]> {
  const uploadPromises = images.map(async (image, index) => {
    const fileName = `${themeName}_${collectibleId}_v${index + 1}_${image.templateUsed}.png`;
    
    return uploadImageToDrive({
      imageBuffer: image.buffer,
      fileName,
      mimeType: "image/png",
      accessToken,
      userEmail,
    });
  });

  return Promise.all(uploadPromises);
}

// Converte URL de imagem para Buffer
export async function downloadImageAsBuffer(imageUrl: string): Promise<Buffer> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error("Erro ao baixar imagem:", error);
    throw new Error("Falha ao baixar imagem");
  }
}
