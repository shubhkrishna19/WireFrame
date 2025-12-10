import React, { useState, useEffect } from 'react';
import * as dataStore from '../store/dataStore';
import { FilterState } from './FilterSidebar';
import { useTheme } from '../contexts/ThemeContext';
import { getFilterBadgeStyle } from '../utils/filterBadgeStyles';
import { Category } from '../data/mockData';

interface ActiveFiltersProps {
  filters: FilterState;
  onRemoveFilter: (type: keyof FilterState, value?: any) => void;
  onClearAll: () => void;
  productCount: number;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onRemoveFilter,
  onClearAll,
  productCount,
}) => {
  const { theme } = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await dataStore.getCategories();
        setCategories(cats);
      } catch (error) {
        console.error('Error loading categories:', error);
        setCategories([]);
      }
    };
    loadCategories();
  }, []);

  const hasActiveFilters =
    filters.priceMin > 100 ||
    filters.priceMax < 10000 ||
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.minRating > 0 ||
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.materials.length > 0 ||
    filters.finishes.length > 0 ||
    filters.styles.length > 0 ||
    filters.rooms.length > 0;

  if (!hasActiveFilters) return null;

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c._id === categoryId)?.name || 'Category';
  };

  return (
    <div
      className="border-2 rounded-creative shadow-card p-6 mb-8"
      style={{
        backgroundColor: theme.colors.cardBackground,
        borderColor: theme.colors.borderPrimary,
      }}
    >
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span
          className="text-sm font-semibold"
          style={{ color: theme.colors.textPrimary }}
        >
          {productCount} product{productCount !== 1 ? 's' : ''} found
        </span>
        <span style={{ color: theme.colors.textTertiary }}>|</span>
        <span
          className="text-sm"
          style={{ color: theme.colors.textSecondary }}
        >
          Active filters:
        </span>

        {filters.priceMin > 100 && (() => {
          const badgeStyle = getFilterBadgeStyle(theme, 'brandPrimary');
          return (
            <button
              onClick={() => onRemoveFilter('priceMin', 100)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-creative text-sm font-semibold transition-all shadow-sm hover:shadow-md border-2"
              style={badgeStyle.style}
              onMouseEnter={badgeStyle.onMouseEnter}
              onMouseLeave={badgeStyle.onMouseLeave}
            >
              Min: â‚¹{filters.priceMin}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          );
        })()}

        {filters.priceMax < 10000 && (() => {
          const badgeStyle = getFilterBadgeStyle(theme, 'brandPrimary');
          return (
            <button
              onClick={() => onRemoveFilter('priceMax', 10000)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-creative text-sm font-semibold transition-all shadow-sm hover:shadow-md border-2"
              style={badgeStyle.style}
              onMouseEnter={badgeStyle.onMouseEnter}
              onMouseLeave={badgeStyle.onMouseLeave}
            >
              Max: â‚¹{filters.priceMax}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          );
        })()}

        {filters.categories.map((categoryId) => {
          const badgeStyle = getFilterBadgeStyle(theme, 'stateSuccess');
          return (
            <button
              key={categoryId}
              onClick={() => onRemoveFilter('categories', categoryId)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-creative text-sm font-semibold transition-all shadow-sm hover:shadow-md border-2"
              style={badgeStyle.style}
              onMouseEnter={badgeStyle.onMouseEnter}
              onMouseLeave={badgeStyle.onMouseLeave}
            >
              {getCategoryName(categoryId)}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          );
        })}

        {filters.brands.map((brand) => {
          const badgeStyle = getFilterBadgeStyle(theme, 'accentCool');
          return (
            <button
              key={brand}
              onClick={() => onRemoveFilter('brands', brand)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-creative text-sm font-semibold transition-all shadow-sm hover:shadow-md border-2"
              style={badgeStyle.style}
              onMouseEnter={badgeStyle.onMouseEnter}
              onMouseLeave={badgeStyle.onMouseLeave}
            >
              {brand}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          );
        })}

        {filters.minRating > 0 && (() => {
          const badgeStyle = getFilterBadgeStyle(theme, 'stateWarning');
          return (
            <button
              onClick={() => onRemoveFilter('minRating', 0)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-creative text-sm font-semibold transition-all shadow-sm hover:shadow-md border-2"
              style={badgeStyle.style}
              onMouseEnter={badgeStyle.onMouseEnter}
              onMouseLeave={badgeStyle.onMouseLeave}
            >
              {filters.minRating}â˜…+
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          );
        })()}

        {filters.sizes.map((size) => {
          const badgeStyle = getFilterBadgeStyle(theme, 'accentWarm');
          return (
            <button
              key={size}
              onClick={() => onRemoveFilter('sizes', size)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-creative text-sm font-semibold transition-all shadow-sm hover:shadow-md border-2"
              style={badgeStyle.style}
              onMouseEnter={badgeStyle.onMouseEnter}
              onMouseLeave={badgeStyle.onMouseLeave}
            >
              Size: {size}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          );
        })}

        {filters.colors.map((color) => {
          const badgeStyle = getFilterBadgeStyle(theme, 'brandDark');
          return (
            <button
              key={color}
              onClick={() => onRemoveFilter('colors', color)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-creative text-sm font-semibold transition-all shadow-sm hover:shadow-md border-2"
              style={badgeStyle.style}
              onMouseEnter={badgeStyle.onMouseEnter}
              onMouseLeave={badgeStyle.onMouseLeave}
              title={`Remove ${color} color filter`}
            >
              <span
                className="w-4 h-4 rounded-full border-2 border-neutral-600"
                style={{ backgroundColor: color }}
                aria-label={color}
              />
              <span className="sr-only">{color}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          );
        })}

        {filters.materials.map((material) => {
          const badgeStyle = getFilterBadgeStyle(theme, 'accentWarm');
          return (
            <button
              key={material}
              onClick={() => onRemoveFilter('materials', material)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-creative text-sm font-semibold transition-all shadow-sm hover:shadow-md border-2"
              style={badgeStyle.style}
              onMouseEnter={badgeStyle.onMouseEnter}
              onMouseLeave={badgeStyle.onMouseLeave}
            >
              {material}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          );
        })}

        {filters.finishes.map((finish) => {
          const badgeStyle = getFilterBadgeStyle(theme, 'stateWarning');
          return (
            <button
              key={finish}
              onClick={() => onRemoveFilter('finishes', finish)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-creative text-sm font-semibold transition-all shadow-sm hover:shadow-md border-2"
              style={badgeStyle.style}
              onMouseEnter={badgeStyle.onMouseEnter}
              onMouseLeave={badgeStyle.onMouseLeave}
            >
              {finish}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          );
        })}

        {filters.styles.map((style) => {
          const badgeStyle = getFilterBadgeStyle(theme, 'accentCool');
          return (
            <button
              key={style}
              onClick={() => onRemoveFilter('styles', style)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-creative text-sm font-semibold transition-all shadow-sm hover:shadow-md border-2"
              style={badgeStyle.style}
              onMouseEnter={badgeStyle.onMouseEnter}
              onMouseLeave={badgeStyle.onMouseLeave}
            >
              {style}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          );
        })}

        {filters.rooms.map((room) => {
          const badgeStyle = getFilterBadgeStyle(theme, 'brandDark');
          return (
            <button
              key={room}
              onClick={() => onRemoveFilter('rooms', room)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-creative text-sm font-semibold transition-all shadow-sm hover:shadow-md border-2"
              style={badgeStyle.style}
              onMouseEnter={badgeStyle.onMouseEnter}
              onMouseLeave={badgeStyle.onMouseLeave}
            >
              {room}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          );
        })}
      </div>

      <button
        onClick={onClearAll}
        className="px-6 py-3 text-sm font-extrabold uppercase tracking-wider rounded-creative transition-all border-2"
        style={{
          color: theme.colors.textPrimary,
          backgroundColor: theme.colors.backgroundTertiary,
          borderColor: theme.colors.borderPrimary,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
          e.currentTarget.style.borderColor = theme.colors.brandPrimary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = theme.colors.backgroundTertiary;
          e.currentTarget.style.borderColor = theme.colors.borderPrimary;
        }}
      >
        Clear All Filters
      </button>
    </div>
  );
};

