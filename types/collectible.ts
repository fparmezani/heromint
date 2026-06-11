export type PackageType = "individual" | "premium" | "completo" | "futebol-familia";

export interface CollectibleFormData {
  theme: string;
  packageType: PackageType;
  formData: Record<string, string>;
  uploadedImageUrl?: string;
}

export interface Collectible {
  id: string;
  theme: string;
  status: string;
  packageType: string;
  formData: Record<string, unknown>;
  uploadedImageUrl?: string | null;
  watermarkedImageUrl?: string | null;
  cleanImageUrl?: string | null;
  promptUsed?: string | null;
  isPaid: boolean;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date | null;
}

export const PACKAGE_CONFIG: Record<PackageType, { label: string; price: number; originalPrice?: number; description: string; versions: number }> = {
  individual: {
    label: "Card Individual",
    price: 594,
    originalPrice: 990,
    description: "1 imagem em alta resolução",
    versions: 1,
  },
  premium: {
    label: "Pack Premium",
    price: 1194,
    originalPrice: 1990,
    description: "5 versões diferentes",
    versions: 5,
  },
  completo: {
    label: "Pack Completo",
    price: 2990,
    description: "10 versões diferentes",
    versions: 10,
  },
  "futebol-familia": {
    label: "Futebol Família",
    price: 2490,
    description: "1 imagem LANDSCAPE com toda a família no campo",
    versions: 1,
  },
};

export const AVAILABLE_PACKAGE_IDS = ["individual", "premium"] as const;

export function isPackageAvailable(packageType: string): packageType is typeof AVAILABLE_PACKAGE_IDS[number] {
  return AVAILABLE_PACKAGE_IDS.includes(packageType as typeof AVAILABLE_PACKAGE_IDS[number]);
}
