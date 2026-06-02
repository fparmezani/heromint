import { LegalPage } from "@/components/legal/LegalPage";

export default function CookiePolicyPage() {
  return (
    <LegalPage title="Política de Cookies" updatedAt="2 de junho de 2026">
      <section>
        <h2>1. O que são cookies</h2>
        <p>
          Cookies e tecnologias semelhantes ajudam um site a lembrar preferências, manter sessões
          e compreender como suas páginas são utilizadas.
        </p>
      </section>
      <section>
        <h2>2. Categorias utilizadas</h2>
        <ul>
          <li>Necessários: utilizados para funcionamento, segurança, login e preferências do site.</li>
          <li>Análise: ativados somente com autorização para medir visitas por meio do Google Analytics.</li>
          <li>Marketing: reservados para campanhas futuras e ativados somente com autorização específica.</li>
        </ul>
      </section>
      <section>
        <h2>3. Como controlar</h2>
        <p>
          Você pode aceitar, recusar ou configurar cookies opcionais no banner exibido no site.
          Também pode alterar sua escolha a qualquer momento pelo link “Preferências de cookies”
          no rodapé. Cookies necessários permanecem ativos porque sustentam funcionalidades essenciais.
        </p>
      </section>
      <section>
        <h2>4. Contato</h2>
        <p>
          Para dúvidas, envie uma mensagem para{" "}
          <a href="mailto:suporte@heromint.net">suporte@heromint.net</a>.
        </p>
      </section>
    </LegalPage>
  );
}

