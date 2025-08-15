import axios, { type AxiosResponse } from "axios";

axios.defaults.baseURL = "http://real-estate-api-laravel.test/";

export interface PropertyImage {
  id: number;
  image_path: string;
  is_primary: boolean;
}

export interface Property {
  id: number;
  title: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  city: string;
  district: string;
  status: string;
  property_type: string;
  images?: PropertyImage[];
}

export interface GetPropertiesParams {
  search?: string;
  city?: string;
  status?: string;
  property_type?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
}

export const getProperties = (params: GetPropertiesParams = {}) => {
  return axios.get("/api/properties", { params });
};

export const getProperty = (id: number) => {
  return axios.get<Property>(`/api/properties/${id}`);
};

export const createProperty = (
  formData: FormData,
  token: string
): Promise<AxiosResponse> => {
  return axios.post("/api/properties", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateProperty = (id: number, data: FormData, token?: string) => {
  data.append("_method", "PUT");
  return axios.post(`/api/properties/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};
export const deleteProperty = (id: number, token: string) => {
  return axios.delete(`/api/properties/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
