// Environment helpers used by both server and browser code.

export function isSandboxEnvironment(): boolean {
  const configuredEnvironment =
    process.env.NEXT_PUBLIC_ASAAS_ENVIRONMENT ||
    process.env.ASAAS_ENVIRONMENT;

  if (configuredEnvironment) {
    return configuredEnvironment === "sandbox";
  }

  return process.env.NODE_ENV === "development";
}

export function isProductionEnvironment(): boolean {
  return !isSandboxEnvironment();
}

export function shouldBypassWatermark(): boolean {
  const configuredBypass = process.env.NEXT_PUBLIC_BYPASS_WATERMARK;

  if (configuredBypass) {
    return configuredBypass === "true";
  }

  return isSandboxEnvironment();
}

export function getEnvironmentInfo() {
  return {
    isSandbox: isSandboxEnvironment(),
    isProduction: isProductionEnvironment(),
    bypassWatermark: shouldBypassWatermark(),
    asaasEnv:
      process.env.NEXT_PUBLIC_ASAAS_ENVIRONMENT ||
      process.env.ASAAS_ENVIRONMENT ||
      "development",
    nodeEnv: process.env.NODE_ENV || "development",
  };
}
