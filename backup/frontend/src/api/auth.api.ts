import api from './axios';

export const authApi = {
  login: async (credentials: { email?: string; phone?: string; password?: string }) => {
    const response = await api.post('/auth/login', credentials);
    const result = response.data?.data ?? response.data;
    const accessToken = result.accessToken || result.token;
    const refreshToken = result.refreshToken;
    const user = result.user || {};
    return { accessToken, refreshToken, user };
  },


  // Example for registration if needed
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    // Directly use /auth/me endpoint; backend should provide user info
    const response = await api.get('/auth/me');
    // Some backends may wrap data inside { data: {...} }
    const data = response.data?.data ?? response.data;
    return data;
  }
};
