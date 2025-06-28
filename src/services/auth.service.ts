// src/services/auth.service.ts
import * as SecureStore from 'expo-secure-store';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthResponse {
  user: User;
  token: string;
  expires_at: string;
}

class AuthService {
  private readonly API_BASE_URL = __DEV__ 
    ? 'http://localhost:8000/api' // Laravel backend
    : 'https://your-production-api.com/api';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token securely
      await SecureStore.setItemAsync('token', data.token);
      await SecureStore.setItemAsync('user', JSON.stringify(data.user));

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store token securely
      await SecureStore.setItemAsync('token', data.token);
      await SecureStore.setItemAsync('user', JSON.stringify(data.user));

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      const token = await SecureStore.getItemAsync('token');
      
      if (token) {
        await fetch(`${this.API_BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('user');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = await SecureStore.getItemAsync('token');
      const userString = await SecureStore.getItemAsync('user');

      if (!token || !userString) {
        return null;
      }

      // Verify token with backend
      const response = await fetch(`${this.API_BASE_URL}/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        // Token invalid, clear storage
        await this.logout();
        return null;
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async refreshToken(): Promise<string | null> {
    try {
      const token = await SecureStore.getItemAsync('token');
      
      if (!token) return null;

      const response = await fetch(`${this.API_BASE_URL}/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        await this.logout();
        return null;
      }

      const data = await response.json();
      await SecureStore.setItemAsync('token', data.token);
      
      return data.token;
    } catch (error) {
      console.error('Refresh token error:', error);
      return null;
    }
  }

  // Simple Google Sign-in alternative (tanpa expo-auth-session)
  async googleSignIn(): Promise<AuthResponse> {
    try {
      // Placeholder - bisa integrate dengan Google Sign-In library lain
      // atau redirect ke webview
      throw new Error('Google Sign-in will be implemented later');
    } catch (error) {
      console.error('Google Sign-in error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();