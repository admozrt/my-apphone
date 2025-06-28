// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';

// Import screens
import { LoginScreen } from '../screens/auth/LoginScreen';
import { Icon } from 'react-native-vector-icons/Icon';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// const MainTabNavigator = () => {
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         tabBarActiveTintColor: '#007AFF',
//         headerShown: false,
//       }}
//     >
//       <Tab.Screen 
//         name="Home" 
//         component={HomeScreen}
//         options={{
//           tabBarLabel: 'Beranda',
//           tabBarIcon: ({ color, size }) => (
//             <Icon name="home" size={size} color={color} />
//           ),
//         }}
//       />
//       <Tab.Screen 
//         name="History" 
//         component={BookingHistoryScreen}
//         options={{
//           tabBarLabel: 'Riwayat',
//           tabBarIcon: ({ color, size }) => (
//             <Icon name="history" size={size} color={color} />
//           ),
//         }}
//       />
//       <Tab.Screen 
//         name="Profile" 
//         component={ProfileScreen}
//         options={{
//           tabBarLabel: 'Profil',
//           tabBarIcon: ({ color, size }) => (
//             <Icon name="person" size={size} color={color} />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// };

export const AppNavigator = () => {
  const { state } = useAuth();

//   if (state.isLoading) {
//     return <LoadingScreen />;
//   }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {state.isAuthenticated ? (
          <>
            {/* <Stack.Screen name="MainTab" component={MainTabNavigator} />
            <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
            <Stack.Screen name="Booking" component={BookingScreen} /> */}
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};