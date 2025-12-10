import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { usePageTracking } from '../hooks/usePageTracking';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { usePullToRefresh } from '../hooks/usePullToRefresh';
import { AnnouncementBar } from '../components/AnnouncementBar';
import { Navbar } from '../components/Navbar';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { Product } from '../data/mockData';
import { Breadcrumbs } from '../components/Breadcrumbs';

import { FilterSidebar, FilterState } from '../components/FilterSidebar';
import { SortDropdown, SortOption } from '../components/SortDropdown';
import { ActiveFilters } from '../components/ActiveFilters';

import { Footer } from '../components/Footer';
import * as dataStore from '../store/dataStore';
import { loadFilters } from '../utils/filterPersistence';
import { logger } from '../utils/logger';
import { SEO } from '../components/SEO';
import { pageMetadata } from '../utils/seoConfig';

const DEFAULT_FILTERS: FilterState = {
  priceMin: 100,
  priceMax: 100000,
  categories: [],
  brands: [],
  minRating: 0,
  sizes: [],
  colors: [],
  materials: [],
  finishes: [],
  styles: [],
  rooms: [],
};

export const Products: React.FC = () => {
  const { theme } = useTheme();
  usePageTracking('Products');
  const [searchParams, setSearchParams] = useSearchParams();
  const { category, subcategory } = useParams();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Pull to refresh
  const handleRefresh = async () => {
    setHasInitialLoad(false);
    // Wait a bit for the refetch to complete
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const { pullDistance, isRefreshing } = usePullToRefresh({
    onRefresh: handleRefresh,
    threshold: 80,
  });

  const productsPerPage = 20;
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const paramCategories = useMemo(() =>
    category
      ? [decodeURIComponent(category), subcategory ? decodeURIComponent(subcategory) : ''].filter(Boolean)
      : [],
    [category, subcategory]
  );

  // Load state from URL or localStorage on mount
  useEffect(() => {

    const urlFilters: FilterState = {
      priceMin: Number(searchParams.get('price_min')) || DEFAULT_FILTERS.priceMin,
      priceMax: Number(searchParams.get('price_max')) || DEFAULT_FILTERS.priceMax,
      categories: paramCategories.length > 0 ? paramCategories : (searchParams.get('category')?.split(',').filter(Boolean) || []),
      brands: searchParams.get('brand')?.split(',').filter(Boolean) || [],
      minRating: Number(searchParams.get('rating')) || 0,
      sizes: searchParams.get('size')?.split(',').filter(Boolean) || [],
      colors: searchParams.get('color')?.split(',').filter(Boolean) || [],
      materials: searchParams.get('material')?.split(',').filter(Boolean) || [],
      finishes: searchParams.get('finish')?.split(',').filter(Boolean) || [],
      styles: searchParams.get('style')?.split(',').filter(Boolean) || [],
      rooms: searchParams.get('room')?.split(',').filter(Boolean) || [],
    };

    // Use URL filters if present, otherwise try localStorage
    const finalFilters = Object.keys(urlFilters).some(key => {
      const value = urlFilters[key as keyof FilterState];
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'number') {
        if (key === 'priceMin') return value !== DEFAULT_FILTERS.priceMin;
        if (key === 'priceMax') return value !== DEFAULT_FILTERS.priceMax;
        return value !== 0;
      }
      return false;
    }) ? urlFilters : (loadFilters() || urlFilters);

    setFilters(finalFilters);
    setAppliedFilters(finalFilters);
    setSortBy((searchParams.get('sort') as SortOption) || 'recommended');
    setSearchQuery(searchParams.get('search') || '');
    setCurrentPage(Number(searchParams.get('page')) || 1);
  }, []);

  // Scroll animations
  useEffect(() => {
    const observers = sectionRefs.current.map((ref) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-slide-in');
              entry.target.classList.remove('opacity-0');
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px',
        }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, [appliedFilters, searchQuery, sortBy]);

  // Update URL when filters/sort/search change
  const updateURL = (newFilters: FilterState, newSort: SortOption, newSearch: string, newPage: number) => {
    const params = new URLSearchParams();

    if (newSearch) params.set('search', newSearch);
    if (newFilters.priceMin > DEFAULT_FILTERS.priceMin) params.set('price_min', newFilters.priceMin.toString());
    if (newFilters.priceMax < DEFAULT_FILTERS.priceMax) params.set('price_max', newFilters.priceMax.toString());
    if (newFilters.categories.length > 0) params.set('category', newFilters.categories.join(','));
    if (newFilters.brands.length > 0) params.set('brand', newFilters.brands.join(','));
    if (newFilters.minRating > 0) params.set('rating', newFilters.minRating.toString());
    if (newFilters.sizes.length > 0) params.set('size', newFilters.sizes.join(','));
    if (newFilters.colors.length > 0) params.set('color', newFilters.colors.join(','));
    if (newFilters.materials.length > 0) params.set('material', newFilters.materials.join(','));
    if (newFilters.finishes.length > 0) params.set('finish', newFilters.finishes.join(','));
    if (newFilters.styles.length > 0) params.set('style', newFilters.styles.join(','));
    if (newFilters.rooms.length > 0) params.set('room', newFilters.rooms.join(','));
    if (newSort !== 'recommended') params.set('sort', newSort);
    if (newPage > 1) params.set('page', newPage.toString());

    setSearchParams(params, { replace: true });
  };

  // Get and filter products
  const [filteredAndSortedProducts, setFilteredAndSortedProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      // Only show loading on initial load or when search/filters change significantly
      if (!hasInitialLoad) {
        setIsLoadingProducts(true);
      }

      try {
        const categoryId = appliedFilters.categories.length > 0 ? appliedFilters.categories[0] : undefined;

        const products = await dataStore.getProducts({
          categoryId,
          search: searchQuery || undefined,
          priceMin: appliedFilters.priceMin,
          priceMax: appliedFilters.priceMax,
          brands: appliedFilters.brands.length > 0 ? appliedFilters.brands : undefined,
          minRating: appliedFilters.minRating > 0 ? appliedFilters.minRating : undefined,
          sizes: appliedFilters.sizes.length > 0 ? appliedFilters.sizes : undefined,
          colors: appliedFilters.colors.length > 0 ? appliedFilters.colors : undefined,
          materials: appliedFilters.materials.length > 0 ? appliedFilters.materials : undefined,
          finishes: appliedFilters.finishes.length > 0 ? appliedFilters.finishes : undefined,
          styles: appliedFilters.styles.length > 0 ? appliedFilters.styles : undefined,
          rooms: appliedFilters.rooms.length > 0 ? appliedFilters.rooms : undefined,
          tags: paramCategories.length > 1 ? [paramCategories[1]] : undefined,
        });

        // Sorting
        const sorted = [...products];
        switch (sortBy) {
          case 'price_low':
            sorted.sort((a, b) => a.price - b.price);
            break;
          case 'price_high':
            sorted.sort((a, b) => b.price - a.price);
            break;
          case 'newest':
            sorted.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
            break;
          case 'bestsellers':
            sorted.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
            break;
          case 'best_rating':
            sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
          case 'most_reviewed':
            sorted.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
            break;
          case 'recommended':
          default:
            sorted.sort((a, b) => {
              // Prioritize featured products
              if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
              // Then by rating
              if ((b.rating || 0) !== (a.rating || 0)) return (b.rating || 0) - (a.rating || 0);
              // Then by review count
              return (b.reviewCount || 0) - (a.reviewCount || 0);
            });
            break;
        }

        setFilteredAndSortedProducts(sorted);
        setHasInitialLoad(true);

        // Reset to page 1 if current page would be empty
        const totalPages = Math.ceil(sorted.length / productsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(1);
        }
      } catch (error) {
        logger.error('Error fetching products:', error);
        setFilteredAndSortedProducts([]);
        setCurrentPage(1);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [searchQuery, appliedFilters, sortBy, hasInitialLoad]);

  // Apply filters immediately when they change
  useEffect(() => {
    setAppliedFilters(filters);
    setCurrentPage(1);
    // Scroll to top when filters change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filters]);

  // Reset to page 1 when sort changes
  useEffect(() => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [sortBy]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchQuery]);

  // Pagination & Infinite Scroll
  const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);
  const hasMore = currentPage < totalPages;

  const { observerTarget } = useInfiniteScroll({
    hasMore,
    isLoading: false, // Client-side filtering is instant
    onLoadMore: () => {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      updateURL(appliedFilters, sortBy, searchQuery, nextPage);
    },
  });

  const visibleProducts = useMemo(() => {
    // Show all products up to the current page (accumulative for infinite scroll)
    return filteredAndSortedProducts.slice(0, currentPage * productsPerPage);
  }, [filteredAndSortedProducts, currentPage]);



  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setCurrentPage(1);
    updateURL(filters, sortBy, searchQuery, 1);
    setIsFilterDrawerOpen(false);
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
    updateURL(DEFAULT_FILTERS, sortBy, searchQuery, 1);
  };

  const handleRemoveFilter = (type: keyof FilterState, value?: any) => {
    const newFilters = { ...appliedFilters };

    if (type === 'priceMin' || type === 'priceMax' || type === 'minRating') {
      newFilters[type] = value !== undefined ? value : DEFAULT_FILTERS[type];
    } else if (Array.isArray(newFilters[type])) {
      const arr = newFilters[type] as any[];
      if (value !== undefined) {
        newFilters[type] = arr.filter((v) => v !== value) as any;
      } else {
        newFilters[type] = [] as any;
      }
    }

    setFilters(newFilters);
    setAppliedFilters(newFilters);
    setCurrentPage(1);
    updateURL(newFilters, sortBy, searchQuery, 1);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    setCurrentPage(1);
    updateURL(appliedFilters, newSort, searchQuery, 1);
  };





  const handleAddToCart = (_productId: string) => {
    // This is handled by ProductCard component now
    // Keeping for backward compatibility
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: theme.colors.backgroundPrimary,
        color: theme.colors.textPrimary,
      }}
    >
      <SEO
        title={pageMetadata.products.title}
        description={pageMetadata.products.description}
      />
      <AnnouncementBar />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs />
      </div>

      {/* Pull to Refresh Indicator */}
      {(pullDistance > 0 || isRefreshing) && (
        <div
          className="fixed top-0 left-0 right-0 z-40 flex justify-center pointer-events-none"
          style={{ transform: `translateY(${Math.min(pullDistance, 80)}px)` }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg">
            {isRefreshing ? (
              <svg className="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ActiveFilters
          filters={appliedFilters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearFilters}
          productCount={filteredAndSortedProducts.length}
        />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar - Desktop */}
          <aside className="hidden lg:block lg:w-72 flex-shrink-0">
            <div
              className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: `${theme.colors.borderPrimary} transparent`,
              }}
            >
              <FilterSidebar
                filters={filters}
                onFiltersChange={setFilters}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
              />
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
            isOpen={isFilterDrawerOpen}
            onClose={() => setIsFilterDrawerOpen(false)}
          />

          {/* Main Content */}
          <main className="flex-1">
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1
                  className="text-4xl font-extrabold drop-shadow-[0_12px_40px_rgba(0,0,0,0.65)] tracking-[0.18em] uppercase"
                  style={{ color: theme.colors.textPrimary }}
                >
                  Products
                </h1>
                <p
                  className="font-bold"
                  style={{ color: theme.colors.textSecondary }}
                >
                  {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'product' : 'products'} found
                </p>
              </div>
              <div className="hidden lg:block">
                <SortDropdown value={sortBy} onChange={handleSortChange} />
              </div>
            </div>

            {isLoadingProducts ? (
              // Loading skeleton
              <div className="product-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: productsPerPage }, (_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="animate-pulse"
                  >
                    <div className="bg-neutral-800 rounded-creative p-4 h-96">
                      <div className="bg-neutral-700 h-48 rounded-creative mb-4"></div>
                      <div className="bg-neutral-700 h-4 rounded mb-2"></div>
                      <div className="bg-neutral-700 h-4 rounded w-3/4 mb-2"></div>
                      <div className="bg-neutral-700 h-4 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : visibleProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-block p-8 bg-neutral-800 border-2 border-neutral-700 rounded-creative shadow-card">
                  <svg className="w-16 h-16 text-neutral-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-neutral-300 text-lg mb-4">No products found.</p>
                  <button
                    onClick={handleClearFilters}
                    className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-creative font-extrabold uppercase tracking-wider hover:from-primary-700 hover:to-primary-800 transition-all duration-300 transform hover:scale-105 shadow-elegant"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="product-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
                {visibleProducts.map((product, index) => (
                  <div
                    key={product._id}
                    ref={(el) => {
                      sectionRefs.current[index] = el;
                    }}
                    className="opacity-100"
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                      onQuickView={setQuickViewProduct}
                      index={index}
                    />
                  </div>
                ))}
              </div>
            )}



            {/* Infinite Scroll Loading Indicator */}
            {hasMore && (
              <div
                ref={observerTarget}
                className="mt-8 flex justify-center items-center py-8"
              >
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-neutral-200 border-t-primary-600"></div>
              </div>
            )}

            {/* End of Results Message */}
            {!hasMore && visibleProducts.length > 0 && (
              <div className="mt-12 text-center text-neutral-400 pb-12 font-medium">
                <p>You've viewed all {filteredAndSortedProducts.length} products</p>
              </div>
            )}
          </main>

          {/* Quick View Modal */}
          {quickViewProduct && (
            <QuickViewModal
              product={quickViewProduct}
              onClose={() => setQuickViewProduct(null)}
            />
          )}
        </div >
      </div >

      <Footer />
    </div >
  );
};
