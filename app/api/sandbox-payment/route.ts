import { NextRequest, NextResponse } from "next/server";
import { isSandboxEnvironment } from "@/lib/environment";

// Endpoint para simular pagamentos aprovados em sandbox
export async function POST(request: NextRequest) {
  try {
    // Só funciona em ambiente sandbox
    if (!isSandboxEnvironment()) {
      return NextResponse.json(
        { error: "Endpoint disponível apenas em ambiente sandbox" },
        { status: 403 }
      );
    }

    const { collectibleId, packageType } = await request.json();

    if (!collectibleId) {
      return NextResponse.json(
        { error: "collectibleId é obrigatório" },
        { status: 400 }
      );
    }

    // Simular aprovação de pagamento
    const mockPaymentData = {
      id: `sandbox_payment_${Date.now()}`,
      collectibleId,
      packageType,
      status: "approved",
      amount: getPackagePrice(packageType),
      paidAt: new Date().toISOString(),
      paymentMethod: "sandbox_test",
      environment: "sandbox",
    };

    // Aqui você pode salvar no banco de dados se necessário
    // await savePaymentRecord(mockPaymentData);

    return NextResponse.json({
      success: true,
      payment: mockPaymentData,
      message: "Pagamento simulado com sucesso em ambiente sandbox",
      downloadUrl: `/api/download/${collectibleId}?sandbox=true`,
    });

  } catch (error) {
    console.error("Erro na simulação de pagamento:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

function getPackagePrice(packageType: string): number {
  const prices: Record<string, number> = {
    individual: 594, // R$ 5,94 em centavos
    premium: 1194,   // R$ 11,94 em centavos
    completo: 7990,  // R$ 79,90 em centavos
  };
  return prices[packageType] || 594;
}
