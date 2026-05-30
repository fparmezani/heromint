// Geração de imagens usando OpenAI DALL-E 3
// Usando fetch diretamente para evitar dependência adicional

export interface OpenAIImageResult {
  imageUrl: string;
  promptUsed: string;
  isMock: boolean;
  templateUsed?: string;
}

// Função para gerar imagem com OpenAI DALL-E 3
export async function generateImageWithOpenAI(
  prompt: string,
  templateUsed: string = 'unknown'
): Promise<OpenAIImageResult> {
  try {
    // Verificar se a API key está configurada
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY não configurada no .env.local');
    }

    console.log('🎨 [OPENAI] Gerando imagem com DALL-E 3...');
    console.log('📝 [OPENAI] Prompt:', prompt.substring(0, 200) + '...');

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1792", // Formato vertical para cards
        quality: "hd",
        style: "vivid",
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    const imageUrl = data.data[0]?.url;
    
    if (!imageUrl) {
      throw new Error('OpenAI não retornou URL da imagem');
    }

    console.log('✅ [OPENAI] Imagem gerada com sucesso');
    
    return {
      imageUrl,
      promptUsed: prompt,
      isMock: false,
      templateUsed,
    };

  } catch (error: any) {
    console.error('❌ [OPENAI] Erro ao gerar imagem:', error);
    
    // Se der erro, retorna uma imagem mock
    return {
      imageUrl: 'https://via.placeholder.com/1024x1792/7C3AED/FFFFFF?text=OpenAI+Error',
      promptUsed: prompt,
      isMock: true,
      templateUsed,
    };
  }
}

// Função para adaptar prompts para DALL-E 3
export function adaptPromptForDALLE(originalPrompt: string): string {
  // DALL-E 3 tem limitações diferentes do Replicate
  // Vamos simplificar e adaptar o prompt
  
  let adaptedPrompt = originalPrompt;
  
  // Remover instruções muito técnicas que DALL-E pode não entender bem
  adaptedPrompt = adaptedPrompt.replace(/CRITICAL REQUIREMENTS:/g, '');
  adaptedPrompt = adaptedPrompt.replace(/AVOID:/g, 'Do not include:');
  adaptedPrompt = adaptedPrompt.replace(/aspect ratio \d+:\d+/g, '');
  adaptedPrompt = adaptedPrompt.replace(/\(\d+x\d+\)/g, '');
  
  // Simplificar instruções muito específicas
  adaptedPrompt = adaptedPrompt.replace(/- /g, '. ');
  adaptedPrompt = adaptedPrompt.replace(/\n/g, ' ');
  
  // Limitar tamanho do prompt (DALL-E tem limite de caracteres)
  if (adaptedPrompt.length > 1000) {
    adaptedPrompt = adaptedPrompt.substring(0, 1000) + '...';
  }
  
  // Adicionar instruções específicas para DALL-E
  const dalleInstructions = ' Create this as a high-quality, photorealistic image with professional lighting and composition.';
  
  return adaptedPrompt + dalleInstructions;
}
