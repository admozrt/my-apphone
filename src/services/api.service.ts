// src/services/api.service.ts
import { authService } from './auth.service';

class ApiService {
  private readonly BASE_URL = __DEV__ 
    ? 'http://192.168.1.100:8000/api' // Ganti dengan IP lokal Anda
    : 'https://your-production-api.com/api';

  // Ferry/Boat Routes
  async getRoutes() {
    try {
      const response = await authService.authenticatedFetch('/routes');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch routes');
      }
      
      return data;
    } catch (error) {
      console.error('Get routes error:', error);
      throw error;
    }
  }

  async searchSchedules(params: {
    origin: string;
    destination: string;
    date: string;
    passengers: number;
  }) {
    try {
      const queryParams = new URLSearchParams({
        origin: params.origin,
        destination: params.destination,
        date: params.date,
        passengers: params.passengers.toString(),
      });

      const response = await authService.authenticatedFetch(`/schedules/search?${queryParams}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to search schedules');
      }
      
      return data;
    } catch (error) {
      console.error('Search schedules error:', error);
      throw error;
    }
  }

  // Bookings
  async createBooking(bookingData: {
    schedule_id: string;
    passengers: Array<{
      name: string;
      id_number: string;
      type: 'adult' | 'child';
    }>;
    contact: {
      name: string;
      email: string;
      phone: string;
    };
    promo_code?: string;
  }) {
    try {
      const response = await authService.authenticatedFetch('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create booking');
      }
      
      return data;
    } catch (error) {
      console.error('Create booking error:', error);
      throw error;
    }
  }

  async getBookings(status?: 'active' | 'completed' | 'cancelled') {
    try {
      const queryParams = status ? `?status=${status}` : '';
      const response = await authService.authenticatedFetch(`/bookings${queryParams}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch bookings');
      }
      
      return data;
    } catch (error) {
      console.error('Get bookings error:', error);
      throw error;
    }
  }

  async getBookingDetail(bookingId: string) {
    try {
      const response = await authService.authenticatedFetch(`/bookings/${bookingId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch booking detail');
      }
      
      return data;
    } catch (error) {
      console.error('Get booking detail error:', error);
      throw error;
    }
  }

  async cancelBooking(bookingId: string, reason?: string) {
    try {
      const response = await authService.authenticatedFetch(`/bookings/${bookingId}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to cancel booking');
      }
      
      return data;
    } catch (error) {
      console.error('Cancel booking error:', error);
      throw error;
    }
  }

  // User Profile
  async updateProfile(profileData: {
    name?: string;
    phone?: string;
    address?: string;
    foto_profil?: string;
  }) {
    try {
      const response = await authService.authenticatedFetch('/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }
      
      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  async changePassword(passwords: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }) {
    try {
      const response = await authService.authenticatedFetch('/profile/password', {
        method: 'PUT',
        body: JSON.stringify(passwords),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }
      
      return data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  // Payment
  async createPayment(paymentData: {
    booking_id: string;
    payment_method: string;
    amount: number;
  }) {
    try {
      const response = await authService.authenticatedFetch('/payments', {
        method: 'POST',
        body: JSON.stringify(paymentData),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create payment');
      }
      
      return data;
    } catch (error) {
      console.error('Create payment error:', error);
      throw error;
    }
  }

  async getPaymentStatus(paymentId: string) {
    try {
      const response = await authService.authenticatedFetch(`/payments/${paymentId}/status`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch payment status');
      }
      
      return data;
    } catch (error) {
      console.error('Get payment status error:', error);
      throw error;
    }
  }

  // Promos
  async getPromos() {
    try {
      const response = await authService.authenticatedFetch('/promos');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch promos');
      }
      
      return data;
    } catch (error) {
      console.error('Get promos error:', error);
      throw error;
    }
  }

  async validatePromoCode(code: string) {
    try {
      const response = await authService.authenticatedFetch('/promos/validate', {
        method: 'POST',
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Invalid promo code');
      }
      
      return data;
    } catch (error) {
      console.error('Validate promo code error:', error);
      throw error;
    }
  }

  // Notifications
  async getNotifications() {
    try {
      const response = await authService.authenticatedFetch('/notifications');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch notifications');
      }
      
      return data;
    } catch (error) {
      console.error('Get notifications error:', error);
      throw error;
    }
  }

  async markNotificationAsRead(notificationId: string) {
    try {
      const response = await authService.authenticatedFetch(`/notifications/${notificationId}/read`, {
        method: 'PUT',
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to mark notification as read');
      }
      
      return data;
    } catch (error) {
      console.error('Mark notification as read error:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();