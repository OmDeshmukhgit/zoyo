import Restaurant from "../models/Restuarant";
import type { Request, Response } from "express";

export const getAllRestaurants = async (req: Request, res: Response) => {
  try {
    const { search, cuisine, minRating, priceRange, location } = req.query;
    
    // Build query object
    const query: Record<string, unknown> = {};
    
    // Search by name (case-insensitive)
    if (search && typeof search === 'string') {
      query.name = { $regex: search, $options: 'i' };
    }
    
    // Filter by cuisine
    if (cuisine && typeof cuisine === 'string') {
      query.cuisine = cuisine;
    }
    
    // Filter by minimum rating
    if (minRating) {
      const rating = parseFloat(minRating as string);
      if (!isNaN(rating)) {
        query.rating = { $gte: rating };
      }
    }
    
    // Filter by price range
    if (priceRange && typeof priceRange === 'string') {
      query.priceRange = priceRange;
    }
    
    // Filter by location
    if (location && typeof location === 'string') {
      query.location = { $regex: location, $options: 'i' };
    }
    
    const restaurants = await Restaurant.find(query).sort({ rating: -1 });
    res.json(restaurants);
  } catch (err) {
    console.error("Error fetching restaurants:", err);
    res.status(500).json({ error: "Failed to fetch restaurants" });
  }
};

export const getRestaurantById = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ error: "Not found" });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch restaurant" });
  }
};

export const createRestaurant = async (req: Request, res: Response) => {
  try {
    const newRestaurant = await Restaurant.create(req.body);
    res.status(201).json(newRestaurant);
  } catch (err) {
    res.status(400).json({ error: "Failed to create restaurant" });
  }
};

export const deleteRestaurant = async (req: Request, res: Response) => {
  try {
    const deleted = await Restaurant.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete restaurant" });
  }
};