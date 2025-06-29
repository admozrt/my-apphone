// src/services/auth.service.ts
import * as SecureStore from 'expo-secure-store';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

interface LoginCredentials {
  login_field: string; // email atau username
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  password_confirmation: string;
  tipe_pengguna?: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  tipe_pengguna: string;
  roles?: string[];
  permissions?: string[];
  google_id?: string;
  foto_profil?: string;
}

interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
  message?: string;
}

class AuthService {
  private readonly API_BASE_URL = __DEV__ 
    ? 'http://192.168.114.244:8000/api' // Ganti dengan IP lokal Anda
    : 'https://your-production-api.com/api';

  // Google OAuth config
  private googleConfig = {
    expoClientId: 'YOUR_EXPO_CLIENT_ID.apps.googleusercontent.com',
    iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
    webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  };

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
        throw new Error(data.message || 'Login gagal');
      }

      // Store token securely
      await SecureStore.setItemAsync('token', data.token);
      await SecureStore.setItemAsync('user', JSON.stringify(data.user));

      return data;
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message === 'Network request failed') {
        throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
      }
      throw error;
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const payload = {
        ...userData,
        tipe_pengguna: 'pelanggan',
        username: userData.email, // username sama dengan email untuk pelanggan
      };

      const response = await fetch(`${this.API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          // Format Laravel validation errors
          const errorMessages = Object.values(data.errors).flat().join('\n');
          throw new Error(errorMessages);
        }
        throw new Error(data.message || 'Registrasi gagal');
      }

      // Store token securely
      await SecureStore.setItemAsync('token', data.token);
      await SecureStore.setItemAsync('user', JSON.stringify(data.user));

      return data;
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.message === 'Network request failed') {
        throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
      }
      throw error;
    }
  }

  async loginWithGoogle(accessToken: string, userInfo: any): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/loginGoogle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          google_access_token: accessToken,
          email: userInfo.email,
          name: userInfo.name,
          given_name: userInfo.given_name,
          sub: userInfo.id,
          picture: userInfo.picture,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Google login gagal');
      }

      // Store token securely
      await SecureStore.setItemAsync('token', data.access_token || data.token);
      await SecureStore.setItemAsync('user', JSON.stringify(data.user));

      return {
        success: true,
        user: data.user,
        token: data.access_token || data.token,
        message: data.message,
      };
    } catch (error: any) {
      console.error('Google login error:', error);
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

      // Parse stored user data
      const storedUser = JSON.parse(userString);

      // Verify token with backend - get user by ID
      const response = await fetch(`${this.API_BASE_URL}/pengguna/${storedUser.id}`, {
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
      return userData.data;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('token');
  }

  // Helper method for API calls with auth
  async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const token = await this.getToken();
    
    if (!token) {
      throw new Error('No authentication token');
    }

    return fetch(`${this.API_BASE_URL}${url}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  }
}

export const authService = new AuthService();