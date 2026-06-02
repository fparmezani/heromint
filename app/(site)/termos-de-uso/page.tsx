import { LegalPage } from "@/components/legal/LegalPage";

export default function TermsPage() {
  return (
    <LegalPage title="Termos de Uso" updatedAt="2 de junho de 2026">
      <section>
        <h2>1. Aceite</h2>
        <p>
          Ao usar a HeroMint, você concorda com estes termos e com a Política de Privacidade.
          Caso não concorde, não envie fotos nem conclua pedidos.
        </p>
      </section>
      <section>
        <h2>2. Uso permitido</h2>
        <p>
          O usuário deve enviar somente imagens que possa utilizar legalmente. É proibido enviar
          conteúdo ilícito, ofensivo, fraudulento ou que viole direitos de terceiros.
        </p>
      </section>
      <section>
        <h2>3. Autorização de imagem</h2>
        <p>
          O usuário declara ter autorização para transformar as fotos enviadas. No caso de crianças
          ou adolescentes, o envio deve ser realizado ou autorizado pelo responsável legal.
        </p>
      </section>
      <section>
        <h2>4. Produto digital</h2>
        <p>
          As imagens são geradas com inteligência artificial e podem apresentar variações artísticas.
          A prévia serve para avaliação antes da compra. A entrega final ocorre conforme o pacote adquirido.
        </p>
      </section>
      <section>
        <h2>5. Marcas e responsabilidade</h2>
        <p>
          A HeroMint não é afiliada a clubes, federações ou marcas esportivas. O usuário não deve usar
          os materiais para enganar terceiros, falsificar documentos ou violar direitos de propriedade
          intelectual.
        </p>
      </section>
      <section>
        <h2>6. Suporte</h2>
        <p>
          Para dúvidas, fale com <a href="mailto:suporte@heromint.net">suporte@heromint.net</a>.
        </p>
      </section>
    </LegalPage>
  );
}

