import axios from 'axios';
import { Restaurant } from '@/types';
import { NextRequest } from 'next/server';
import { RestaurantFilters } from '@/lib/fetchRestaurants';

const datasetId = 1903;
const limit = 1000;

const api = axios.create({
  baseURL: `https://apidata.mos.ru/v1/datasets/${datasetId}/rows`,
  params: {
    api_key: process.env.API_KEY,
  },
});

type ApiResponse = {
  global_id: number;
  Number: number;
  Cells: Restaurant;
}[];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters: RestaurantFilters = Object.fromEntries(searchParams.entries());

    const filterString = filters ? Object.entries(filters)
      .filter(([, value]) => value !== undefined && value !== '' && value !== 'false')
      .map(([key, value]) => {
        if (value === 'true') {
          return `Cells/${key} eq ${value}`;
        } else {
          return `Cells/${key} eq '${value}'`;
        }
      })
      .join(' and ')
      : '';
      
    const response = await api.get<ApiResponse>('', {
      params: {
        $filter: filterString,
      },
    });

    let allData = response.data;
    let dataLength = allData.length;
    let totalDataLength = dataLength;

    while (dataLength === limit) {
      const newResponse = await api.get<ApiResponse>('', {
        params: {
          $skip: totalDataLength,
          $filter: filterString,
        },
      });
      dataLength = newResponse.data.length;
      totalDataLength += dataLength;
      allData = allData.concat(newResponse.data);
    }

    const restaurants = allData.map((item) => item.Cells);
    return Response.json(restaurants);
  } catch (error) {
    console.error(`Ошибка при загрузке результатов поиска ресторанов: ${error}`);
    return Response.json({ error: error });
  }
}