import api, { handleApiError } from './api';
import { Reservation, CreateReservationDTO, TimeSlot, ReservationStatus } from '../../../shared/types';

class ReservationService {
  async createReservation(data: CreateReservationDTO): Promise<Reservation> {
    try {
      const response = await api.post('/reservations', data);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getMyReservations(): Promise<Reservation[]> {
    try {
      const response = await api.get('/reservations/my-reservations');
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getAvailableTimeSlots(
    restaurantId: string,
    date: string,
    guestCount: number
  ): Promise<TimeSlot[]> {
    try {
      const response = await api.get('/reservations/availability', {
        params: { restaurantId, date, guestCount }
      });
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async cancelReservation(id: string): Promise<Reservation> {
    try {
      const response = await api.put(`/reservations/${id}/cancel`);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Vendor methods
  async getRestaurantReservations(restaurantId: string, date?: string): Promise<Reservation[]> {
    try {
      const params = date ? { date } : {};
      const response = await api.get(`/reservations/restaurant/${restaurantId}`, { params });
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async updateReservationStatus(id: string, status: ReservationStatus): Promise<Reservation> {
    try {
      const response = await api.put(`/reservations/${id}/status`, { status });
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new ReservationService();