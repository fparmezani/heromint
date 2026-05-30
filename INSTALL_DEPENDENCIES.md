# Dependências para Email, Download e Supabase

Execute os seguintes comandos para instalar as dependências:

```bash
npm install jszip @supabase/supabase-js
npm install @types/jszip --save-dev
```

## Variáveis de Ambiente Necessárias

Adicione no seu `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_publica_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_aqui

# Email Service (Resend - Recomendado)
RESEND_API_KEY=sua_chave_resend_aqui

# Ou use outro provedor de email
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=seu@email.com
# SMTP_PASS=sua_senha_app
```

## Como Obter a Chave do Resend:

1. Acesse: https://resend.com/
2. Crie uma conta gratuita
3. Vá em "API Keys"
4. Crie uma nova chave
5. Configure seu domínio (opcional)

## Alternativas de Email:

- **Resend**: Mais simples, 3.000 emails/mês grátis
- **SendGrid**: Até 100 emails/dia grátis
- **Gmail SMTP**: Gratuito, mas requer configuração de senha de app
- **Nodemailer**: Para qualquer provedor SMTP
