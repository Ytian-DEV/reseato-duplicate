import api, { handleApiError } from './api';

export interface DashboardStats {
  totalUsers: number;
  totalRestaurants: number;
  totalReservations: number;
  totalRevenue: number;
}

export interface AdminReservation {
  id: string;
  reservation_date: string;
  reservation_time: string;
  guest_count: number;
  status: string;
  user_first_name: string;
  user_last_name: string;
  restaurant_name: string;
  commission: number;
}

export interface AdminRestaurant {
  id: string;
  name: string;
  owner: string;
  isActive: boolean;
  completedReservations: number;
  commissionDue: number;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  joinedAt: string;
  reservationCount: number;
}

class AdminService {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await api.get('/admin/dashboard');
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getAllReservations(status?: string, search?: string): Promise<AdminReservation[]> {
    try {
      const response = await api.get('/admin/reservations', { params: { status, search } });
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async updateReservationStatus(id: string, status: string): Promise<void> {
    try {
      await api.put(`/admin/reservations/${id}/status`, { status });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getAllRestaurants(): Promise<AdminRestaurant[]> {
    try {
      const response = await api.get('/admin/restaurants');
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async markCommissionPaid(id: string): Promise<void> {
    try {
      await api.post(`/admin/restaurants/${id}/payout`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getAllUsers(): Promise<AdminUser[]> {
    try {
      const response = await api.get('/admin/users');
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async toggleUserStatus(id: string): Promise<void> {
    try {
      await api.put(`/admin/users/${id}/toggle-status`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new AdminService();
