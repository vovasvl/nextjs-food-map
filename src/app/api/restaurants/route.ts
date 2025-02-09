// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios, { AxiosError } from 'axios';
import { Restaurant, RestaurantKeys } from '@/types';
import { NextRequest } from 'next/server';
import { RestaurantFilters } from '@/lib/fetchRestaurants';
import https from 'https'

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
  timeout: 60000, 
  httpsAgent: new https.Agent({ keepAlive: true }),
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

    const totalRestaurantCount = (await api.get<number>('/count')).data;

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
  } catch (error: unknown | AxiosError) {
    console.error('Ошибка при загрузке результатов поиска ресторанов:', error);

    if (axios.isAxiosError(error))  {
      return Response.json({ error: `Ошибка на стороне сервера при запросе на строронний API: ${error.code}` });
    }
    return Response.json({ error: `Ошибка на стороне сервера: ${error}` });
  }
}