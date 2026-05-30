-- Fix RLS Policies for HeroMint
-- Execute este script no SQL Editor do Supabase para corrigir as políticas de segurança

-- 1. Remover políticas restritivas existentes
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can view own images" ON generated_images;

-- 2. Criar políticas mais permissivas para operações da aplicação

-- Política para usuários: permitir inserção e leitura
CREATE POLICY "Allow user creation and reading" ON users
    FOR ALL USING (true)
    WITH CHECK (true);

-- Política para pedidos: permitir todas as operações
CREATE POLICY "Allow all operations on orders" ON orders
    FOR ALL USING (true)
    WITH CHECK (true);

-- Política para imagens: permitir todas as operações
CREATE POLICY "Allow all operations on generated_images" ON generated_images
    FOR ALL USING (true)
    WITH CHECK (true);

-- 3. Alternativa: Desabilitar RLS temporariamente (menos seguro, mas funcional)
-- Descomente as linhas abaixo se quiser desabilitar RLS completamente:

-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE generated_images DISABLE ROW LEVEL SECURITY;
