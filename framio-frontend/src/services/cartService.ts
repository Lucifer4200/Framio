import api from './api';

export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  price: number;
  name: string;
  slug: string;
  image?: string;
  stock: number;
}

export interface Cart {
  cart_id: number;
  items: CartItem[];
  total: number;
}

export const cartService = {
  getCart: async (): Promise<Cart> => {
    const response = await api.get('/cart');
    return response.data;
  },

  addItem: async (productId: number, quantity: number): Promise<Cart> => {
    const response = await api.post('/cart/add', { product_id: productId, quantity });
    return response.data;
  },

  updateItem: async (productId: number, quantity: number): Promise<Cart> => {
    const response = await api.post('/cart/update', { product_id: productId, quantity });
    return response.data;
  },

  removeItem: async (productId: number): Promise<Cart> => {
    const response = await api.post('/cart/remove', { product_id: productId });
    return response.data;
  },

  clearCart: async () => {
    const response = await api.post('/cart/clear');
    return response.data;
  },
};
