import React from "react";
import CustomSelect from "./CustomSelect";
import type { FilterOptions } from "../types/restaurant";

interface Props {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  availableCuisines: string[];
  availableLocations: string[];
  className?: string;  // Add this line
}

const FilterBar: React.FC<Props> = ({
  filters,
  onFilterChange,
  availableCuisines,
  availableLocations,
  className = '',
}) => {
  const handleFilterChange = (key: keyof FilterOptions, value: string | number | undefined) => {
    onFilterChange({
      ...filters,
      [key]: value === "" ? undefined : value,
    });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== undefined && value !== "");

  return (
    <div className={`bg-red-100 p-6 rounded-2xl shadow-2xl border-2 border-zomato-red/20 mb-6 relative overflow-visible ${className}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-zomato-red/70 to-transparent rounded-bl-full pointer-events-none overflow-hidden"></div>
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-r from-zomato-red via-zomato-lightRed to-zomato-orange p-3 rounded-xl shadow-lg transform hover:rotate-12 transition-transform">
            <svg className="w-7 h-7 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-zomato-textDark bg-gradient-to-r from-zomato-red to-zomato-orange bg-clip-text text-transparent">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-6 py-3 bg-gradient-to-r from-zomato-red to-zomato-orange text-white text-sm font-black rounded-xl hover:from-zomato-darkRed hover:to-zomato-red transition-all shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/20"
          >
            Clear All ✕
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {/* Cuisine Filter */}
        <div className="relative">
          <label className="block text-sm font-bold text-zomato-darker mb-2">
            Cuisine
          </label>
          <CustomSelect
            value={filters.cuisine || ""}
            onChange={(value) => handleFilterChange("cuisine", value)}
            placeholder="All Cuisines"
            ariaLabel="Filter by cuisine"
            options={[
              { value: "", label: "All Cuisines" },
              ...availableCuisines.map((cuisine) => ({
                value: cuisine,
                label: cuisine,
              })),
            ]}
          />
        </div>

        {/* Location Filter */}
        <div className="relative">
          <label className="block text-sm font-bold text-zomato-darker mb-2">
            Location
          </label>
          <CustomSelect
            value={filters.location || ""}
            onChange={(value) => handleFilterChange("location", value)}
            placeholder="All Locations"
            ariaLabel="Filter by location"
            options={[
              { value: "", label: "All Locations" },
              ...availableLocations.map((location) => ({
                value: location,
                label: location,
              })),
            ]}
          />
        </div>

        {/* Rating Filter */}
        <div className="relative">
          <label className="block text-sm font-bold text-zomato-darker mb-2">
            Min Rating
          </label>
          <CustomSelect
            value={filters.minRating?.toString() || ""}
            onChange={(value) => handleFilterChange("minRating", value ? parseFloat(value) : undefined)}
            placeholder="Any Rating"
            ariaLabel="Filter by minimum rating"
            options={[
              { value: "", label: "Any Rating" },
              { value: "4.5", label: "4.5+ ⭐" },
              { value: "4.0", label: "4.0+ ⭐" },
              { value: "3.5", label: "3.5+ ⭐" },
              { value: "3.0", label: "3.0+ ⭐" },
              { value: "2.5", label: "2.5+ ⭐" },
              { value: "2.0", label: "2.0+ ⭐" },
            ]}
          />
        </div>

        {/* Price Range Filter */}
        <div className="relative">
          <label className="block text-sm font-bold text-zomato-darker mb-2">
            Price Range
          </label>
          <CustomSelect
            value={filters.priceRange || ""}
            onChange={(value) => handleFilterChange("priceRange", value)}
            placeholder="All Prices"
            ariaLabel="Filter by price range"
            options={[
              { value: "", label: "All Prices" },
              { value: "₹", label: "₹ (Budget)" },
              { value: "₹₹", label: "₹₹ (Moderate)" },
              { value: "₹₹₹", label: "₹₹₹ (Expensive)" },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;

