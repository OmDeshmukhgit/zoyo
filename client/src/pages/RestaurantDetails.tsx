import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getRestaurantById } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import type { Restaurant } from "../types/restaurant";

const RestaurantDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    let cancelled = false;
    
    const fetchRestaurant = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const res = await getRestaurantById(id);
        if (!cancelled) {
          setRestaurant(res.data);
        }
      } catch (err) {
        if (!cancelled) {
          const errorMessage = err instanceof Error ? err.message : "Failed to fetch restaurant details";
          setError(errorMessage);
          console.error("Error fetching restaurant:", err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    
    fetchRestaurant();
    
    return () => {
      cancelled = true;
    };
  }, [id]);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <span key={i} className="text-yellow-400 text-2xl">★</span>
        ))}
        {hasHalfStar && <span className="text-yellow-400 text-2xl">☆</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={i} className="text-gray-300 text-2xl">★</span>
        ))}
        <span className="ml-3 text-lg font-semibold text-gray-700">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zomato-cream">
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zomato-cream">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <ErrorMessage message={error} />
          <Link
            to="/"
            className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-zomato-red to-zomato-orange text-zomato-cream font-bold rounded-xl hover:from-zomato-darkRed hover:to-zomato-red transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-zomato-cream">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-zomato-textDark mb-4">Restaurant not found</h2>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-zomato-red to-zomato-orange text-zomato-cream font-bold rounded-xl hover:from-zomato-darkRed hover:to-zomato-red transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Food emoji based on cuisine
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
    <div className="min-h-screen bg-zomato-lightGray">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 bg-white rounded-xl border-2 border-zomato-red/20 text-zomato-red hover:bg-zomato-red/5 hover:border-zomato-red/30 hover:shadow-md transition-all duration-200 mb-6 font-semibold"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Restaurants
        </Link>

        <div className="bg-zomato-cream rounded-2xl shadow-2xl border-2 border-zomato-red/20 overflow-hidden relative">
          {/* Vibrant Food Icon Header */}
          <div className="bg-gradient-to-r from-zomato-red via-zomato-lightRed via-zomato-orange to-zomato-pink px-8 py-10 border-b-4 border-zomato-rose/40 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-zomato-rose/20 to-transparent"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,229,229,0.4),transparent_70%)]"></div>
            <div className="text-8xl text-center mb-2 drop-shadow-2xl relative z-10 transform hover:scale-110 transition-transform duration-300">{getCuisineEmoji(restaurant.cuisine)}</div>
          </div>
          <div className="p-8 bg-zomato-cream">
            <div className="mb-6">
              <h1 className="text-5xl font-black text-zomato-textDark mb-4 bg-gradient-to-r from-zomato-red to-zomato-orange bg-clip-text text-transparent">{restaurant.name}</h1>
              <div className="border-t-2 border-zomato-borderGray pt-4">
                {renderStars(restaurant.rating)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-start bg-gradient-to-br from-zomato-red/5 via-zomato-orange/5 to-zomato-pink/5 p-5 rounded-2xl border-2 border-zomato-red/20 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 backdrop-blur-sm">
                <div className="bg-gradient-to-r from-zomato-red to-zomato-lightRed p-2 rounded-lg mr-4 shadow-md">
                  <svg className="h-6 w-6 text-zomato-cream drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zomato-gray mb-2 uppercase tracking-wide">Cuisine</h3>
                  <p className="text-xl font-extrabold text-zomato-textDark">{restaurant.cuisine}</p>
                </div>
              </div>

              <div className="flex items-start bg-gradient-to-br from-zomato-red/5 via-zomato-orange/5 to-zomato-pink/5 p-5 rounded-2xl border-2 border-zomato-red/20 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 backdrop-blur-sm">
                <div className="bg-gradient-to-r from-zomato-red to-zomato-lightRed p-2 rounded-lg mr-4 shadow-md">
                  <svg className="h-6 w-6 text-zomato-cream drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zomato-gray mb-2 uppercase tracking-wide">Location</h3>
                  <p className="text-xl font-extrabold text-zomato-textDark">{restaurant.location}</p>
                </div>
              </div>

              <div className="flex items-start bg-gradient-to-br from-zomato-red/5 via-zomato-orange/5 to-zomato-pink/5 p-5 rounded-2xl border-2 border-zomato-red/20 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 md:col-span-2">
                <div className="bg-zomato-red p-2 rounded-lg mr-4">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zomato-gray mb-2 uppercase tracking-wide">Price Range</h3>
                  <p className="text-2xl font-extrabold text-zomato-textDark">{restaurant.priceRange}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;
