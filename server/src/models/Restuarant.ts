import mongoose, { Schema, Document } from "mongoose";

export interface IRestaurant extends Document {
  name: string;
  cuisine: string;
  rating: number;
  location: string;
  priceRange: string;
}

const RestaurantSchema: Schema = new Schema({
  name: { type: String, required: true },
  cuisine: { type: String, required: true },
  rating: { type: Number, required: true },
  location: { type: String, required: true },
  priceRange: { type: String, required: true }
});

export default mongoose.model<IRestaurant>("Restaurant", RestaurantSchema);
