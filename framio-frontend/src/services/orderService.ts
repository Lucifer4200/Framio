import api from './api';

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  name: string;
  slug: string;
  image?: string;
}

export interface Order {
  id: number;
  user_id: number;
  order_number: string;
  total_amount: number;
  payment_status: string;
  order_status: string;
  shipping_address: string;
  billing_address: string;
  phone?: string;
  notes?: string;
  customer_name?: string;
  customer_email?: string;
  items?: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface CreateOrderData {
  items: Array<{
    product_id: number;
    quantity: number;
    price: number;
  }>;
  shipping_address: string;
  billing_address: string;
  phone?: string;
  notes?: string;
}

export const orderService = {
  getOrders: async (): Promise<{ orders: Order[] }> => {
    const response = await api.get('/orders');
    return response.data;
  },

  getOrderById: async (id: number): Promise<{ order: Order }> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  createOrder: async (data: CreateOrderData): Promise<{ order: Order }> => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  updateOrderStatus: async (id: number, status: string): Promise<{ order: Order }> => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  },
};
