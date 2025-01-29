
export interface ResponseError {
    error: string;
}

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