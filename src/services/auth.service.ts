import api from './http';
import { jwtDecode } from 'jwt-decode';
import type { User } from '../store/AppContext';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export interface MessageResponse {
  message: string;
}

interface JwtClaims {
  sub: string;
  email?: string;
  name?: string;
  roles?: string[];
  iat: number;
  exp: number;
}

export function decodeTokenToUser(token: string): User {
  const claims = jwtDecode<JwtClaims>(token);
  return {
    id: claims.sub,
    name: claims.name ?? claims.email ?? claims.sub,
    email: claims.email ?? claims.sub,
    avatar: '',
    faculty: '',
    semester: 1,
    interests: [],
    bio: '',
    socialImpact: 0,
    xp: 0,
    level: 1,
    activeParches: 0,
    streak: 0,
    rankFaculty: 0,
    monas: [],
  };
}

export function clearAuth() {
  localStorage.removeItem('patricia-token');
  localStorage.removeItem('patricia-refresh-token');
  localStorage.removeItem('patricia-logged-in');
}

export const authService = {
  async login(payload: LoginPayload): Promise<{ tokens: TokenResponse; user: User }> {
    const { data } = await api.post<TokenResponse>('/auth/login', payload);
    localStorage.setItem('patricia-token', data.accessToken);
    localStorage.setItem('patricia-refresh-token', data.refreshToken);
    const user = decodeTokenToUser(data.accessToken);
    return { tokens: data, user };
  },

  async initVerification(email: string, hashedPassword: string): Promise<MessageResponse> {
    const { data } = await api.post<MessageResponse>('/auth/init-verification', { email, hashedPassword });
    return data;
  },

  async verifyOtp(email: string, otp: string): Promise<TokenResponse> {
    const { data } = await api.post<TokenResponse>('/auth/verify-otp', { email, otp });
    localStorage.setItem('patricia-token', data.accessToken);
    localStorage.setItem('patricia-refresh-token', data.refreshToken);
    return data;
  },

  async resendOtp(email: string): Promise<MessageResponse> {
    const { data } = await api.post<MessageResponse>('/auth/resend-otp', { email });
    return data;
  },

  async forgotPassword(email: string): Promise<MessageResponse> {
    const { data } = await api.post<MessageResponse>('/auth/forgot-password', { email });
    return data;
  },

  async resetPassword(
    email: string,
    code: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<MessageResponse> {
    const { data } = await api.post<MessageResponse>('/auth/reset-password', {
      email,
      code,
      newPassword,
      confirmPassword,
      passwordsMatch: newPassword === confirmPassword,
    });
    return data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<MessageResponse> {
    const { data } = await api.post<MessageResponse>('/auth/change-password', { currentPassword, newPassword });
    return data;
  },

  async refreshToken(): Promise<TokenResponse> {
    const refreshToken = localStorage.getItem('patricia-refresh-token');
    const { data } = await api.post<TokenResponse>('/auth/refresh', { refreshToken });
    localStorage.setItem('patricia-token', data.accessToken);
    localStorage.setItem('patricia-refresh-token', data.refreshToken);
    return data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout', {});
    } finally {
      clearAuth();
    }
  },
};
