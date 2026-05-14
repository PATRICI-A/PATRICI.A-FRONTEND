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

import { authService } from '../services/auth.service';
import api from '../services/http';

const mockApi = api as ReturnType<typeof vi.fn>;

describe('authService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('login', () => {
    it('calls the correct endpoint and stores the token', async () => {
      const fakeResponse = {
        data: {
          token: 'abc123',
          user: { id: 'u1', name: 'Patricia', email: 'p@test.com' },
        },
      };
      (api.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce(fakeResponse);

      const result = await authService.login({ email: 'p@test.com', password: '1234' });

      expect(api.post).toHaveBeenCalledWith('/auth/login', { email: 'p@test.com', password: '1234' });
      expect(result.token).toBe('abc123');
      expect(localStorage.getItem('patricia-token')).toBe('abc123');
    });
  });

  describe('register', () => {
    it('calls the register endpoint and stores the token', async () => {
      const fakeResponse = {
        data: {
          token: 'xyz789',
          user: { id: 'u2', name: 'New User', email: 'new@test.com' },
        },
      };
      (api.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce(fakeResponse);

      const payload = {
        name: 'New User',
        email: 'new@test.com',
        password: 'pass',
        faculty: 'Ingeniería',
        semester: 3,
        interests: ['Programación'],
      };
      const result = await authService.register(payload);

      expect(api.post).toHaveBeenCalledWith('/auth/register', payload);
      expect(result.token).toBe('xyz789');
      expect(localStorage.getItem('patricia-token')).toBe('xyz789');
    });
  });

  describe('forgotPassword', () => {
    it('calls the forgot-password endpoint', async () => {
      (api.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: {} });
      await authService.forgotPassword('p@test.com');
      expect(api.post).toHaveBeenCalledWith('/auth/forgot-password', { email: 'p@test.com' });
    });
  });

  describe('logout', () => {
    it('removes token and login flag from localStorage', () => {
      localStorage.setItem('patricia-token', 'tok');
      localStorage.setItem('patricia-logged-in', 'true');
      authService.logout();
      expect(localStorage.getItem('patricia-token')).toBeNull();
      expect(localStorage.getItem('patricia-logged-in')).toBeNull();
    });
  });
});
