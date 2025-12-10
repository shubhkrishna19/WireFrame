import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';
import * as dataStore from '../store/dataStore';
import { analytics } from '../utils/analytics';

interface SearchBarProps {
  onSearchChange?: (query: string) => void;
  initialValue?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearchChange, initialValue = '' }) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(searchQuery, 300);

  // Get suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery.trim()) {
        setSuggestions([]);
        return;
      }


      try {
        const products = await dataStore.getProducts({ search: debouncedQuery, priceMin: 0, priceMax: 100000 });
        setSuggestions(products.slice(0, 5));
      } catch (error) {
        console.error('Error fetching search suggestions:', error);
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  useEffect(() => {
    if (onSearchChange) {
      onSearchChange(debouncedQuery);
    }

    // Track search queries
    if (debouncedQuery.trim().length > 2) {
      const trackSearch = async () => {
        try {
          const results = await dataStore.getProducts({ search: debouncedQuery, priceMin: 0, priceMax: 100000 });
          analytics.search(debouncedQuery, results.length);
        } catch (error) {
          console.error('Error tracking search:', error);
        }
      };
      trackSearch();
    }
  }, [debouncedQuery, onSearchChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          setShowSuggestions(false);
          inputRef.current?.blur();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        inputRef.current?.blur();
        break;
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark
          key={i}
          className="font-semibold px-1 rounded"
          style={{
            backgroundColor: 'rgba(251, 191, 36, 0.3)',
            color: '#FBBF24',
          }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Popular searches suggestions
  const popularSearches = ['Merino Wool', 'Bamboo Cotton', 'Hoodies', 'T-Shirts', 'Polo'];

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search products, brands..."
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={(e) => {
            setShowSuggestions(true);
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
          onBlur={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          }}
          className="w-full px-6 py-4 pl-12 pr-12 rounded-3xl focus:ring-2 focus:ring-offset-2 shadow-lg hover:shadow-xl transition-all"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            color: '#FFFFFF',
          }}
          aria-label="Search products"
          aria-expanded={showSuggestions}
          aria-controls="search-suggestions"
          aria-haspopup="listbox"
          aria-autocomplete="list"
          role="combobox"
        />
        <svg
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
          style={{ color: 'rgba(255, 255, 255, 0.6)' }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setShowSuggestions(false);
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors"
            style={{ color: 'rgba(255, 255, 255, 0.6)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'; }}
            aria-label="Clear search"
            title="Clear search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          id="search-suggestions"
          className="absolute z-50 w-full mt-3 backdrop-blur-md border-2 rounded-3xl shadow-2xl max-h-96 overflow-y-auto"
          role="listbox"
          style={{
            backgroundColor: 'rgba(26, 26, 26, 0.98)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
          }}
        >
          {suggestions.map((product, index) => (
            <Link
              key={product._id}
              to={`/products/${product.slug}`}
              className={`block px-5 py-4 transition-colors rounded-2xl mx-2 my-1 ${index === selectedIndex ? '' : ''
                }`}
              style={{
                backgroundColor: index === selectedIndex ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (index !== selectedIndex) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (index !== selectedIndex) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
              onClick={() => {
                setShowSuggestions(false);
                inputRef.current?.blur();
              }}
            >
              <div className="flex items-center gap-3">
                <img
                  src={product.thumbnail}
                  alt={product.name}
                  className="w-14 h-14 object-cover rounded-2xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop&auto=format';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: '#FFFFFF' }}>
                    {highlightText(product.name, debouncedQuery)}
                  </p>
                  <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{product.brand}</p>
                </div>
                <div className="text-sm font-semibold" style={{ color: '#10B981' }}>₹{product.price}</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {showSuggestions && !debouncedQuery.trim() && (
        <div
          className="absolute z-50 w-full mt-3 backdrop-blur-md border-2 rounded-3xl shadow-2xl p-6"
          role="listbox"
          style={{
            backgroundColor: 'rgba(26, 26, 26, 0.98)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
          }}
        >
          <p className="text-sm font-semibold mb-3" style={{ color: '#FFFFFF' }}>Popular Searches</p>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((search) => (
              <button
                key={search}
                onClick={() => {
                  setSearchQuery(search);
                  setShowSuggestions(false);
                  if (onSearchChange) {
                    onSearchChange(search);
                  }
                }}
                className="px-4 py-2 text-sm rounded-full transition-colors"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {showSuggestions && debouncedQuery.trim() && suggestions.length === 0 && (
        <div
          className="absolute z-50 w-full mt-3 backdrop-blur-md border-2 rounded-3xl shadow-2xl p-6"
          style={{
            backgroundColor: 'rgba(26, 26, 26, 0.98)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
          }}
        >
          <p className="text-sm text-center" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>No products found</p>
          <p className="text-xs text-center mt-2" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            Try searching for "{popularSearches[0]}" or "{popularSearches[1]}"
          </p>
        </div>
      )}
    </div>
  );
};
