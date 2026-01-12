import axios from "axios";
import type { RestaurantPayload, FilterOptions } from "../types/restaurant";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

const TOKEN_KEY = "zomato_token";

API.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getRestaurants = (filters?: FilterOptions) => {
  const params = new URLSearchParams();
  
  if (filters?.search) params.append("search", filters.search);
  if (filters?.cuisine) params.append("cuisine", filters.cuisine);
  if (filters?.minRating) params.append("minRating", filters.minRating.toString());
  if (filters?.priceRange) params.append("priceRange", filters.priceRange);
  if (filters?.location) params.append("location", filters.location);
  
  const queryString = params.toString();
  return API.get(`/restaurants${queryString ? `?${queryString}` : ""}`);
};

export const getRestaurantById = (id: string) => API.get(`/restaurants/${id}`);

export const createRestaurant = (data: RestaurantPayload) =>
  API.post("/restaurants", data);

export const updateRestaurant = (id: string, data: RestaurantPayload) =>
  API.put(`/restaurants/${id}`, data);

export const deleteRestaurant = (id: string) =>
  API.delete(`/restaurants/${id}`);

type AuthResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export const loginUser = (credentials: { email: string; password: string; }) =>
  API.post<AuthResponse>("/auth/login", credentials).then(res => res.data);

export const registerUser = (payload: { name: string; email: string; password: string; }) =>
  API.post<AuthResponse>("/auth/register", payload).then(res => res.data);

export const getProfile = () =>
  API.get("/auth/me").then(res => res.data);


