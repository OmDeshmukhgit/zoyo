import React, { useEffect, useRef } from "react";

interface Props {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch?: () => void;
  placeholder?: string;
  className?: string;
  isLoading?: boolean;
  autoFocus?: boolean;
}

const SearchBar: React.FC<Props> = ({ 
  searchTerm, 
  onSearchChange, 
  onSearch,
  placeholder = "Search for restaurants...",
  className = "",
  isLoading = false,
  autoFocus = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.();
  };

  const handleClear = () => {
    onSearchChange('');
    inputRef.current?.focus();
  };

  // Auto-focus on mount if specified
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`relative w-full ${className}`}
      role="search"
      aria-label="Restaurant search"
    >
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg
          className={`h-5 w-5 ${isLoading ? 'text-zomato-orange animate-pulse' : 'text-zomato-red'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
      </div>
      
      <input
        ref={inputRef}
        type="search"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-10 py-3 rounded-xl border-2 border-zomato-borderGray 
                 focus:outline-none focus:ring-2 focus:ring-zomato-red/50 focus:border-transparent
                 transition-all duration-200 [&::-webkit-search-cancel-button]:hidden"
        aria-label="Search restaurants"
        aria-busy={isLoading}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        style={{ WebkitAppearance: 'none' }}
      />
      
      {(searchTerm || isLoading) && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {isLoading ? (
            <div 
              className="h-5 w-5 border-2 border-zomato-orange border-t-transparent rounded-full animate-spin"
              aria-label="Searching..."
            />
          ) : (
            <button
              type="button"
              onClick={handleClear}
              className="text-zomato-textDark hover:text-zomato-red transition-colors"
              aria-label="Clear search"
            >
              <svg 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          )}
        </div>
      )}
    </form>
  );
};

export default SearchBar;
