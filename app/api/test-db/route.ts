import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAdminSession } from "@/lib/admin-auth";

export async function GET() {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Acesso restrito ao administrador" },
      { status: 403 }
    );
  }

  try {
    console.log('🔗 Testando conexão com Supabase...');
    
    // Testa se consegue acessar as tabelas
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (usersError) {
      return NextResponse.json({
        success: false,
        error: 'Tabela users não encontrada',
        details: usersError.message,
        solution: 'Execute o arquivo database/schema.sql no SQL Editor do Supabase'
      });
    }
    
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('count')
      .limit(1);
    
    if (ordersError) {
      return NextResponse.json({
        success: false,
        error: 'Tabela orders não encontrada',
        details: ordersError.message,
        solution: 'Execute o arquivo database/schema.sql no SQL Editor do Supabase'
      });
    }
    
    const { data: images, error: imagesError } = await supabase
      .from('generated_images')
      .select('count')
      .limit(1);
    
    if (imagesError) {
      return NextResponse.json({
        success: false,
        error: 'Tabela generated_images não encontrada',
        details: imagesError.message,
        solution: 'Execute o arquivo database/schema.sql no SQL Editor do Supabase'
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Todas as tabelas estão funcionando!',
      tables: {
        users: '✅ OK',
        orders: '✅ OK', 
        generated_images: '✅ OK'
      }
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Erro de conexão',
      details: error.message
    });
  }
}
