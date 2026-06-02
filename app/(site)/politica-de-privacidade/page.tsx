import { LegalPage } from "@/components/legal/LegalPage";

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Política de Privacidade" updatedAt="2 de junho de 2026">
      <section>
        <h2>1. Quem somos</h2>
        <p>
          A HeroMint transforma fotos enviadas pelo usuário em imagens digitais personalizadas
          com apoio de inteligência artificial. Para dúvidas ou solicitações relacionadas à
          privacidade, fale com <a href="mailto:suporte@heromint.net">suporte@heromint.net</a>.
        </p>
      </section>
      <section>
        <h2>2. Dados que tratamos</h2>
        <ul>
          <li>Nome, e-mail e foto de perfil fornecidos durante o login.</li>
          <li>Fotos enviadas para criação dos cards e dados preenchidos no formulário.</li>
          <li>Dados do pedido, status de pagamento e identificadores técnicos da transação.</li>
          <li>Dados de navegação e métricas de uso, quando houver autorização para cookies de análise.</li>
        </ul>
      </section>
      <section>
        <h2>3. Finalidades</h2>
        <p>
          Usamos esses dados para autenticar usuários, gerar e entregar imagens, processar pedidos,
          oferecer suporte, prevenir fraudes, cumprir obrigações legais e melhorar o serviço quando
          o usuário autorizar cookies opcionais.
        </p>
      </section>
      <section>
        <h2>4. Fotos e inteligência artificial</h2>
        <p>
          As fotos são tratadas para gerar o produto solicitado. O usuário declara possuir autorização
          para enviar e transformar as imagens, inclusive autorização do responsável legal quando a
          imagem retratar criança ou adolescente. Fotos não devem ser usadas para identificar pessoas
          biometricamente sem base legal específica.
        </p>
      </section>
      <section>
        <h2>5. Compartilhamento</h2>
        <p>
          Podemos compartilhar dados estritamente necessários com fornecedores de infraestrutura,
          armazenamento, autenticação, geração de imagens, análise autorizada e pagamentos. Esses
          fornecedores tratam os dados conforme suas próprias políticas e os serviços contratados.
        </p>
      </section>
      <section>
        <h2>6. Retenção e segurança</h2>
        <p>
          Mantemos dados pelo período necessário para prestar o serviço, atender solicitações e cumprir
          obrigações legais. Adotamos controles técnicos e organizacionais para reduzir riscos de acesso
          indevido, perda ou alteração. Nenhum ambiente digital é totalmente livre de riscos.
        </p>
      </section>
      <section>
        <h2>7. Seus direitos</h2>
        <p>
          Você pode solicitar confirmação do tratamento, acesso, correção, exclusão quando aplicável,
          informações sobre compartilhamento e revogação de consentimento. Envie sua solicitação para{" "}
          <a href="mailto:suporte@heromint.net">suporte@heromint.net</a>. Consulte também nossa página de{" "}
          <a href="/exclusao-de-dados">Exclusão de Dados</a>.
        </p>
      </section>
    </LegalPage>
  );
}

