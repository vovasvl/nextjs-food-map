import axios from 'axios';
import { Restaurant } from '@/types';

const baseURL = '/api/restaurants';

export interface RestaurantFilters {
  OperatingCompany?: string;
  TypeObject?: string;
  IsNetObject?: boolean;
}

export async function fetchRestaurants(filters: RestaurantFilters): Promise<Restaurant[]> {
  try {
    const response = await axios.get<Restaurant[]>(baseURL, {
      params: filters, 
    });
    return response.data;
  } catch (error) {
    throw new Error(`Ошибка при загрузке результатов поиска ресторанов: ${error}`)
  }
}