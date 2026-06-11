import type { PackageType } from "@/types/collectible";
import { isPackageAvailable } from "@/types/collectible";

// Stripe Payment Links for packages currently available for sale.
export const PAYMENT_LINKS: Record<PackageType, string> = {
  individual: "https://buy.stripe.com/5kQ00dceK2V4fYwfXidZ600?prefilled_promo_code=AMIGO40",
  premium: "https://buy.stripe.com/4gM8wJ5QmeDM27GfXidZ602?prefilled_promo_code=AMIGO40",
  completo: "",
  "futebol-familia": "",
};

// Função para obter o link de pagamento
export function getPaymentLink(packageType: PackageType): string {
  return PAYMENT_LINKS[packageType];
}

// Função para verificar se o link de pagamento está disponível
export function hasPaymentLink(packageType: PackageType): boolean {
  if (!isPackageAvailable(packageType)) return false;
  const link = PAYMENT_LINKS[packageType];
  return Boolean(link && !link.includes("TODO"));
}
