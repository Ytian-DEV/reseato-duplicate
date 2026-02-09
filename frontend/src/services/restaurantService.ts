import api, { handleApiError } from './api';
import { Restaurant, RestaurantFilters } from '../../../shared/types';

class RestaurantService {
  async getAllRestaurants(filters?: RestaurantFilters): Promise<Restaurant[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.cuisine) params.append('cuisine', filters.cuisine);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.rating) params.append('rating', filters.rating.toString());
      if (filters?.openNow) params.append('openNow', 'true');

      const response = await api.get(`/restaurants?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getRestaurantById(id: string): Promise<Restaurant> {
    try {
      const response = await api.get(`/restaurants/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getMyRestaurant(): Promise<Restaurant> {
    try {
      const response = await api.get('/restaurants/vendor/my-restaurant');
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async createRestaurant(data: any): Promise<Restaurant> {
    try {
      const response = await api.post('/restaurants/vendor/create', data);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async updateRestaurant(id: string, data: any): Promise<Restaurant> {
    try {
      const response = await api.put(`/restaurants/vendor/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new RestaurantService();