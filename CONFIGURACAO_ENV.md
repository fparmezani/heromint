# 🔧 Configuração das Variáveis de Ambiente

Para o projeto funcionar completamente, você precisa configurar as seguintes variáveis no arquivo `.env.local`:

## 📋 Copie e cole no seu .env.local:

```bash
# Supabase (OBRIGATÓRIO para banco de dados)
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua_chave_publica_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_aqui

# Replicate (IA - já configurado)
REPLICATE_API_TOKEN=sua_chave_replicate_aqui

# Anthropic (Customização de prompts - já configurado)
ANTHROPIC_API_KEY=sua_chave_anthropic_aqui

# Asaas (Pagamentos - já configurado)
ASAAS_API_KEY=sua_chave_asaas_aqui
ASAAS_ENVIRONMENT=sandbox

# Email (Resend - opcional)
RESEND_API_KEY=sua_chave_resend_aqui

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=uma_chave_secreta_aleatoria_qualquer
```

## 🚨 ERRO ATUAL:

O erro que você está vendo acontece porque as variáveis do Supabase não estão configuradas:

```
NEXT_PUBLIC_SUPABASE_URL is undefined
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is undefined
```

## ✅ SOLUÇÃO RÁPIDA PARA TESTAR:

Se você quiser testar o sistema SEM o Supabase por enquanto, posso criar uma versão que funciona apenas com localStorage temporariamente.

## 🔧 PARA CONFIGURAR O SUPABASE:

1. Acesse: https://supabase.com
2. Crie um novo projeto
3. Vá em Settings → API
4. Copie:
   - Project URL → NEXT_PUBLIC_SUPABASE_URL
   - anon public → NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY  
   - service_role → SUPABASE_SERVICE_ROLE_KEY
5. Execute o SQL em `database/schema.sql` no SQL Editor do Supabase

## 🧪 MODO TESTE SEM BANCO:

Se quiser testar agora mesmo, me avise que crio uma versão temporária que funciona apenas com localStorage, sem precisar configurar o Supabase.
