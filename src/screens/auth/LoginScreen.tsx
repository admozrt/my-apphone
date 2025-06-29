// src/screens/auth/LoginScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useAuth } from '../../context/AuthContext';
import { showMessage } from 'react-native-flash-message';

WebBrowser.maybeCompleteAuthSession();

export const LoginScreen = ({ navigation }: any) => {
  const [loginField, setLoginField] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { state, signIn, clearError } = useAuth();

  // Google Sign In setup
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '987489638054-91v64gitgegmf93t2tiu7b1ld0075jpf.apps.googleusercontent.com',
  });

  // Handle Google Sign In response
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleSignIn(id_token);
    }
  }, [response]);

  // Clear error when component unmounts or when user starts typing
  useEffect(() => {
    return () => clearError();
  }, []);

  useEffect(() => {
    if (loginField || password) {
      clearError();
    }
  }, [loginField, password]);

  const handleLogin = async () => {
    if (!loginField.trim()) {
      showMessage({
        message: 'Error',
        description: 'Email atau username tidak boleh kosong',
        type: 'danger',
      });
      return;
    }
    
    if (!password.trim()) {
      showMessage({
        message: 'Error',
        description: 'Password tidak boleh kosong',
        type: 'danger',
      });
      return;
    }

    await signIn(loginField.trim(), password);
  };

  const handleGoogleSignIn = async (idToken: string) => {
    try {
      // TODO: Implement Google sign in with backend
      showMessage({
        message: 'Info',
        description: 'Google Sign In akan segera tersedia',
        type: 'info',
      });
    } catch (error) {
      showMessage({
        message: 'Error',
        description: 'Google Sign In gagal',
        type: 'danger',
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          className="flex-1"
        >
          <View className="flex-1 px-6 justify-center">
            {/* Logo & Header */}
            <View className="items-center mb-10">
              <View className="w-20 h-20 bg-blue-600 rounded-full items-center justify-center mb-4">
                <Icon name="directions-boat" size={40} color="#fff" />
              </View>
              <Text className="text-3xl font-bold text-gray-800">TMU Ferry</Text>
              <Text className="text-base text-gray-500 mt-2">Masuk untuk melanjutkan</Text>
            </View>

            {/* Form */}
            <View className="space-y-4">
              {/* Email/Username Input */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Email atau Username
                </Text>
                <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                  <Icon name="person" size={20} color="#6B7280" />
                  <TextInput
                    className="flex-1 ml-3 text-base text-gray-800"
                    placeholder="Masukkan email atau username"
                    placeholderTextColor="#9CA3AF"
                    value={loginField}
                    onChangeText={setLoginField}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!state.isLoading}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Password
                </Text>
                <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                  <Icon name="lock" size={20} color="#6B7280" />
                  <TextInput
                    className="flex-1 ml-3 text-base text-gray-800"
                    placeholder="Masukkan password"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    editable={!state.isLoading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="p-1"
                  >
                    <Icon 
                      name={showPassword ? "visibility" : "visibility-off"} 
                      size={20} 
                      color="#6B7280" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity 
                className="self-end"
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <Text className="text-blue-600 text-sm font-medium">
                  Lupa Password?
                </Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                className={`bg-blue-600 rounded-xl py-4 items-center mt-6 ${
                  (!loginField || !password || state.isLoading) ? 'opacity-50' : ''
                }`}
                onPress={handleLogin}
                disabled={!loginField || !password || state.isLoading}
              >
                {state.isLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text className="text-white text-base font-semibold">
                    Masuk
                  </Text>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center my-6">
                <View className="flex-1 h-[1px] bg-gray-200" />
                <Text className="mx-4 text-gray-500 text-sm">atau</Text>
                <View className="flex-1 h-[1px] bg-gray-200" />
              </View>

              {/* Google Sign In Button */}
              <TouchableOpacity
                className="flex-row items-center justify-center bg-white border border-gray-300 rounded-xl py-4"
                onPress={() => promptAsync()}
                disabled={!request}
              >
                <Image 
                  source={{ uri: 'https://www.google.com/favicon.ico' }}
                  className="w-5 h-5 mr-3"
                />
                <Text className="text-gray-700 text-base font-medium">
                  Masuk dengan Google
                </Text>
              </TouchableOpacity>
            </View>

            {/* Register Link */}
            <View className="flex-row justify-center items-center mt-8">
              <Text className="text-gray-600 text-base">
                Belum punya akun?{' '}
              </Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Register')}
                disabled={state.isLoading}
              >
                <Text className="text-blue-600 text-base font-semibold">
                  Daftar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};