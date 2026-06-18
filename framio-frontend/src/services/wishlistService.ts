import api from './api';

export interface WishlistItem {
  id: number;
  user_id: number;
  product_id: number;
  name: string;
  slug: string;
  price: number;
  discount_price?: number;
  stock: number;
  image?: string;
  created_at: string;
}

export const wishlistService = {
  getWishlist: async (): Promise<{ items: WishlistItem[] }> => {
    const response = await api.get('/wishlist');
    return response.data;
  },

  addItem: async (productId: number): Promise<{ items: WishlistItem[] }> => {
    const response = await api.post('/wishlist/add', { product_id: productId });
    return response.data;
  },

  removeItem: async (productId: number): Promise<{ items: WishlistItem[] }> => {
    const response = await api.post('/wishlist/remove', { product_id: productId });
    return response.data;
  },

  clearWishlist: async () => {
    const response = await api.post('/wishlist/clear');
    return response.data;
  },
};
