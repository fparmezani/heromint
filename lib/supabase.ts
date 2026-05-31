import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createClient(supabaseUrl, supabasePublishableKey);

// Cliente para uso no servidor (com service role key)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabasePublishableKey
);

// Tipos do banco de dados
export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  collectible_id: string;
  theme_name: string;
  package_type: 'individual' | 'premium' | 'completo' | 'futebol-familia';
  total_amount: number; // em centavos
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_id?: string; // ID do Asaas
  form_data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface GeneratedImage {
  id: string;
  order_id: string;
  image_url: string;
  template_used: string;
  file_name: string;
  file_size?: number;
  indisponivel: boolean;
  created_at: string;
}

// Funções de usuário
export async function createUser(userData: {
  email: string;
  name?: string;
}) {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function getOrCreateUser(email: string, name?: string) {
  console.log('🔍 [SUPABASE] Buscando usuário por email:', email);
  let user = await getUserByEmail(email);

  if (!user) {
    console.log('👤 [SUPABASE] Usuário não encontrado, criando novo...');
    user = await createUser({ email, name });
    console.log('✅ [SUPABASE] Usuário criado:', user.id);
  } else {
    console.log('✅ [SUPABASE] Usuário encontrado:', user.id);
  }

  return user;
}

// Funções de pedidos
export async function createOrder(orderData: {
  user_id: string;
  collectible_id: string;
  theme_name: string;
  package_type: 'individual' | 'premium' | 'completo' | 'futebol-familia';
  total_amount: number;
  form_data: Record<string, unknown>;
  payment_id?: string;
}) {
  console.log('📝 [SUPABASE] Criando pedido com dados:', orderData);

  const { data, error } = await supabase
    .from('orders')
    .insert([{
      ...orderData,
      payment_status: 'pending'
    }])
    .select()
    .single();

  if (error) {
    console.error('❌ [SUPABASE] Erro ao criar pedido:', error);
    throw error;
  }

  console.log('✅ [SUPABASE] Pedido criado com sucesso:', data.id);
  return data;
}

export async function updateOrderPaymentStatus(
  orderId: string,
  status: 'paid' | 'failed' | 'refunded',
  paymentId?: string
) {
  const { data, error } = await supabase
    .from('orders')
    .update({
      payment_status: status,
      payment_id: paymentId,
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserOrders(userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      generated_images (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Funções de imagens
export async function saveGeneratedImages(images: {
  order_id: string;
  image_url: string;
  template_used: string;
  file_name: string;
  file_size?: number;
}[]) {
  const { data, error } = await supabase
    .from('generated_images')
    .insert(images)
    .select();

  if (error) throw error;
  return data;
}

export async function getOrderImages(orderId: string) {
  const { data, error } = await supabase
    .from('generated_images')
    .select('*')
    .eq('order_id', orderId);

  if (error) throw error;
  return data;
}

export async function markGeneratedImageUnavailable(imageId: string) {
  const { data, error } = await supabaseAdmin
    .from('generated_images')
    .update({ indisponivel: true })
    .eq('id', imageId)
    .select('id, indisponivel')
    .single();

  if (error) throw error;
  return data;
}

// Upload image to Supabase Storage
export async function uploadImageToStorage(
  bucket: string,
  path: string,
  fileBuffer: Buffer,
  contentType: string = "image/jpeg"
): Promise<{ publicUrl: string }> {
  const { error } = await supabaseAdmin
    .storage
    .from(bucket)
    .upload(path, fileBuffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    console.error("[SUPABASE STORAGE] Upload error:", error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const { data: publicUrlData } = supabaseAdmin
    .storage
    .from(bucket)
    .getPublicUrl(path);

  return { publicUrl: publicUrlData.publicUrl };
}
