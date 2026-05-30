// Sistema de configuração da aplicação
export interface AppConfig {
  aiProvider: 'replicate' | 'openai';
  openaiApiKey?: string;
  replicateApiKey?: string;
  defaultImageCount: number;
  maxImageCount: number;
  enableEmailDelivery: boolean;
  enablePayments: boolean;
}

// Configuração padrão
const defaultConfig: AppConfig = {
  aiProvider: 'replicate', // ← SEMPRE usar Replicate
  defaultImageCount: 1,
  maxImageCount: 10,
  enableEmailDelivery: true,
  enablePayments: true,
};

// Cache da configuração em memória
let configCache: AppConfig | null = null;

// Função para obter configuração atual
export async function getAppConfig(): Promise<AppConfig> {
  if (configCache) {
    return configCache;
  }

  try {
    // Tenta buscar do banco de dados
    const { supabase } = await import('./supabase');
    const { data, error } = await supabase
      .from('app_config')
      .select('*')
      .single();

    if (error || !data) {
      console.log('📝 [CONFIG] Usando configuração padrão');
      configCache = defaultConfig;
      return defaultConfig;
    }

    configCache = {
      ...defaultConfig,
      ...data.config,
    } as AppConfig;

    console.log('✅ [CONFIG] Configuração carregada do banco:', configCache);
    return configCache;
  } catch (error) {
    console.error('❌ [CONFIG] Erro ao carregar configuração:', error);
    return defaultConfig;
  }
}

// Função para atualizar configuração
export async function updateAppConfig(newConfig: Partial<AppConfig>): Promise<void> {
  try {
    const currentConfig = await getAppConfig();
    const updatedConfig = { ...currentConfig, ...newConfig };

    const { supabase } = await import('./supabase');
    const { error } = await supabase
      .from('app_config')
      .upsert({
        id: 'main',
        config: updatedConfig,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;

    // Atualiza o cache
    configCache = updatedConfig;
    console.log('✅ [CONFIG] Configuração atualizada:', updatedConfig);
  } catch (error) {
    console.error('❌ [CONFIG] Erro ao atualizar configuração:', error);
    throw error;
  }
}

// Função para limpar cache (útil para desenvolvimento)
export function clearConfigCache(): void {
  configCache = null;
}
