-- Tabela de configurações da aplicação
-- Execute este script no SQL Editor do Supabase

CREATE TABLE IF NOT EXISTS app_config (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'main',
    config JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir configuração padrão
INSERT INTO app_config (id, config) VALUES (
    'main',
    '{
        "aiProvider": "replicate",
        "defaultImageCount": 1,
        "maxImageCount": 10,
        "enableEmailDelivery": true,
        "enablePayments": true
    }'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Índice para performance
CREATE INDEX IF NOT EXISTS idx_app_config_id ON app_config(id);

-- Comentário para documentação
COMMENT ON TABLE app_config IS 'Configurações globais da aplicação HeroMint';
