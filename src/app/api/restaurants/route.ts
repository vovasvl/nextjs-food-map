// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios, { AxiosError } from 'axios';
import { Restaurant, RestaurantKeys } from '@/types';
import { NextRequest } from 'next/server';
import { RestaurantFilters } from '@/lib/fetchRestaurants';
import http from 'node:http';
import https from 'node:https';

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
  timeout: 600000,
  httpAgent: new http.Agent({ keepAlive: true, timeout: 600000 }),
  httpsAgent: new https.Agent({ keepAlive: true, timeout: 600000 }),
});

type ApiResponse = {
  global_id: number;
  Number: number;
  Cells: Restaurant;
}[];

export async function GET(request: NextRequest) {
  try {
    console.error('GET req started');
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

    console.error('count req started');
    // const totalRestaurantCount = (await api.get<number>('/count')).data;
    const totalRestaurantCount = 21704;
    console.error(`count ${totalRestaurantCount}`);

    const allData: ApiResponse = [];
    let currentOffset = 0;

    let i = 1;
    while (currentOffset < totalRestaurantCount) {
      console.error(`Sending request ${i} for offset ${currentOffset}`);
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
      console.error(`req ${i} done`);
      allData.push(...response.data);
      i += 1;
      currentOffset += limit;
    }

    const restaurants = allData.map((item) => item.Cells);

    return Response.json(restaurants);
  } catch (error: unknown | AxiosError) {
    console.error('Ошибка при загрузке результатов поиска ресторанов:', error);

    if (axios.isAxiosError(error)) {
      console.error('err req', error.request);
      console.error('err res', error.response);
      console.error('err json',error.toJSON());
      
      return Response.json({ error: `Ошибка на стороне сервера при запросе на строронний API: ${error.code}` });
    }
    return Response.json({ error: `Ошибка на стороне сервера: ${error}` });
  }
}
