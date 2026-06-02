import { LegalPage } from "@/components/legal/LegalPage";

export default function RefundPolicyPage() {
  return (
    <LegalPage title="Política de Reembolso" updatedAt="2 de junho de 2026">
      <section>
        <h2>1. Produto digital personalizado</h2>
        <p>
          A HeroMint fornece imagens digitais personalizadas geradas com base nas fotos e informações
          enviadas pelo usuário. Antes do pagamento, disponibilizamos uma prévia protegida para avaliação.
        </p>
      </section>
      <section>
        <h2>2. Solicitações</h2>
        <p>
          Se houver falha técnica, cobrança indevida ou indisponibilidade da entrega, envie o número
          do pedido e o e-mail utilizado na compra para{" "}
          <a href="mailto:suporte@heromint.net">suporte@heromint.net</a>. Analisaremos cada caso e
          aplicaremos os direitos previstos na legislação brasileira.
        </p>
      </section>
      <section>
        <h2>3. Prazo de atendimento</h2>
        <p>
          Responderemos à solicitação em até 5 dias úteis. Quando aprovado, o prazo bancário para
          visualização do estorno depende do meio de pagamento e da instituição financeira.
        </p>
      </section>
    </LegalPage>
  );
}

