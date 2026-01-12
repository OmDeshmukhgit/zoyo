import React, { useState } from "react";
import { Link } from "react-router-dom";
import { deleteRestaurant } from "../services/api";
import type { Restaurant } from "../types/restaurant";

type Props = Restaurant & {
  onDelete?: () => void;
};

const RestaurantCard: React.FC<Props> = ({
  _id,
  name,
  cuisine,
  rating,
  location,
  priceRange,
  onDelete
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteRestaurant(_id);
      onDelete?.();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete restaurant.");
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <span key={i} className="text-yellow-400">★</span>
        ))}
        {hasHalfStar && <span className="text-yellow-400">☆</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={i} className="text-gray-300">★</span>
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Food emoji based on cuisine (for visual appeal)
  const getCuisineEmoji = (cuisine: string) => {
    const cuisineLower = cuisine.toLowerCase();
    if (cuisineLower.includes('italian')) return '🍝';
    if (cuisineLower.includes('chinese')) return '🥟';
    if (cuisineLower.includes('indian')) return '🍛';
    if (cuisineLower.includes('japanese')) return '🍣';
    if (cuisineLower.includes('mexican')) return '🌮';
    if (cuisineLower.includes('thai')) return '🍜';
    if (cuisineLower.includes('pizza')) return '🍕';
    if (cuisineLower.includes('burger')) return '🍔';
    return '🍽️';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl hover:shadow-[0_10px_10px_rgba(255,51,51,0.3)] transition-all duration-300 border-2 border-zomato-red/20 overflow-hidden transform hover:-translate-y-3 hover:scale-[1] relative group">
      {/* Vibrant Food Icon Header */}
      <div className="bg-gradient-to-r from-zomato-red via-zomato-lightRed to-zomato-orange px-6 py-5 border-b-2 border-zomato-red/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        <div className="text-6xl text-center drop-shadow-2xl relative z-10 transform group-hover:scale-110 transition-transform duration-300">{getCuisineEmoji(cuisine)}</div>
      </div>
      <div className="p-6 bg-white">
        <div className="flex justify-between items-start mb-4">
          <Link to={`/restaurant/${_id}`} className="flex-1">
            <h2 className="text-xl font-black text-zomato-textDark hover:text-zomato-red transition-colors cursor-pointer group-hover:scale-105 inline-block">
              {name}
            </h2>
          </Link>
          {showConfirm ? (
            <div className="flex gap-2 ml-4">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Confirm"}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              className="ml-4 px-3 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
            >
              Delete
            </button>
          )}
        </div>

        <div className="space-y-3 mb-5">
          <p className="text-zomato-textSecondary font-semibold flex items-center">
            <svg className="h-5 w-5 mr-2 text-zomato-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-zomato-darker">{cuisine}</span>
          </p>
          <p className="text-zomato-textSecondary font-semibold flex items-center">
            <svg className="h-5 w-5 mr-2 text-zomato-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-zomato-darker">{location}</span>
          </p>
          <div className="border-t border-zomato-borderGray pt-3">
            {renderStars(rating)}
          </div>
          <p className="text-zomato-textDark font-bold text-lg border-t border-zomato-borderGray pt-3">{priceRange}</p>
        </div>

        <Link
          to={`/restaurant/${_id}`}
          className="inline-block mt-4 w-full text-center px-6 py-4 bg-gradient-to-r from-zomato-red via-zomato-lightRed via-zomato-orange to-zomato-pink text-white text-base font-black rounded-xl hover:from-zomato-darkRed hover:via-zomato-red hover:via-zomato-lightRed hover:to-zomato-orange transition-all shadow-xl hover:shadow-[0_10px_30px_rgba(255,51,51,0.5)] transform hover:scale-105 border-2 border-white/30 relative overflow-hidden group/btn"
        >
          <span className="relative z-10">🍽️ View Menu & Order →</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
        </Link>
      </div>
    </div>
  );
};

export default RestaurantCard;
