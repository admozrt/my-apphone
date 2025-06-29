// src/screens/profile/ProfileScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../context/AuthContext';
import { showMessage } from 'react-native-flash-message';

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  action?: () => void;
  hasToggle?: boolean;
  value?: boolean;
}

export const ProfileScreen = ({ navigation }: any) => {
  const { state, signOut } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Konfirmasi Logout',
      'Apakah Anda yakin ingin keluar?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Keluar',
          onPress: signOut,
          style: 'destructive',
        },
      ],
    );
  };

  const menuSections = [
    {
      title: 'Akun',
      items: [
        {
          id: 'edit-profile',
          title: 'Edit Profil',
          icon: 'person',
          action: () => navigation.navigate('EditProfile'),
        },
        {
          id: 'change-password',
          title: 'Ubah Password',
          icon: 'lock',
          action: () => navigation.navigate('ChangePassword'),
        },
        {
          id: 'payment-methods',
          title: 'Metode Pembayaran',
          icon: 'payment',
          action: () => navigation.navigate('PaymentMethods'),
        },
      ],
    },
    {
      title: 'Pengaturan',
      items: [
        {
          id: 'notifications',
          title: 'Notifikasi',
          icon: 'notifications',
          hasToggle: true,
          value: notificationsEnabled,
          action: () => setNotificationsEnabled(!notificationsEnabled),
        },
        {
          id: 'biometric',
          title: 'Login Biometrik',
          icon: 'fingerprint',
          hasToggle: true,
          value: biometricEnabled,
          action: () => setBiometricEnabled(!biometricEnabled),
        },
        {
          id: 'language',
          title: 'Bahasa',
          icon: 'language',
          action: () => navigation.navigate('Language'),
        },
      ],
    },
    {
      title: 'Bantuan',
      items: [
        {
          id: 'help-center',
          title: 'Pusat Bantuan',
          icon: 'help',
          action: () => navigation.navigate('HelpCenter'),
        },
        {
          id: 'terms',
          title: 'Syarat & Ketentuan',
          icon: 'description',
          action: () => navigation.navigate('Terms'),
        },
        {
          id: 'privacy',
          title: 'Kebijakan Privasi',
          icon: 'privacy-tip',
          action: () => navigation.navigate('Privacy'),
        },
        {
          id: 'contact',
          title: 'Hubungi Kami',
          icon: 'mail',
          action: () => navigation.navigate('Contact'),
        },
      ],
    },
  ];

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      className="flex-row items-center justify-between py-4 px-6 bg-white"
      onPress={item.action}
      disabled={item.hasToggle}
    >
      <View className="flex-row items-center flex-1">
        <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
          <Icon name={item.icon} size={20} color="#3B82F6" />
        </View>
        <Text className="ml-4 text-base text-gray-800">{item.title}</Text>
      </View>
      {item.hasToggle ? (
        <Switch
          value={item.value}
          onValueChange={item.action}
          trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
          thumbColor="#fff"
        />
      ) : (
        <Icon name="chevron-right" size={24} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-blue-600 px-6 pt-4 pb-8">
          <Text className="text-white text-xl font-bold text-center mb-6">
            Profil Saya
          </Text>
          
          {/* Profile Info */}
          <View className="items-center">
            <View className="relative">
              <Image 
                source={{ 
                  uri: state.user?.foto_profil || 'https://via.placeholder.com/150' 
                }}
                className="w-24 h-24 rounded-full bg-white"
              />
              <TouchableOpacity 
                className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg"
                onPress={() => navigation.navigate('EditProfile')}
              >
                <Icon name="camera-alt" size={20} color="#3B82F6" />
              </TouchableOpacity>
            </View>
            <Text className="text-white text-lg font-semibold mt-3">
              {state.user?.username || 'Pengguna'}
            </Text>
            <Text className="text-white/80 text-sm">
              {state.user?.email || 'email@example.com'}
            </Text>
            <View className="bg-white/20 px-3 py-1 rounded-full mt-2">
              <Text className="text-white text-xs">
                {state.user?.tipe_pengguna === 'pelanggan' ? 'Member Regular' : state.user?.tipe_pengguna}
              </Text>
            </View>
          </View>
        </View>

        {/* Points Card */}
        <View className="mx-6 -mt-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-4 shadow-lg">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-white/80 text-sm">TMU Points</Text>
              <Text className="text-white text-2xl font-bold">1,250</Text>
            </View>
            <TouchableOpacity className="bg-white/20 px-4 py-2 rounded-full">
              <Text className="text-white text-sm font-medium">Tukar Poin</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Sections */}
        <View className="mt-6">
          {menuSections.map((section, index) => (
            <View key={section.title} className={index > 0 ? 'mt-6' : ''}>
              <Text className="text-sm font-medium text-gray-500 px-6 mb-2">
                {section.title}
              </Text>
              <View className="bg-white">
                {section.items.map((item, itemIndex) => (
                  <View key={item.id}>
                    {renderMenuItem(item)}
                    {itemIndex < section.items.length - 1 && (
                      <View className="h-[1px] bg-gray-100 ml-16" />
                    )}
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          className="mx-6 mt-8 mb-6 bg-red-50 rounded-xl py-4"
          onPress={handleLogout}
        >
          <View className="flex-row items-center justify-center">
            <Icon name="logout" size={20} color="#EF4444" />
            <Text className="ml-2 text-red-600 font-semibold">Keluar</Text>
          </View>
        </TouchableOpacity>

        {/* App Version */}
        <Text className="text-center text-xs text-gray-400 mb-8">
          TMU Ferry v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};