// src/screens/auth/RegisterScreen.tsx
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../context/AuthContext';
import { showMessage } from 'react-native-flash-message';

export const RegisterScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  
  const { state, signUp, clearError } = useAuth();

  // Clear error when component unmounts or when user starts typing
  useEffect(() => {
    return () => clearError();
  }, []);

  useEffect(() => {
    if (email || password || passwordConfirmation) {
      clearError();
    }
  }, [email, password, passwordConfirmation]);

  const handleRegister = async () => {
    // Validasi
    if (!email.trim()) {
      showMessage({
        message: 'Error',
        description: 'Email tidak boleh kosong',
        type: 'danger',
      });
      return;
    }

    if (!isValidEmail(email)) {
      showMessage({
        message: 'Error',
        description: 'Format email tidak valid',
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

    if (password.length < 8) {
      showMessage({
        message: 'Error',
        description: 'Password minimal 8 karakter',
        type: 'danger',
      });
      return;
    }

    if (password !== passwordConfirmation) {
      showMessage({
        message: 'Error',
        description: 'Konfirmasi password tidak cocok',
        type: 'danger',
      });
      return;
    }

    // Register dengan email sebagai nama sementara
    await signUp(email.split('@')[0], email.trim(), password, passwordConfirmation);
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
          <View className="flex-1 px-6 py-8">
            {/* Back Button */}
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              className="flex-row items-center mb-6"
            >
              <Icon name="arrow-back" size={24} color="#374151" />
              <Text className="ml-2 text-gray-700 text-base">Kembali</Text>
            </TouchableOpacity>

            {/* Header */}
            <View className="mb-8">
              <Text className="text-3xl font-bold text-gray-800">Daftar Akun</Text>
              <Text className="text-base text-gray-500 mt-2">
                Buat akun untuk memesan tiket ferry
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-4">
              {/* Email Input */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Email
                </Text>
                <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                  <Icon name="email" size={20} color="#6B7280" />
                  <TextInput
                    className="flex-1 ml-3 text-base text-gray-800"
                    placeholder="email@example.com"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!state.isLoading}
                  />
                  {email && isValidEmail(email) && (
                    <Icon name="check-circle" size={20} color="#10B981" />
                  )}
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
                    placeholder="Minimal 8 karakter"
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
                {password && password.length < 8 && (
                  <Text className="text-red-500 text-xs mt-1">
                    Password minimal 8 karakter
                  </Text>
                )}
              </View>

              {/* Password Confirmation Input */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Konfirmasi Password
                </Text>
                <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                  <Icon name="lock" size={20} color="#6B7280" />
                  <TextInput
                    className="flex-1 ml-3 text-base text-gray-800"
                    placeholder="Ulangi password"
                    placeholderTextColor="#9CA3AF"
                    value={passwordConfirmation}
                    onChangeText={setPasswordConfirmation}
                    secureTextEntry={!showPasswordConfirmation}
                    editable={!state.isLoading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                    className="p-1"
                  >
                    <Icon 
                      name={showPasswordConfirmation ? "visibility" : "visibility-off"} 
                      size={20} 
                      color="#6B7280" 
                    />
                  </TouchableOpacity>
                </View>
                {passwordConfirmation && password !== passwordConfirmation && (
                  <Text className="text-red-500 text-xs mt-1">
                    Password tidak cocok
                  </Text>
                )}
              </View>

              {/* Terms and Conditions */}
              <View className="mt-4">
                <Text className="text-sm text-gray-600 text-center">
                  Dengan mendaftar, Anda menyetujui{' '}
                  <Text className="text-blue-600 font-medium">Syarat & Ketentuan</Text>
                  {' '}dan{' '}
                  <Text className="text-blue-600 font-medium">Kebijakan Privasi</Text>
                </Text>
              </View>

              {/* Register Button */}
              <TouchableOpacity
                className={`bg-blue-600 rounded-xl py-4 items-center mt-6 ${
                  (!email || !password || !passwordConfirmation || 
                   !isValidEmail(email) || password.length < 8 || 
                   password !== passwordConfirmation || state.isLoading) ? 'opacity-50' : ''
                }`}
                onPress={handleRegister}
                disabled={
                  !email || !password || !passwordConfirmation ||
                  !isValidEmail(email) || password.length < 8 ||
                  password !== passwordConfirmation || state.isLoading
                }
              >
                {state.isLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text className="text-white text-base font-semibold">
                    Daftar
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Login Link */}
            <View className="flex-row justify-center items-center mt-8">
              <Text className="text-gray-600 text-base">
                Sudah punya akun?{' '}
              </Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Login')}
                disabled={state.isLoading}
              >
                <Text className="text-blue-600 text-base font-semibold">
                  Masuk
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};