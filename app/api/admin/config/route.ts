import { NextRequest, NextResponse } from "next/server";
import { getAppConfig, updateAppConfig } from "@/lib/config";

// GET - Obter configurações atuais
export async function GET() {
  try {
    const config = await getAppConfig();
    
    return NextResponse.json({
      success: true,
      config,
    });
  } catch (error) {
    console.error('❌ [CONFIG API] Erro ao obter configurações:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao carregar configurações' 
      },
      { status: 500 }
    );
  }
}

// POST - Atualizar configurações
export async function POST(request: NextRequest) {
  try {
    const { config } = await request.json();
    
    if (!config) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Configuração não fornecida' 
        },
        { status: 400 }
      );
    }

    config.aiProvider = 'replicate';

    // Validar configurações
    if (config.aiProvider && config.aiProvider !== 'replicate') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Provedor de IA inválido' 
        },
        { status: 400 }
      );
    }

    if (config.defaultImageCount && (config.defaultImageCount < 1 || config.defaultImageCount > 10)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Número padrão de imagens deve estar entre 1 e 10' 
        },
        { status: 400 }
      );
    }

    if (config.maxImageCount && (config.maxImageCount < 1 || config.maxImageCount > 20)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Número máximo de imagens deve estar entre 1 e 20' 
        },
        { status: 400 }
      );
    }

    await updateAppConfig(config);
    
    console.log('✅ [CONFIG API] Configurações atualizadas:', config);
    
    return NextResponse.json({
      success: true,
      message: 'Configurações atualizadas com sucesso',
    });
  } catch (error) {
    console.error('❌ [CONFIG API] Erro ao atualizar configurações:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao salvar configurações' 
      },
      { status: 500 }
    );
  }
}
