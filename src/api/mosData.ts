import axios from 'axios';

const datasetId = 1903;
const limit = 1000; 

const api = axios.create({
  baseURL: `https://apidata.mos.ru/v1/datasets/${datasetId}/rows`,
  params: {
    api_key: process.env.API_KEY,
  }
});

export interface Restaurant {
  global_id: number;
  Name: string;
  OperatingCompany: string;
  ObjectType: string;
  Address: string;
  SeatsCount: number;
  IsNetObject: string;
  TypeObject: string;
  AdmArea: string;
  District: string;
  PublicPhone: {
    is_deleted: number;
    PublicPhone: string;
    global_id: number;
  }[];
  Longitude_WGS84: string;
  Latitude_WGS84: string;
  geoData: {
    coordinates: [number, number];
    type: string;
  };
}

export interface RestaurantFilters {
  OperatingCompany?: string,
  TypeObject?: string,
  IsNetObject?: boolean
}

type FetchRestaurantsResponse  = Restaurant[];

type ApiResponse = {
  "global_id": number,
  "Number": number,
  "Cells": Restaurant
}[];

export async function fetchRestaurants(filters: RestaurantFilters): Promise<FetchRestaurantsResponse> {
  try {

    const filterString = Object.entries(filters)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `Cells/${key} eq '${value}'`)
    .join(' and ');

    const response = await api.get<ApiResponse>('', {
      params: {
        $filter: filterString
      }
    });

    let allData = response.data;
    let dataCount = allData.length;
    let totalDataCount = dataCount;

    while(dataCount === limit){
      const newResponse = await api.get('', {
        params: {
          $skip: totalDataCount,
          $filter: filterString
        }
      });
      dataCount = newResponse.data.length;
      totalDataCount += dataCount;
      allData = allData.concat(newResponse.data);
    }

    return allData.map((item) => item.Cells);
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    throw error;
  }
};
