// src/screens/LoadingScreen.tsx
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const LoadingScreen = () => {
  return (
    <View className="flex-1 bg-blue-600 items-center justify-center">
      <View className="items-center">
        <View className="w-32 h-32 bg-white rounded-full items-center justify-center mb-8 shadow-lg">
          <Icon name="directions-boat" size={64} color="#2563EB" />
        </View>
        <Text className="text-white text-3xl font-bold mb-2">TMU Ferry</Text>
        <Text className="text-white/80 text-base mb-8">Booking Made Easy</Text>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    </View>
  );
};