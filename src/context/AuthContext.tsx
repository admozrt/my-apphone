// src/context/AuthContext.tsx
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { authService } from '../services/auth.service';
import { showMessage } from 'react-native-flash-message';

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

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

type AuthAction = 
  | { type: 'LOADING'; payload: boolean }
  | { type: 'SIGN_IN_SUCCESS'; payload: User }
  | { type: 'SIGN_OUT' }
  | { type: 'ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

const AuthContext = createContext<{
  state: AuthState;
  signIn: (loginField: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  signInWithGoogle: (accessToken: string, userInfo: any) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
} | null>(null);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, isLoading: action.payload, error: null };
    case 'SIGN_IN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'SIGN_OUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Check auth state on app start
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      dispatch({ type: 'LOADING', payload: true });
      const user = await authService.getCurrentUser();
      
      if (user) {
        dispatch({ type: 'SIGN_IN_SUCCESS', payload: user });
      } else {
        dispatch({ type: 'SIGN_OUT' });
      }
    } catch (error) {
      console.error('Check auth state error:', error);
      dispatch({ type: 'SIGN_OUT' });
    } finally {
      dispatch({ type: 'LOADING', payload: false });
    }
  };

  const signIn = async (loginField: string, password: string) => {
    try {
      dispatch({ type: 'LOADING', payload: true });
      const response = await authService.login({ 
        login_field: loginField, 
        password 
      });
      
      dispatch({ type: 'SIGN_IN_SUCCESS', payload: response.user });
      
      showMessage({
        message: 'Login Berhasil',
        description: `Selamat datang, ${response.user.username}!`,
        type: 'success',
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Login gagal';
      dispatch({ type: 'ERROR', payload: errorMessage });
      
      showMessage({
        message: 'Login Gagal',
        description: errorMessage,
        type: 'danger',
      });
    }
  };

  const signUp = async (name: string, email: string, password: string, passwordConfirmation: string) => {
    try {
      dispatch({ type: 'LOADING', payload: true });
      const response = await authService.register({
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      
      dispatch({ type: 'SIGN_IN_SUCCESS', payload: response.user });
      
      showMessage({
        message: 'Registrasi Berhasil',
        description: `Selamat datang di TMU Ferry!`,
        type: 'success',
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Registrasi gagal';
      dispatch({ type: 'ERROR', payload: errorMessage });
      
      showMessage({
        message: 'Registrasi Gagal',
        description: errorMessage,
        type: 'danger',
      });
    }
  };

  const signInWithGoogle = async (accessToken: string, userInfo: any) => {
    try {
      dispatch({ type: 'LOADING', payload: true });
      const response = await authService.loginWithGoogle(accessToken, userInfo);
      
      dispatch({ type: 'SIGN_IN_SUCCESS', payload: response.user });
      
      showMessage({
        message: 'Login Berhasil',
        description: `Selamat datang, ${response.user.username}!`,
        type: 'success',
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Google login gagal';
      dispatch({ type: 'ERROR', payload: errorMessage });
      
      showMessage({
        message: 'Login Gagal',
        description: errorMessage,
        type: 'danger',
      });
    }
  };

  const signOut = async () => {
    try {
      dispatch({ type: 'LOADING', payload: true });
      await authService.logout();
      dispatch({ type: 'SIGN_OUT' });
      
      showMessage({
        message: 'Logout Berhasil',
        description: 'Sampai jumpa lagi!',
        type: 'info',
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      // Even if API call fails, still sign out locally
      dispatch({ type: 'SIGN_OUT' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider value={{ state, signIn, signUp, signInWithGoogle, signOut, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};