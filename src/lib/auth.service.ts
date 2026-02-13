import { api } from './api';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  email: string;
  name: string;
}

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    const { token } = response.data;
    localStorage.setItem('token', token);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    const { token } = response.data;
    localStorage.setItem('token', token);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/auth';
  },
};
