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

  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    const result = response.data?.data ?? response.data;
    return result;
  },

  refresh: async (refreshToken: string) => {
    const response = await api.post('/auth/refresh', { refreshToken });
    const result = response.data?.data ?? response.data;
    return result;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    const result = response.data?.data ?? response.data;
    return result;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    const data = response.data?.data ?? response.data;
    return data;
  },

  updateProfile: async (profileData: any) => {
    const response = await api.patch('/auth/me', profileData);
    const data = response.data?.data ?? response.data;
    return data;
  }
};
