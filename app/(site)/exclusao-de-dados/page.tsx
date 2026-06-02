import { LegalPage } from "@/components/legal/LegalPage";

export default function DataDeletionPage() {
  return (
    <LegalPage title="Exclusão de Dados" updatedAt="2 de junho de 2026">
      <section>
        <h2>Como solicitar</h2>
        <p>
          Para solicitar a exclusão de dados associados à sua conta HeroMint, envie um e-mail para{" "}
          <a href="mailto:suporte@heromint.net?subject=Solicitação de exclusão de dados">
            suporte@heromint.net
          </a>{" "}
          com o assunto “Solicitação de exclusão de dados”. Informe o e-mail utilizado no login e,
          se possível, o número de um pedido para facilitar a localização da conta.
        </p>
      </section>
      <section>
        <h2>Tratamento da solicitação</h2>
        <p>
          Confirmaremos o recebimento e poderemos solicitar uma validação de identidade antes de
          excluir ou anonimizar dados. A conclusão será informada por e-mail. Alguns registros podem
          ser mantidos quando houver obrigação legal, necessidade de prevenção a fraudes ou exercício
          regular de direitos.
        </p>
      </section>
      <section>
        <h2>Revogação de acesso por plataformas</h2>
        <p>
          Caso tenha utilizado uma plataforma externa para login, você também pode remover o acesso
          da HeroMint diretamente nas configurações dessa plataforma.
        </p>
      </section>
    </LegalPage>
  );
}

