# 🎮 HeroMint — Forje Sua Versão Épica

Plataforma SaaS onde o usuário envia uma foto e transforma essa imagem em cards épicos de futebol, heróis, profissionais e muito mais usando IA generativa.

## ✨ Funcionalidades

- 🖼️ **11 Temas Épicos**: Futebol Copa 2026, Panini, Heróis, Profissional, Reino Medieval, Escola de Magia e mais
- 🤖 **IA Generativa**: Integração com Replicate (Flux Schnell, Kontext) e Anthropic Claude
- 📦 **3 Pacotes**: Individual (1 imagem), Premium (5 imagens), Completo (10 imagens)
- 💳 **Pagamentos**: Integração com Asaas (Pix, Cartão, Boleto)
- 📧 **Entrega**: Download direto ou envio por email
- 👤 **Área do Cliente**: Histórico de compras e re-download
- 🧪 **Modo Sandbox**: Testes sem pagamento real

## 🚀 Stack Tecnológica

- **Next.js 15** com App Router + TypeScript
- **Tailwind CSS v4** + Framer Motion
- **Supabase** — Banco de dados PostgreSQL + Auth
- **Asaas** — Gateway de pagamentos brasileiro
- **Replicate** — IA para geração de imagens
- **Anthropic Claude** — Customização de prompts
- **Resend** — Envio de emails
- **JSZip** — Compactação de múltiplas imagens

## 📦 Instalação

```bash
# Instalar dependências
npm install jszip @supabase/supabase-js

# Dependências de desenvolvimento
npm install @types/jszip --save-dev
```

## 🚀 Configuração

### 1. Variáveis de Ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_publica_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_aqui

# Replicate (IA)
REPLICATE_API_TOKEN=sua_chave_replicate_aqui

# Anthropic (Customização de prompts)
ANTHROPIC_API_KEY=sua_chave_anthropic_aqui

# Asaas (Pagamentos)
ASAAS_API_KEY=sua_chave_asaas_aqui
ASAAS_ENVIRONMENT=sandbox  # ou 'production'

# Email (Resend)
RESEND_API_KEY=sua_chave_resend_aqui

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua_chave_secreta_aleatoria
```

### 2. Configurar Supabase

1. Crie projeto em [supabase.com](https://supabase.com)
2. Execute o script SQL em `database/schema.sql` no SQL Editor
3. Copie as chaves do projeto para o `.env.local`

### 3. Configurar Replicate

1. Crie conta em [replicate.com](https://replicate.com)
2. Gere API token em Account → API tokens
3. Adicione `REPLICATE_API_TOKEN` no `.env.local`

### 4. Configurar Asaas (Pagamentos)

1. Crie conta em [asaas.com](https://asaas.com)
2. Gere API key no painel
3. Configure `ASAAS_ENVIRONMENT=sandbox` para testes

### 5. Rodar o Projeto

```bash
npm run dev
```

Acesse: http://localhost:3000

## 🧪 Modo de Desenvolvimento

Para testar sem pagamentos reais:

1. Configure `ASAAS_ENVIRONMENT=sandbox`
2. Gere um card qualquer
3. Use o botão "🧪 Simular Pagamento" que aparece em sandbox
4. Imagens são entregues sem marca d'água

## 🏭 Deploy em Produção

### Vercel (Recomendado)

```bash
npm i -g vercel
vercel --prod
```

### Variáveis de Ambiente em Produção

- Configure todas as variáveis do `.env.local` no painel da Vercel
- Mude `ASAAS_ENVIRONMENT=production`
- Use URLs de produção para `NEXTAUTH_URL`

## 📁 Estrutura do Projeto

```
├── app/
│   ├── (site)/
│   │   ├── temas/          # Seleção de temas
│   │   ├── criar/          # Formulário multi-step
│   │   ├── preview/        # Preview com pagamento
│   │   ├── entrega/        # Página de download
│   │   └── minha-conta/    # Área do cliente
│   └── api/
│       ├── generate/       # Geração de imagens
│       ├── process-payment/# Processamento de pagamentos
│       └── download-images/# Download de imagens
├── components/
│   ├── preview/            # Templates dos cards
│   ├── delivery/           # Opções de entrega
│   └── loading/            # Página de loading animada
├── lib/
│   ├── supabase.ts         # Cliente Supabase
│   ├── image-generation.ts # IA e geração
│   └── email-service.ts    # Envio de emails
└── database/
    └── schema.sql          # Schema do banco
```

## 🎨 Temas Disponíveis

1. **Futebol Copa 2026** - Estilo épico com efeitos dourados
2. **Futebol Panini** - Estilo figurinha clássica
3. **Hero Card** - Fantasia sombria com runas roxas
4. **Profissional Premium** - Corporativo elegante
5. **Reino Medieval** - Fantasia medieval com ouro
6. **Escola de Magia** - Mágico com efeitos roxos
7. **Baby Hero** - Versão fofa para crianças
8. **Family Pack** - Para toda família
9. **Pet Star** - Para animais de estimação
10. **Battle Card** - Estilo jogo de cartas
11. **Avatar Poster** - Poster futurista

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para detalhes.
