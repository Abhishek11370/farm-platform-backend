import api from './axios';
import { User } from '../types/auth'; // Ensure this exists and matches the User entity.

export interface CreateUserPayload {
  email: string;
  password?: string;
  name?: string;
  role: 'ADMIN' | 'FARMER' | 'BUYER' | 'DELIVERY';
  phone?: string;
  isBlocked?: boolean;
}

export interface UpdateUserPayload extends Partial<CreateUserPayload> {}

export const usersApi = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },

  getUser: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (data: CreateUserPayload): Promise<User> => {
    const response = await api.post('/users', data);
    return response.data;
  },

  updateUser: async (id: string, data: UpdateUserPayload): Promise<User> => {
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<User> => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};
