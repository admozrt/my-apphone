// src/screens/home/HomeScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  RefreshControl,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../context/AuthContext';
import { showMessage } from 'react-native-flash-message';
import DatePicker from 'react-native-date-picker';

// Dummy data for popular routes
const popularRoutes = [
  {
    id: '1',
    from: 'Banjarmasin',
    to: 'Pulau Laut',
    price: 'Rp 45.000',
    duration: '2 jam',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '2',
    from: 'Banjarmasin',
    to: 'Kotabaru',
    price: 'Rp 65.000',
    duration: '3 jam',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '3',
    from: 'Banjarmasin',
    to: 'Sampit',
    price: 'Rp 120.000',
    duration: '5 jam',
    image: 'https://via.placeholder.com/150',
  },
];

// Dummy promo data
const promos = [
  {
    id: '1',
    title: 'Diskon 20%',
    description: 'Untuk pembelian tiket PP',
    code: 'PULANGPERGI20',
    color: '#3B82F6',
  },
  {
    id: '2',
    title: 'Gratis Bagasi',
    description: 'Tambahan 10kg bagasi gratis',
    code: 'BAGASIGRATIS',
    color: '#10B981',
  },
];

export const HomeScreen = ({ navigation }: any) => {
  const { state } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [passengers, setPassengers] = useState(1);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleSearch = () => {
    if (!origin || !destination) {
      showMessage({
        message: 'Error',
        description: 'Silakan pilih asal dan tujuan',
        type: 'danger',
      });
      return;
    }

    navigation.navigate('SearchResults', {
      origin,
      destination,
      date: date.toISOString(),
      passengers,
    });
  };

  const swapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="bg-blue-600 px-6 pt-4 pb-20 rounded-b-3xl">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-white text-sm opacity-90">Selamat datang,</Text>
              <Text className="text-white text-xl font-bold">
                {state.user?.username || 'Pengguna'}
              </Text>
            </View>
            <TouchableOpacity 
              className="bg-white/20 p-2 rounded-full"
              onPress={() => navigation.navigate('Notifications')}
            >
              <Icon name="notifications" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Card */}
        <View className="mx-6 -mt-12 bg-white rounded-2xl shadow-lg p-4">
          {/* Origin & Destination */}
          <View className="space-y-3">
            <View>
              <Text className="text-xs text-gray-500 mb-1">Dari</Text>
              <TouchableOpacity 
                className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3"
                onPress={() => navigation.navigate('SelectLocation', { 
                  type: 'origin',
                  onSelect: setOrigin 
                })}
              >
                <Icon name="my-location" size={20} color="#6B7280" />
                <Text className={`flex-1 ml-3 ${origin ? 'text-gray-800' : 'text-gray-400'}`}>
                  {origin || 'Pilih lokasi asal'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Swap Button */}
            <View className="items-center -my-2">
              <TouchableOpacity 
                className="bg-blue-100 p-2 rounded-full"
                onPress={swapLocations}
              >
                <Icon name="swap-vert" size={20} color="#3B82F6" />
              </TouchableOpacity>
            </View>

            <View>
              <Text className="text-xs text-gray-500 mb-1">Ke</Text>
              <TouchableOpacity 
                className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3"
                onPress={() => navigation.navigate('SelectLocation', { 
                  type: 'destination',
                  onSelect: setDestination 
                })}
              >
                <Icon name="location-on" size={20} color="#6B7280" />
                <Text className={`flex-1 ml-3 ${destination ? 'text-gray-800' : 'text-gray-400'}`}>
                  {destination || 'Pilih lokasi tujuan'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Date & Passengers */}
          <View className="flex-row mt-4 space-x-3">
            <TouchableOpacity 
              className="flex-1 bg-gray-50 rounded-xl px-4 py-3"
              onPress={() => setShowDatePicker(true)}
            >
              <View className="flex-row items-center">
                <Icon name="calendar-today" size={20} color="#6B7280" />
                <View className="ml-3">
                  <Text className="text-xs text-gray-500">Tanggal</Text>
                  <Text className="text-sm text-gray-800">
                    {date.toLocaleDateString('id-ID', { 
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <View className="bg-gray-50 rounded-xl px-4 py-3">
              <View className="flex-row items-center">
                <Icon name="person" size={20} color="#6B7280" />
                <View className="ml-3">
                  <Text className="text-xs text-gray-500">Penumpang</Text>
                  <View className="flex-row items-center">
                    <TouchableOpacity 
                      onPress={() => setPassengers(Math.max(1, passengers - 1))}
                      className="pr-2"
                    >
                      <Icon name="remove-circle-outline" size={20} color="#3B82F6" />
                    </TouchableOpacity>
                    <Text className="text-sm text-gray-800 mx-1">{passengers}</Text>
                    <TouchableOpacity 
                      onPress={() => setPassengers(passengers + 1)}
                      className="pl-2"
                    >
                      <Icon name="add-circle-outline" size={20} color="#3B82F6" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Search Button */}
          <TouchableOpacity
            className="bg-blue-600 rounded-xl py-4 mt-4"
            onPress={handleSearch}
          >
            <Text className="text-white text-center font-semibold">
              Cari Tiket
            </Text>
          </TouchableOpacity>
        </View>

        {/* Promo Section */}
        <View className="mt-8 px-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Promo Spesial
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="space-x-3"
          >
            {promos.map((promo) => (
              <TouchableOpacity
                key={promo.id}
                className="w-64 rounded-xl p-4 mr-3"
                style={{ backgroundColor: promo.color }}
                onPress={() => showMessage({
                  message: 'Kode Promo',
                  description: `Gunakan kode: ${promo.code}`,
                  type: 'info',
                })}
              >
                <Text className="text-white font-bold text-lg">{promo.title}</Text>
                <Text className="text-white/90 text-sm mt-1">{promo.description}</Text>
                <View className="flex-row items-center mt-3">
                  <Text className="text-white/80 text-xs">Kode: </Text>
                  <Text className="text-white font-bold text-xs">{promo.code}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Popular Routes */}
        <View className="mt-8 px-6 pb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Rute Populer
          </Text>
          {popularRoutes.map((route) => (
            <TouchableOpacity
              key={route.id}
              className="bg-white rounded-xl p-4 mb-3 flex-row items-center"
              onPress={() => {
                setOrigin(route.from);
                setDestination(route.to);
              }}
            >
              <Image 
                source={{ uri: route.image }}
                className="w-16 h-16 rounded-lg"
              />
              <View className="flex-1 ml-4">
                <View className="flex-row items-center">
                  <Text className="text-sm text-gray-800">{route.from}</Text>
                  <Icon name="arrow-forward" size={16} color="#6B7280" />
                  <Text className="text-sm text-gray-800">{route.to}</Text>
                </View>
                <View className="flex-row items-center mt-1">
                  <Icon name="access-time" size={14} color="#6B7280" />
                  <Text className="text-xs text-gray-500 ml-1">{route.duration}</Text>
                </View>
              </View>
              <View>
                <Text className="text-blue-600 font-bold">{route.price}</Text>
                <Text className="text-xs text-gray-500">per orang</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Date Picker Modal */}
      <DatePicker
        modal
        open={showDatePicker}
        date={date}
        mode="date"
        minimumDate={new Date()}
        onConfirm={(date) => {
          setShowDatePicker(false);
          setDate(date);
        }}
        onCancel={() => {
          setShowDatePicker(false);
        }}
        title="Pilih Tanggal"
        confirmText="Pilih"
        cancelText="Batal"
      />
    </SafeAreaView>
  );
};