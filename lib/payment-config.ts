import type { PackageType } from "@/types/collectible";

// Configuração dos links de pagamento do Asaas
export const PAYMENT_LINKS: Record<PackageType, string> = {
  individual: "https://www.asaas.com/c/60vtiurluc6gmh3w",
  premium: "https://www.asaas.com/c/1gg8ttm0exyb26w3",
  completo: "https://www.asaas.com/c/completo-10-images", // TODO: Criar link para 10 imagens
};

// Função para obter o link de pagamento
export function getPaymentLink(packageType: PackageType): string {
  return PAYMENT_LINKS[packageType];
}

// Função para verificar se o link de pagamento está disponível
export function hasPaymentLink(packageType: PackageType): boolean {
  const link = PAYMENT_LINKS[packageType];
  return Boolean(link && !link.includes("TODO"));
}
