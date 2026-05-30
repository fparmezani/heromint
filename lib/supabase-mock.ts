// Mock do Supabase para funcionar sem configuração
// Remove este arquivo quando configurar o Supabase real

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
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_id?: string;
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

// Mock functions usando localStorage
export async function createUser(userData: {
  email: string;
  name?: string;
}) {
  const user: User = {
    id: `user_${Date.now()}`,
    email: userData.email,
    name: userData.name,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  localStorage.setItem(`user_${userData.email}`, JSON.stringify(user));
  return user;
}

export async function getUserByEmail(email: string) {
  const userData = localStorage.getItem(`user_${email}`);
  return userData ? JSON.parse(userData) : null;
}

export async function getOrCreateUser(email: string, name?: string) {
  let user = await getUserByEmail(email);
  
  if (!user) {
    user = await createUser({ email, name });
  }
  
  return user;
}

export async function createOrder(orderData: {
  user_id: string;
  collectible_id: string;
  theme_name: string;
  package_type: 'individual' | 'premium' | 'completo';
  total_amount: number;
  form_data: Record<string, any>;
  payment_id?: string;
}) {
  const order: Order = {
    id: `order_${Date.now()}`,
    ...orderData,
    payment_status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  localStorage.setItem(`order_${order.id}`, JSON.stringify(order));
  
  // Salva na lista de pedidos do usuário
  const userOrders = JSON.parse(localStorage.getItem(`user_orders_${orderData.user_id}`) || '[]');
  userOrders.push(order.id);
  localStorage.setItem(`user_orders_${orderData.user_id}`, JSON.stringify(userOrders));
  
  return order;
}

export async function updateOrderPaymentStatus(
  orderId: string, 
  status: 'paid' | 'failed' | 'refunded',
  paymentId?: string
) {
  const orderData = localStorage.getItem(`order_${orderId}`);
  if (!orderData) throw new Error('Order not found');
  
  const order = JSON.parse(orderData);
  order.payment_status = status;
  order.payment_id = paymentId;
  order.updated_at = new Date().toISOString();
  
  localStorage.setItem(`order_${orderId}`, JSON.stringify(order));
  return order;
}

export async function getUserOrders(userId: string) {
  const userOrderIds = JSON.parse(localStorage.getItem(`user_orders_${userId}`) || '[]');
  
  const orders = userOrderIds.map((orderId: string) => {
    const orderData = localStorage.getItem(`order_${orderId}`);
    if (!orderData) return null;
    
    const order = JSON.parse(orderData);
    
    // Busca imagens do pedido
    const images = JSON.parse(localStorage.getItem(`order_images_${orderId}`) || '[]');
    
    return {
      ...order,
      generated_images: images,
    };
  }).filter(Boolean);
  
  return orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function saveGeneratedImages(images: {
  order_id: string;
  image_url: string;
  template_used: string;
  file_name: string;
  file_size?: number;
}[]) {
  const imagesWithIds = images.map(img => ({
    id: `img_${Date.now()}_${Math.random()}`,
    ...img,
    created_at: new Date().toISOString(),
  }));
  
  // Agrupa por order_id
  const imagesByOrder: Record<string, any[]> = {};
  imagesWithIds.forEach(img => {
    if (!imagesByOrder[img.order_id]) {
      imagesByOrder[img.order_id] = [];
    }
    imagesByOrder[img.order_id].push(img);
  });
  
  // Salva no localStorage
  Object.entries(imagesByOrder).forEach(([orderId, orderImages]) => {
    const existingImages = JSON.parse(localStorage.getItem(`order_images_${orderId}`) || '[]');
    const allImages = [...existingImages, ...orderImages];
    localStorage.setItem(`order_images_${orderId}`, JSON.stringify(allImages));
  });
  
  return imagesWithIds;
}

export async function getOrderImages(orderId: string) {
  return JSON.parse(localStorage.getItem(`order_images_${orderId}`) || '[]');
}

// Mock do cliente Supabase
export const supabase = {
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        single: async () => {
          if (table === 'orders') {
            const orderData = localStorage.getItem(`order_${value}`);
            if (!orderData) return { data: null, error: { message: 'Order not found' } };
            
            const order = JSON.parse(orderData);
            const images = JSON.parse(localStorage.getItem(`order_images_${value}`) || '[]');
            const userData = Object.keys(localStorage)
              .filter(key => key.startsWith('user_'))
              .map(key => JSON.parse(localStorage.getItem(key)!))
              .find(user => user.id === order.user_id);
            
            return {
              data: {
                ...order,
                generated_images: images,
                users: userData,
              },
              error: null
            };
          }
          return { data: null, error: null };
        }
      })
    })
  })
};
