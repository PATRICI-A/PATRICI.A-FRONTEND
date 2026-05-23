import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';

vi.mock('axios', async () => {
  const actual = await vi.importActual<typeof import('axios')>('axios');
  return {
    default: {
      ...actual.default,
      create: vi.fn(() => ({
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
        post: vi.fn(),
        get: vi.fn(),
      })),
    },
  };
});

vi.mock('../services/http', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn(() => ({
    sub: 'u1',
    email: 'p@test.com',
    name: 'Patricia',
    iat: 0,
    exp: 9999999999,
  })),
}));

import { authService } from '../services/auth.service';
import api from '../services/http';

describe('authService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('login', () => {
    it('calls the correct endpoint and stores the accessToken', async () => {
      const fakeResponse = {
        data: {
          accessToken: 'access123',
          refreshToken: 'refresh456',
          tokenType: 'Bearer',
        },
      };
      (api.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce(fakeResponse);

      const result = await authService.login({ email: 'p@test.com', password: '1234' });

      expect(api.post).toHaveBeenCalledWith('/auth/login', { email: 'p@test.com', password: '1234' });
      expect(result.tokens.accessToken).toBe('access123');
      expect(localStorage.getItem('patricia-token')).toBe('access123');
      expect(localStorage.getItem('patricia-refresh-token')).toBe('refresh456');
    });
  });

  describe('verifyOtp', () => {
    it('calls the verify-otp endpoint with email and otp', async () => {
      const fakeResponse = {
        data: {
          accessToken: 'access123',
          refreshToken: 'refresh456',
          tokenType: 'Bearer',
        },
      };
      (api.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce(fakeResponse);

      const result = await authService.verifyOtp('p@test.com', '123456');

      expect(api.post).toHaveBeenCalledWith('/auth/verify-otp', { email: 'p@test.com', otp: '123456' });
      expect(result.accessToken).toBe('access123');
      expect(localStorage.getItem('patricia-token')).toBe('access123');
    });
  });

  describe('forgotPassword', () => {
    it('calls the forgot-password endpoint', async () => {
      (api.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: { message: 'ok' } });
      await authService.forgotPassword('p@test.com');
      expect(api.post).toHaveBeenCalledWith('/auth/forgot-password', { email: 'p@test.com' });
    });
  });

  describe('resetPassword', () => {
    it('calls the reset-password endpoint with all required fields', async () => {
      (api.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: { message: 'ok' } });
      await authService.resetPassword('p@test.com', '123456', 'NewPass1!', 'NewPass1!');
      expect(api.post).toHaveBeenCalledWith('/auth/reset-password', {
        email: 'p@test.com',
        code: '123456',
        newPassword: 'NewPass1!',
        confirmPassword: 'NewPass1!',
        passwordsMatch: true,
      });
    });
  });

  describe('logout', () => {
    it('removes tokens from localStorage', async () => {
      localStorage.setItem('patricia-token', 'tok');
      localStorage.setItem('patricia-refresh-token', 'ref');
      localStorage.setItem('patricia-logged-in', 'true');
      (api.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: {} });

      await authService.logout();

      expect(localStorage.getItem('patricia-token')).toBeNull();
      expect(localStorage.getItem('patricia-refresh-token')).toBeNull();
      expect(localStorage.getItem('patricia-logged-in')).toBeNull();
    });
  });
});
