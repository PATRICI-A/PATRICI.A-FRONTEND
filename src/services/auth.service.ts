import api from './http';
import { profileService } from './profileService';
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
export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', payload);
    localStorage.setItem('patricia-token', data.token);
    try {
      const user = await profileService.getUserByEmail(payload.email);
      localStorage.setItem('patricia_user_id', user.id);
    } catch {
      // non-blocking: matching features won't work until userId is resolved
    }
    return data;
  },

  async initVerification(email: string, password: string): Promise<void> {
    await api.post('/auth/init-verification', { email, hashedPassword: password });
  },

  async verifyOtp(email: string, otp: string): Promise<LoginResponseDto> {
    const { data } = await api.post<LoginResponseDto>('/auth/verify-otp', { email, otp });
    return data;
  },

  async resendOtp(email: string): Promise<void> {
    await api.post('/auth/resend-otp', { email });
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  },

  async resetPassword(email: string, code: string, newPassword: string): Promise<void> {
    await api.post('/auth/reset-password', {
      email,
      code,
      newPassword,
      confirmPassword: newPassword,
      passwordsMatch: true,
    });
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', payload);
    localStorage.setItem('patricia-token', data.token);
    return data;
  },

  logout(): void {
    localStorage.removeItem('patricia-token');
    localStorage.removeItem('patricia-logged-in');
    localStorage.removeItem('patricia_user_id');
  },
};
