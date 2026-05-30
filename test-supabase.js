// Teste rápido da conexão com Supabase
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carrega variáveis de ambiente
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔗 Testando conexão com Supabase...');
console.log('URL:', supabaseUrl ? '✅ Configurada' : '❌ Não encontrada');
console.log('Key:', supabaseAnonKey ? '✅ Configurada' : '❌ Não encontrada');

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Testa conexão básica
async function testConnection() {
  try {
    console.log('\n🧪 Testando conexão...');
    
    // Testa se consegue acessar as tabelas
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (usersError) {
      console.log('❌ Erro ao acessar tabela users:', usersError.message);
      console.log('💡 Você precisa executar o schema.sql no Supabase');
      return false;
    }
    
    console.log('✅ Tabela users: OK');
    
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('count')
      .limit(1);
    
    if (ordersError) {
      console.log('❌ Erro ao acessar tabela orders:', ordersError.message);
      return false;
    }
    
    console.log('✅ Tabela orders: OK');
    
    const { data: images, error: imagesError } = await supabase
      .from('generated_images')
      .select('count')
      .limit(1);
    
    if (imagesError) {
      console.log('❌ Erro ao acessar tabela generated_images:', imagesError.message);
      return false;
    }
    
    console.log('✅ Tabela generated_images: OK');
    console.log('\n🎉 Todas as tabelas estão funcionando!');
    return true;
    
  } catch (error) {
    console.log('❌ Erro de conexão:', error.message);
    return false;
  }
}

testConnection().then(success => {
  if (success) {
    console.log('\n✅ Supabase configurado corretamente!');
  } else {
    console.log('\n❌ Problemas na configuração do Supabase');
    console.log('\n📋 Próximos passos:');
    console.log('1. Acesse o SQL Editor no Supabase');
    console.log('2. Execute o conteúdo do arquivo database/schema.sql');
    console.log('3. Execute este teste novamente');
  }
  process.exit(success ? 0 : 1);
});
