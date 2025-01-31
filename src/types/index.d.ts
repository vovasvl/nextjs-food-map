
export interface ResponseError {
  error: string;
}

export interface Restaurant {
global_id: number;
Name: string;
OperatingCompany: string;
Address: string;
SeatsCount: number;
IsNetObject: string;
TypeObject: string;
geoData: {
  coordinates: [number, number];
  type: string;
};
}

export type RestaurantKeys = keyof Restaurant;