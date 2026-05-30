// Utilitários para detecção de ambiente

export function isSandboxEnvironment(): boolean {
  return process.env.ASAAS_ENVIRONMENT === 'sandbox' || 
         process.env.NODE_ENV === 'development';
}

export function isProductionEnvironment(): boolean {
  return process.env.ASAAS_ENVIRONMENT === 'production' && 
         process.env.NODE_ENV === 'production';
}

export function shouldBypassWatermark(): boolean {
  // Remove marca d'água em sandbox para testes
  return isSandboxEnvironment();
}

export function getEnvironmentInfo() {
  return {
    isSandbox: isSandboxEnvironment(),
    isProduction: isProductionEnvironment(),
    bypassWatermark: shouldBypassWatermark(),
    asaasEnv: process.env.ASAAS_ENVIRONMENT || 'development',
    nodeEnv: process.env.NODE_ENV || 'development',
  };
}
