// Shared Restaurant type definitions
export interface Restaurant {
  _id: string;
  name: string;
  cuisine: string;
  rating: number;
  location: string;
  priceRange: string;
}

export interface RestaurantPayload {
  name: string;
  cuisine: string;
  rating: number;
  location: string;
  priceRange: string;
}

export type FilterOptions = {
  search?: string;
  cuisine?: string;
  minRating?: number;
  priceRange?: string;
  location?: string;
};



