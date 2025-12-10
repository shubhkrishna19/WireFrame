import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { mockProducts, Product } from '../data/mockData';

interface SearchAutocompleteProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onSearch: (e: React.FormEvent) => void;
}

export const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
    searchQuery,
    onSearchChange,
    onSearch,
}) => {
    const { theme } = useTheme();
    const [showResults, setShowResults] = useState(false);
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Update suggestions when search query changes
    useEffect(() => {
        if (searchQuery.trim().length >= 2) {
            const searchLower = searchQuery.toLowerCase();
            const filtered = mockProducts
                .filter(product => {
                    if (!product.isActive) return false;

                    const name = product.name?.toLowerCase() || '';
                    const description = product.description?.toLowerCase() || '';
                    const categoryId = product.categoryId?.toLowerCase() || '';
                    const brand = product.brand?.toLowerCase() || '';
                    const tags = product.tags || [];

                    return (
                        name.includes(searchLower) ||
                        description.includes(searchLower) ||
                        categoryId.includes(searchLower) ||
                        brand.includes(searchLower) ||
                        tags.some(tag => tag?.toLowerCase().includes(searchLower))
                    );
                })
                .slice(0, 5);

            setSuggestions(filtered);
            setShowResults(true);
        } else {
            setSuggestions([]);
            setShowResults(false);
        }
    }, [searchQuery]);

    const handleSuggestionClick = (product: Product) => {
        setShowResults(false);
        onSearchChange('');
        // Navigate to product
        window.location.href = `/products/${product.slug}`;
    };

    return (
        <div ref={wrapperRef} className="relative flex-1 max-w-xl">
            <form onSubmit={onSearch} className="relative">
                <input
                    type="text"
                    placeholder="Search for furniture..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                    className="w-full px-4 py-2.5 pr-12 rounded-creative border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{
                        backgroundColor: theme.colors.backgroundPrimary,
                        borderColor: theme.colors.borderPrimary,
                        color: theme.colors.textPrimary,
                    }}
                />
                <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-creative hover:opacity-80 transition-opacity"
                    style={{ color: theme.colors.textSecondary }}
                    aria-label="Search"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </form>

            {/* Autocomplete Dropdown */}
            {showResults && suggestions.length > 0 && (
                <div
                    className="absolute top-full left-0 right-0 mt-2 rounded-creative border-2 shadow-2xl z-50 max-h-96 overflow-y-auto animate-slide-down"
                    style={{
                        backgroundColor: theme.colors.cardBackground,
                        borderColor: theme.colors.borderPrimary,
                    }}
                >
                    {/* Header */}
                    <div className="px-4 py-3 border-b-2" style={{ borderColor: theme.colors.borderSecondary }}>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold" style={{ color: theme.colors.textSecondary }}>
                                {suggestions.length} result{suggestions.length > 1 ? 's' : ''} found
                            </span>
                            <button
                                onClick={() => setShowResults(false)}
                                className="text-sm hover:opacity-80"
                                style={{ color: theme.colors.textSecondary }}
                            >
                                Close
                            </button>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="py-2">
                        {suggestions.map((product) => (
                            <button
                                key={product._id}
                                onClick={() => handleSuggestionClick(product)}
                                className="w-full px-4 py-3 flex items-center gap-4 hover:bg-opacity-80 transition-all group"
                                style={{
                                    backgroundColor: 'transparent',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                            >
                                {/* Product Image */}
                                <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 text-left">
                                    <h4 className="font-semibold mb-1 line-clamp-1" style={{ color: theme.colors.textPrimary }}>
                                        {product.name}
                                    </h4>
                                    <p className="text-sm mb-1 line-clamp-1" style={{ color: theme.colors.textSecondary }}>
                                        {product.description}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-lg" style={{ color: theme.colors.accentPrimary }}>
                                            ₹{product.price.toLocaleString()}
                                        </span>
                                        {product.stock > 0 && product.stock < 10 && (
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500 text-white">
                                                Only {product.stock} left
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Arrow */}
                                <svg
                                    className="w-5 h-5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    style={{ color: theme.colors.textSecondary }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        ))}
                    </div>

                    {/* View All Footer */}
                    <div className="px-4 py-3 border-t-2" style={{ borderColor: theme.colors.borderSecondary }}>
                        <button
                            onClick={(e) => {
                                setShowResults(false);
                                onSearch(e as any);
                            }}
                            className="w-full py-2 rounded-creative font-semibold transition-all hover:opacity-90"
                            style={{
                                background: `linear-gradient(135deg, ${theme.colors.buttonPrimary} 0%, ${theme.colors.buttonSecondary} 100%)`,
                                color: '#FFFFFF',
                            }}
                        >
                            View All Results for "{searchQuery}"
                        </button>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-down {
          animation: slide-down 0.2s ease-out;
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
        </div>
    );
};
