// src/screens/booking/BookingHistoryScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { showMessage } from 'react-native-flash-message';

// Dummy booking data
const bookingData = [
  {
    id: '1',
    bookingCode: 'TMU-2024-001',
    date: '2024-01-15',
    time: '08:00',
    from: 'Banjarmasin',
    to: 'Pulau Laut',
    vessel: 'KM Express Barito',
    passengers: 2,
    totalPrice: 90000,
    status: 'completed',
  },
  {
    id: '2',
    bookingCode: 'TMU-2024-002',
    date: '2024-01-20',
    time: '10:00',
    from: 'Banjarmasin',
    to: 'Kotabaru',
    vessel: 'KM Dharma Ferry',
    passengers: 1,
    totalPrice: 65000,
    status: 'active',
  },
  {
    id: '3',
    bookingCode: 'TMU-2024-003',
    date: '2024-01-10',
    time: '14:00',
    from: 'Banjarmasin',
    to: 'Sampit',
    vessel: 'KM Lambung Mangkurat',
    passengers: 3,
    totalPrice: 360000,
    status: 'cancelled',
  },
];

const tabs = [
  { id: 'all', label: 'Semua' },
  { id: 'active', label: 'Aktif' },
  { id: 'completed', label: 'Selesai' },
  { id: 'cancelled', label: 'Dibatalkan' },
];

export const BookingHistoryScreen = ({ navigation }: any) => {
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return { bg: 'bg-green-100', text: 'text-green-700' };
      case 'completed':
        return { bg: 'bg-blue-100', text: 'text-blue-700' };
      case 'cancelled':
        return { bg: 'bg-red-100', text: 'text-red-700' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700' };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'completed':
        return 'Selesai';
      case 'cancelled':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  const filteredBookings = activeTab === 'all' 
    ? bookingData 
    : bookingData.filter(booking => booking.status === activeTab);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      showMessage({
        message: 'Berhasil',
        description: 'Data pemesanan berhasil diperbarui',
        type: 'success',
      });
    }, 2000);
  }, []);

  const renderBookingItem = ({ item }: { item: typeof bookingData[0] }) => {
    const statusStyle = getStatusColor(item.status);
    
    return (
      <TouchableOpacity
        className="bg-white rounded-xl p-4 mb-3 shadow-sm"
        onPress={() => navigation.navigate('BookingDetail', { booking: item })}
      >
        {/* Header */}
        <View className="flex-row justify-between items-start mb-3">
          <View>
            <Text className="text-xs text-gray-500">Kode Booking</Text>
            <Text className="text-sm font-semibold text-gray-800">{item.bookingCode}</Text>
          </View>
          <View className={`px-3 py-1 rounded-full ${statusStyle.bg}`}>
            <Text className={`text-xs font-medium ${statusStyle.text}`}>
              {getStatusText(item.status)}
            </Text>
          </View>
        </View>

        {/* Route Info */}
        <View className="flex-row items-center mb-3">
          <View className="flex-1">
            <Text className="text-xs text-gray-500">Dari</Text>
            <Text className="text-sm font-medium text-gray-800">{item.from}</Text>
          </View>
          <Icon name="arrow-forward" size={20} color="#6B7280" />
          <View className="flex-1">
            <Text className="text-xs text-gray-500">Ke</Text>
            <Text className="text-sm font-medium text-gray-800">{item.to}</Text>
          </View>
        </View>

        {/* Details */}
        <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
          <View className="flex-row items-center">
            <Icon name="calendar-today" size={16} color="#6B7280" />
            <Text className="text-xs text-gray-600 ml-1">
              {new Date(item.date).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </Text>
            <Text className="text-xs text-gray-600 ml-2">{item.time}</Text>
          </View>
          <Text className="text-sm font-bold text-blue-600">
            Rp {item.totalPrice.toLocaleString('id-ID')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 shadow-sm">
        <Text className="text-xl font-bold text-gray-800">Riwayat Pemesanan</Text>
      </View>

      {/* Tabs */}
      <View className="bg-white">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="px-6 py-3"
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              className={`mr-4 px-4 py-2 rounded-full ${
                activeTab === tab.id ? 'bg-blue-600' : 'bg-gray-100'
              }`}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text className={`text-sm font-medium ${
                activeTab === tab.id ? 'text-white' : 'text-gray-600'
              }`}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Booking List */}
      <FlatList
        data={filteredBookings}
        renderItem={renderBookingItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Icon name="receipt-long" size={64} color="#D1D5DB" />
            <Text className="text-gray-500 mt-4 text-center">
              Tidak ada riwayat pemesanan
            </Text>
            <TouchableOpacity
              className="bg-blue-600 rounded-xl px-6 py-3 mt-4"
              onPress={() => navigation.navigate('Home')}
            >
              <Text className="text-white font-medium">Pesan Tiket</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
};