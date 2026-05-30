-- HeroMint Database Schema
-- Execute este script no SQL Editor do Supabase

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de usuários
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de pedidos
CREATE TABLE orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    collectible_id VARCHAR(255) NOT NULL,
    theme_name VARCHAR(255) NOT NULL,
    package_type VARCHAR(50) CHECK (package_type IN ('individual', 'premium', 'completo', 'futebol-familia')) NOT NULL,
    total_amount INTEGER NOT NULL, -- em centavos
    payment_status VARCHAR(50) CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
    payment_id VARCHAR(255), -- ID do Asaas
    form_data JSONB NOT NULL, -- dados do formulário
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de imagens geradas
CREATE TABLE generated_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    template_used VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER, -- tamanho em bytes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS app_config (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'main',
    config JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_collectible_id ON orders(collectible_id);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_generated_images_order_id ON generated_images(order_id);
CREATE INDEX IF NOT EXISTS idx_app_config_id ON app_config(id);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_app_config_updated_at
    BEFORE UPDATE ON app_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) - Opcional para segurança
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_images ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança (usuários só veem seus próprios dados)
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own images" ON generated_images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = generated_images.order_id 
            AND orders.user_id::text = auth.uid()::text
        )
    );

-- Inserir dados de exemplo (opcional)
INSERT INTO users (id, email, name) VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'teste@heromint.com', 'Usuário Teste');

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

-- Comentários para documentação
COMMENT ON TABLE users IS 'Tabela de usuários do sistema';
COMMENT ON TABLE orders IS 'Tabela de pedidos/compras realizadas';
COMMENT ON TABLE generated_images IS 'Tabela de imagens geradas para cada pedido';
COMMENT ON TABLE app_config IS 'Configurações globais da aplicação HeroMint';

COMMENT ON COLUMN orders.total_amount IS 'Valor total em centavos (ex: 990 = R$ 9,90)';
COMMENT ON COLUMN orders.form_data IS 'Dados do formulário em JSON (nome, time, etc)';
COMMENT ON COLUMN generated_images.image_url IS 'URL da imagem gerada (Replicate/CDN)';
COMMENT ON COLUMN generated_images.template_used IS 'Template usado (futebol-2026, futebol-panini, etc)';
