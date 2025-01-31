import axios from 'axios';
import { Restaurant, RestaurantKeys } from '@/types';
import { NextRequest } from 'next/server';
import { RestaurantFilters } from '@/lib/fetchRestaurants';
import { unstable_cache } from 'next/cache';

const datasetId = 1903;
const limit = 1000;

const requestedKeys: RestaurantKeys[] = [
  'global_id',
  'Name',
  'OperatingCompany',
  'Address',
  'SeatsCount',
  'IsNetObject',
  'TypeObject',
  'geoData'
];

const api = axios.create({
  baseURL: `https://apidata.mos.ru/v1/datasets/${datasetId}`,
  params: {
    api_key: process.env.API_KEY,
  },
});

type ApiResponse = {
  global_id: number;
  Number: number;
  Cells: Restaurant;
}[];

const totalRestaurantCountCache = unstable_cache(
  async () => {
    const response = await api.get<number>('/count');
    return response.data;
  },
  ['total-restaurant-count'],
  { revalidate: 3600 }
);

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

    const totalRestaurantCount = await totalRestaurantCountCache();

    const requests = [];
    let currentOffset = 0;

    while (currentOffset < totalRestaurantCount) {
      requests.push(
        (async () => {
          const response = await api.post<ApiResponse>(
            '/rows',
            JSON.stringify(requestedKeys),
            {
              headers: {
                "Content-Type": "application/json",
              },
              params: {
                $skip: currentOffset,
                $filter: filterString,
              },
            }
          );
          return response.data;
        })()
      );
      currentOffset += limit;
    }

    const result = await Promise.all(requests);
    const allData = result.flat(1);

    const restaurants = allData.map((item) => item.Cells);

    return Response.json(restaurants);
  } catch (error) {
    console.error(`Ошибка при загрузке результатов поиска ресторанов: ${error}`);
    return Response.json({ error: error });
  }
}