import api from './http';
import type { User } from '../types/mockData';
export interface LoginPayload {
  email: string;
  password: string;
}
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  faculty: string;
  program: string;
  semester: number;
  interests: string[];
}
export interface AuthResponse {
  token: string;
  user: User;
}
export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', payload);
    localStorage.setItem('patricia-token', data.token);
    return data;
  },
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', payload);
    localStorage.setItem('patricia-token', data.token);
    return data;
  },
  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  },
  async resetPassword(token: string, password: string): Promise<void> {
    await api.post('/auth/reset-password', { token, password });
  },
  async verifyOtp(email: string, code: string): Promise<void> {
    await api.post('/auth/verify-otp', { email, code });
  },
  logout(): void {
    localStorage.removeItem('patricia-token');
    localStorage.removeItem('patricia-logged-in');
  },
};