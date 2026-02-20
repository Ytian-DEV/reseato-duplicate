import api, { handleApiError } from './api';

class PaymentService {
  async createPayment(reservationId: string, amount: number, paymentMethod: string) {
    try {
      const response = await api.post('/payments', {
        reservationId,
        amount,
        paymentMethod
      });
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getPayment(reservationId: string) {
    try {
      const response = await api.get(`/payments/${reservationId}`);
      return response.data.data;
    } catch (error) {
      // Payment not found is expected if not paid yet
      return null;
    }
  }
}

export default new PaymentService();
