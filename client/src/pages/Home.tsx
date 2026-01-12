import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import AddRestaurantForm from "../components/AddRestaurantForm";
import RestaurantList from "../components/RestuarantList";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import ErrorMessage from "../components/ErrorMessage";
import SkeletonList from "../components/SkeletonList";
import { getRestaurants } from "../services/api";
import { useDebounce } from "../hooks/useDebounce";
import { useAuth } from "../context/AuthContext";
import type { Restaurant, FilterOptions } from "../types/restaurant";

const parseFilters = (params: URLSearchParams): FilterOptions => {
  const next: FilterOptions = {};
  if (params.get("cuisine")) next.cuisine = params.get("cuisine") || undefined;
  if (params.get("location")) next.location = params.get("location") || undefined;
  if (params.get("priceRange")) next.priceRange = params.get("priceRange") || undefined;
  if (params.get("minRating")) next.minRating = Number(params.get("minRating"));
  return next;
};

const isSameFilters = (a: FilterOptions, b: FilterOptions) =>
  a.cuisine === b.cuisine &&
  a.location === b.location &&
  a.priceRange === b.priceRange &&
  (a.minRating ?? undefined) === (b.minRating ?? undefined);

const buildQueryParams = (filters: FilterOptions, searchValue: string) => {
  const params = new URLSearchParams();
  if (searchValue) params.set("search", searchValue);
  if (filters.cuisine) params.set("cuisine", filters.cuisine);
  if (filters.location) params.set("location", filters.location);
  if (filters.priceRange) params.set("priceRange", filters.priceRange);
  if (filters.minRating) params.set("minRating", String(filters.minRating));
  return params;
};

const Home: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshIndex, setRefreshIndex] = useState(0);
  const [filters, setFilters] = useState<FilterOptions>(() => parseFilters(searchParams));
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const listRef = useRef<HTMLDivElement>(null);
  const initialLoadRef = useRef(true);
  const { user, logout } = useAuth();
  const isAuthenticated = Boolean(user);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowAddForm(false);
    }
  }, [isAuthenticated]);

  const searchParamsString = searchParams.toString();

  useEffect(() => {
    const nextFilters = parseFilters(searchParams);
    if (!isSameFilters(filters, nextFilters)) {
      setFilters(nextFilters);
    }
    const nextSearch = searchParams.get("search") || "";
    if (nextSearch !== searchTerm) {
      setSearchTerm(nextSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParamsString]);

  useEffect(() => {
    const params = buildQueryParams(filters, debouncedSearchTerm);
    if (params.toString() !== searchParamsString) {
      setSearchParams(params, { replace: true });
    }
  }, [filters, debouncedSearchTerm, searchParamsString, setSearchParams]);

  useEffect(() => {
    let cancelled = false;
    const loadRestaurants = async () => {
      setIsLoading(true);
      setIsSearching(true);
      setError(null);
      try {
        const response = await getRestaurants({
          ...filters,
          search: debouncedSearchTerm || undefined
        });
        if (!cancelled) {
          setRestaurants(response.data);
        }
      } catch (err) {
        if (!cancelled) {
          const errorMessage = err instanceof Error ? err.message : "Failed to fetch restaurants";
          setError(errorMessage);
          console.error("Error fetching restaurants:", err);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setIsSearching(false);
          initialLoadRef.current = false;
        }
      }
    };
    loadRestaurants();
    return () => {
      cancelled = true;
    };
  }, [filters, debouncedSearchTerm, refreshIndex]);

  const handleFilterChange = (updatedFilters: FilterOptions) => {
    setFilters(updatedFilters);
  };

  const handleAddSuccess = () => {
    setShowAddForm(false);
    setRefreshIndex((prev) => prev + 1);
  };

  const handleRetry = () => setRefreshIndex((prev) => prev + 1);

  const { availableCuisines, availableLocations } = useMemo(() => {
    const cuisines = [...new Set(restaurants.map((r) => r.cuisine))].sort();
    const locations = [...new Set(restaurants.map((r) => r.location))].sort();
    return { availableCuisines: cuisines, availableLocations: locations };
  }, [restaurants]);

  const showSkeletons = isLoading && initialLoadRef.current;

  return (
    <div className="min-h-screen bg-zomato-lightGray bg-food-pattern">
      {/* Header with vibrant Zomato-style gradient */}
      <div className="bg-gradient-to-r from-zomato-red via-zomato-lightRed via-zomato-orange to-zomato-pink shadow-2xl border-b-4 border-white/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]"></div>
        <div className="container mx-auto px-4 py-10 max-w-7xl relative z-10">
          <div className="flex items-center justify-center gap-5 mb-5">
            <div className="bg-white/30 backdrop-blur-md p-4 rounded-2xl shadow-2xl border-2 border-white/40 transform hover:scale-110 transition-transform">
              <svg className="w-14 h-14 text-white drop-shadow-2xl" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h1 className="text-6xl font-black text-white italic drop-shadow-2xl tracking-tight">
              zomato
            </h1>
          </div>
          <p className="text-center text-white font-bold text-2xl drop-shadow-xl">🍕 Discover the best food in your city 🍽️</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-0">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zomato-textDark">
              {showAddForm ? 'Add New Restaurant' : 'Restaurants'}
            </h1>
            {!isAuthenticated && (
              <p className="text-sm text-zomato-textDark/70 mt-1">
                Login to add restaurants or manage your list.
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-zomato-textDark font-semibold">Hi, {user?.name}</span>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-lg border border-zomato-borderGray text-zomato-textDark hover:border-zomato-red"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg border border-zomato-red text-zomato-red hover:bg-zomato-red hover:text-white transition-colors"
              >
                Login
              </Link>
            )}
            {isAuthenticated && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-zomato-red text-white px-4 py-2 rounded-lg hover:bg-zomato-orange transition-colors"
              >
                {showAddForm ? 'View All Restaurants' : 'Add Restaurant'}
              </button>
            )}
          </div>
        </div>

        {!showAddForm && (
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSearch={() => listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
            isLoading={isSearching}
            className="mb-8"
          />
        )}

        {/* Error Message */}
        {error && !isLoading && (
          <ErrorMessage message={error} onRetry={handleRetry} />
        )}

        {/* Filter Bar */}
        {!showAddForm && (
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            availableCuisines={availableCuisines}
            availableLocations={availableLocations}
            className="mb-8"
          />
        )}

        {/* Main Content */}
        {showAddForm ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <AddRestaurantForm onSuccess={handleAddSuccess} />
          </div>
        ) : showSkeletons ? (
          <SkeletonList count={6} />
        ) : (
          <div ref={listRef}>
            {/* Restaurant List */}
            {restaurants.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-zomato-textDark font-black text-2xl bg-gradient-to-r from-zomato-red to-zomato-orange bg-clip-text text-transparent">
                    {restaurants.length} {restaurants.length !== 1 ? "Restaurants" : "Restaurant"} Found ✨
                  </p>
                  <div className="flex gap-1 text-2xl">
                    {['🍕', '🍔', '🍜'].map((emoji, i) => (
                      <span key={i} className="animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                        {emoji}
                      </span>
                    ))}
                  </div>
                </div>
                <RestaurantList 
                  restaurants={restaurants} 
                  onRefresh={handleRetry} 
                />
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-zomato-textDark text-xl mb-4">No restaurants found</p>
                <p className="text-zomato-textDark/70">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Home;
