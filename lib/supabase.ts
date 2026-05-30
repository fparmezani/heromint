import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente para uso no servidor (com service role key)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
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
  package_type: 'individual' | 'premium' | 'completo';
  total_amount: number; // em centavos
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_id?: string; // ID do Asaas
  form_data: Record<string, any>;
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
  let user = await getUserByEmail(email);
  
  if (!user) {
    user = await createUser({ email, name });
  }
  
  return user;
}

// Funções de pedidos
export async function createOrder(orderData: {
  user_id: string;
  collectible_id: string;
  theme_name: string;
  package_type: 'individual' | 'premium' | 'completo';
  total_amount: number;
  form_data: Record<string, any>;
  payment_id?: string;
}) {
  const { data, error } = await supabase
    .from('orders')
    .insert([{
      ...orderData,
      payment_status: 'pending'
    }])
    .select()
    .single();

  if (error) throw error;
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
