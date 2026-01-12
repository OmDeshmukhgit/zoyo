import React, { useState } from "react";
import { createRestaurant } from "../services/api";
import type { RestaurantPayload } from "../types/restaurant";
import CustomSelect from "./CustomSelect";

type Props = {
  onAdd?: () => void;
  onSuccess?: () => void;
};

const AddRestaurantForm: React.FC<Props> = ({ onAdd, onSuccess }) => {
  const [formData, setFormData] = useState<RestaurantPayload>({
    name: "",
    cuisine: "",
    rating: 0,
    location: "",
    priceRange: ""
  });

  const priceRangeOptions = [
    { value: "", label: "Select Price Range" },
    { value: "₹", label: "₹ (Budget)" },
    { value: "₹₹", label: "₹₹ (Moderate)" },
    { value: "₹₹₹", label: "₹₹₹ (Expensive)" }
  ];

  // ✅ Split handlers to satisfy TS
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Type-safe way to update form data
    setFormData((prev) => {
      // Create a new object with the updated value
      const updatedData = { ...prev };
      
      // Type assertion to ensure we're only using valid keys
      if (name in prev) {
        const key = name as keyof RestaurantPayload;
        updatedData[key] = (key === 'rating' ? parseFloat(value) || 0 : value) as never;
      }
      
      return updatedData;
    });
  };

  const handleSelectChange = (value: string, field: keyof RestaurantPayload) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await createRestaurant(formData);
      setFormData({
        name: "",
        cuisine: "",
        rating: 0,
        location: "",
        priceRange: ""
      });
      onAdd?.();
      onSuccess?.();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add restaurant.";
      setError(errorMessage);
      console.error("❌ Error creating restaurant:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log("AddRestaurantForm priceRangeOptions:", priceRangeOptions);
  return (
    <div className="bg-red-100 p-6 rounded-2xl shadow-2xl border-2 border-zomato-red/20 mb-6 relative overflow-visible">
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-zomato-red/50 to-transparent rounded-br-full pointer-events-none"></div>
      <div className="flex items-center gap-4 mb-5 pb-4 border-b-2 border-zomato-red/20 relative z-10">
        <div className="bg-gradient-to-r from-zomato-red via-zomato-lightRed to-zomato-pink p-3 rounded-xl shadow-xl transform hover:rotate-12 transition-transform">
          <svg className="w-7 h-7 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-zomato-textDark bg-gradient-to-r from-zomato-red to-zomato-orange bg-clip-text text-transparent">
          Add New Restaurant
        </h2>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center">
          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Restaurant added successfully!
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-zomato-darker mb-2">Restaurant Name *</label>
            <input
              type="text"
              name="name"
              placeholder="Enter restaurant name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border-2 border-zomato-red/30 rounded-xl shadow-md focus:outline-none focus:ring-4 focus:ring-zomato-red/50 focus:border-zomato-red text-zomato-textDark font-bold bg-white hover:border-zomato-red hover:shadow-lg transition-all transform hover:scale-[1.01]"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-zomato-darker mb-2">Cuisine Type *</label>
            <input
              type="text"
              name="cuisine"
              placeholder="e.g., Italian, Chinese, Indian"
              value={formData.cuisine}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border-2 border-zomato-red/30 rounded-xl shadow-md focus:outline-none focus:ring-4 focus:ring-zomato-red/50 focus:border-zomato-red text-zomato-textDark font-bold bg-white hover:border-zomato-red hover:shadow-lg transition-all transform hover:scale-[1.01]"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-zomato-darker mb-2">Rating (0-5) *</label>
            <input
              type="number"
              name="rating"
              placeholder="4.5"
              value={formData.rating || ""}
              onChange={handleInputChange}
              step="0.1"
              min="0"
              max="5"
              required
              className="w-full px-4 py-3 border-2 border-zomato-red/30 rounded-xl shadow-md focus:outline-none focus:ring-4 focus:ring-zomato-red/50 focus:border-zomato-red text-zomato-textDark font-bold bg-white hover:border-zomato-red hover:shadow-lg transition-all transform hover:scale-[1.01]"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-zomato-darker mb-2">Location *</label>
            <input
              type="text"
              name="location"
              placeholder="Enter location"
              value={formData.location}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border-2 border-zomato-red/30 rounded-xl shadow-md focus:outline-none focus:ring-4 focus:ring-zomato-red/50 focus:border-zomato-red text-zomato-textDark font-bold bg-white hover:border-zomato-red hover:shadow-lg transition-all transform hover:scale-[1.01]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-zomato-darker mb-2">Price Range *</label>
            <CustomSelect
              value={formData.priceRange}
              onChange={(value: string) => handleSelectChange(value, "priceRange")}
              placeholder="Select Price Range"
              ariaLabel="Select price range"
              options={priceRangeOptions}
            />
          </div>
        </div>

        <button
  type="submit"
  disabled={isSubmitting}
  className="w-full md:w-auto px-12 py-5 bg-gradient-to-r from-zomato-red via-zomato-orange to-zomato-pink 
             text-white font-black rounded-2xl hover:bg-gradient-to-r hover:from-zomato-darkRed hover:to-zomato-red
             focus:outline-none focus:ring-4 focus:ring-zomato-red/60 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed 
             transition-all duration-300 shadow-2xl hover:shadow-lg
             border-2 border-white/40 relative overflow-hidden group/btn"
>
  {isSubmitting ? (
    <span className="flex items-center gap-2">
      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4
             zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 
             1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      Adding...
    </span>
  ) : (
    <span className="relative z-10">✨ Add Restaurant ✨</span>
  )}
</button>
      </form>
    </div>
  );
};

export default AddRestaurantForm;
