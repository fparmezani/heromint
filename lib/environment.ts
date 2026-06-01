// Environment helpers used by both server and browser code.

export function isSandboxEnvironment(): boolean {
  const configuredEnvironment =
    process.env.NEXT_PUBLIC_PAYMENT_ENVIRONMENT ||
    process.env.PAYMENT_ENVIRONMENT;

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
    paymentEnv:
      process.env.NEXT_PUBLIC_PAYMENT_ENVIRONMENT ||
      process.env.PAYMENT_ENVIRONMENT ||
      "development",
    nodeEnv: process.env.NODE_ENV || "development",
  };
}
