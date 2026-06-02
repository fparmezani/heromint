import { LegalPage } from "@/components/legal/LegalPage";

export default function ContactPage() {
  return (
    <LegalPage title="Contato" updatedAt="2 de junho de 2026">
      <section>
        <h2>Fale com a HeroMint</h2>
        <p>
          Para dúvidas, suporte sobre pedidos, privacidade, exclusão de dados ou reembolsos, envie
          uma mensagem para <a href="mailto:suporte@heromint.net">suporte@heromint.net</a>.
        </p>
      </section>
      <section>
        <h2>Informações úteis</h2>
        <p>
          Ao entrar em contato sobre um pedido, informe o e-mail utilizado na compra e o número do
          pedido exibido na área “Minha Conta”. Isso nos ajuda a responder com mais rapidez.
        </p>
      </section>
    </LegalPage>
  );
}

