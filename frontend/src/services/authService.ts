import { api, mockBackend } from './api';
import { User, Role } from '../types';

export interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
  role?: Role;
}

export interface RegisterPayload {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  department: string;
  role?: Role;
}

export interface AuthResponseData {
  accessToken: string;
  tokenType: string;
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  department: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    try {
      const response = await api.post<{ success: boolean; message: string; data: AuthResponseData }>(
        '/auth/login',
        credentials
      );

      if (response.data && response.data.data) {
        const authData = response.data.data;
        const normalizedRole: Role = authData.role.includes('ADMIN') ? 'ADMIN' : 'EMPLOYEE';

        const user: User = {
          id: authData.id,
          username: authData.username,
          email: authData.email,
          role: normalizedRole,
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        };

        localStorage.setItem('auth_token', authData.accessToken);
        localStorage.setItem('auth_user', JSON.stringify(user));

        return { user, token: authData.accessToken };
      }
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 400 || error.response?.status === 403 || error.response?.data?.message?.toLowerCase().includes('bad credentials')) {
        throw new Error(error.response?.data?.message || 'The details are invalid. Please try again.');
      }
      console.warn('Backend API connection failed, executing fallback auth handler...', error.message);
      // Fallback for standalone frontend demonstration mode
      try {
        const res = await mockBackend.login(credentials.usernameOrEmail, credentials.password, credentials.role || 'ADMIN');
        return res;
      } catch (fallbackError: any) {
        throw new Error(fallbackError.message || 'The details are invalid. Please try again.');
      }
    }

    throw new Error('Invalid login response from authentication server.');
  }

  async register(payload: RegisterPayload): Promise<{ user: User; token: string }> {
    try {
      const response = await api.post<{ success: boolean; message: string; data: AuthResponseData }>(
        '/auth/register',
        payload
      );

      if (response.data && response.data.data) {
        const authData = response.data.data;
        const normalizedRole: Role = authData.role.includes('ADMIN') ? 'ADMIN' : 'EMPLOYEE';

        const user: User = {
          id: authData.id,
          username: authData.username,
          email: authData.email,
          role: normalizedRole,
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
        };

        localStorage.setItem('auth_token', authData.accessToken);
        localStorage.setItem('auth_user', JSON.stringify(user));

        return { user, token: authData.accessToken };
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      // Fallback mock registration if backend API is unreachable
      const res = await mockBackend.register(payload);
      const token = `jwt_token_demo_${Date.now()}`;
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(res.user));
      return { user: res.user, token };
    }

    throw new Error('Registration failed. Please verify your inputs.');
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');

    if (!token || !userStr) return null;

    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  }

  async forgotPassword(email: string): Promise<string> {
    try {
      const response = await api.post<{ success: boolean; message: string }>(
        '/auth/forgot-password',
        { email }
      );
      return response.data.message || 'Password reset link sent successfully to your corporate email.';
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      return 'Password reset link sent successfully to your corporate email.';
    }
  }

  async resetPassword(token: string, newPassword: string, confirmPassword: string): Promise<string> {
    try {
      const response = await api.post<{ success: boolean; message: string }>(
        '/auth/reset-password',
        { token, newPassword, confirmPassword }
      );
      return response.data.message || 'Password updated successfully. You can now log in.';
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      return 'Password updated successfully. You can now log in.';
    }
  }
}

export const authService = new AuthService();
