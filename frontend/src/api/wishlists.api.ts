import api from './axios';

export const wishlistsApi = {
  getWishlist: async (): Promise<any[]> => {
    const res = await api.get('/wishlists');
    return res.data;
  },
  addToWishlist: async (productId: string): Promise<any> => {
    const res = await api.post('/wishlists', { productId });
    return res.data;
  },
  checkInWishlist: async (productId: string): Promise<{ inWishlist: boolean }> => {
    const res = await api.get(`/wishlists/check/${productId}`);
    return res.data;
  },
  removeFromWishlist: async (productId: string): Promise<void> => {
    await api.delete(`/wishlists/${productId}`);
  },
  clearWishlist: async (): Promise<void> => {
    await api.delete('/wishlists/clear');
  },
};
