import { Restaurant, RestaurantKeys } from '@/types';
import { NextRequest } from 'next/server';
import { RestaurantFilters } from '@/lib/fetchRestaurants';


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

const baseURL = `https://apidata.mos.ru/v1/datasets/${datasetId}`;
const apiKey = process.env.API_KEY;

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
      const url = new URL(`${baseURL}/rows`);
      url.searchParams.append('api_key', apiKey || '');
      url.searchParams.append('$skip', currentOffset.toString());
      if (filterString) {
        url.searchParams.append('$filter', filterString);
      }

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestedKeys),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      console.error(`req ${i} done`);
      allData.push(...data);
      i += 1;
      currentOffset += limit;
    }

    const restaurants = allData.map((item) => item.Cells);

    return Response.json(restaurants);
  } catch (error: unknown) {
    console.error('Ошибка при загрузке результатов поиска ресторанов:', error);

    if (error instanceof Error) {
      return Response.json({ error: `Ошибка на стороне сервера при запросе на сторонний API: ${error.message}` });
    }
    return Response.json({ error: `Ошибка на стороне сервера: ${error}` });
  }
}