import React, { useMemo, useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import * as dataStore from '../store/dataStore';
import { analytics } from '../utils/analytics';
import { BottomSheet } from './BottomSheet';

export interface FilterState {
  priceMin: number;
  priceMax: number;
  categories: string[];
  brands: string[];
  minRating: number;
  sizes: string[];
  materials: string[];
  finishes: string[];
  styles: string[];
  rooms: string[];
  colors: string[];
}

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onApplyFilters?: () => void;
  onClearFilters: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const MATERIAL_OPTIONS = ['Engineered Wood', 'Solid Wood', 'Metal', 'Glass', 'Fabric', 'Leather'];
const FINISH_OPTIONS = ['Matte', 'Glossy', 'Wood Grain', 'Textured', 'Polished'];
const STYLE_OPTIONS = ['Modern', 'Contemporary', 'Traditional', 'Minimalist', 'Industrial'];
const ROOM_OPTIONS = ['Living Room', 'Bedroom', 'Dining Room', 'Office', 'Storage', 'Entryway'];

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

interface SectionDefinition {
  key: string;
  title: string;
  render: () => React.ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { theme } = useTheme();

  return (
    <div
      className="border-b pb-4 mb-4"
      style={{ borderColor: theme.colors.borderPrimary }}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 text-left"
      >
        <h3
          className="text-sm font-bold uppercase tracking-[0.3em] flex items-center gap-2"
          style={{ color: theme.colors.textPrimary }}
        >
          <span
            className="h-1 w-6 rounded-full"
            style={{ backgroundColor: theme.colors.borderPrimary }}
          ></span>
          {title}
        </h3>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: theme.colors.textSecondary }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && <div className="mt-3 space-y-3">{children}</div>}
    </div>
  );
};

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
  isOpen = true,
  onClose,
}) => {
  const { theme } = useTheme();
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // Load products and categories on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          dataStore.getProducts({ priceMin: 0, priceMax: 100000 }),
          dataStore.getCategories()
        ]);
        setAllProducts(productsData);
        setCategories(categoriesData.filter((category) => category.isActive));
      } catch (error) {
        console.error('Error loading filter data:', error);
        setAllProducts([]);
        setCategories([]);
      }
    };

    loadData();
  }, []);

  const brands = useMemo(() => {
    const uniqueBrands = new Set(allProducts.map((p) => p.brand));
    return Array.from(uniqueBrands).sort();
  }, [allProducts]);

  const availableColors = useMemo(() => {
    const colorSet = new Set<string>();
    allProducts.forEach((p) => {
      // Safety check: only process if colors array exists
      if (p.colors && Array.isArray(p.colors)) {
        p.colors.forEach((c: string) => colorSet.add(c));
      }
    });
    return Array.from(colorSet);
  }, [allProducts]);

  const [activeSections, setActiveSections] = useState<string[]>(['price', 'category', 'room', 'material']);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = <K extends 'categories' | 'brands' | 'materials' | 'finishes' | 'styles' | 'rooms' | 'colors'>(
    key: K,
    value: string
  ) => {
    const current = filters[key] as string[];
    const newValue = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateFilter(key, newValue as FilterState[K]);
  };

  const toggleSectionSelection = (sectionKey: string) => {
    setActiveSections((prev) =>
      prev.includes(sectionKey) ? prev.filter((key) => key !== sectionKey) : [...prev, sectionKey]
    );
  };

  const renderPriceSection = () => (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="number"
          min="100"
          max="100000"
          value={filters.priceMin}
          onChange={(e) => updateFilter('priceMin', Number(e.target.value))}
          className="w-full px-3 py-2 rounded-creative text-sm focus:outline-none transition-all"
          style={{
            backgroundColor: theme.colors.backgroundTertiary,
            borderColor: theme.colors.borderPrimary,
            borderWidth: '1px',
            borderStyle: 'solid',
            color: theme.colors.textPrimary,
          }}
          placeholder="Min"
          aria-label="Minimum price"
        />
        <input
          type="number"
          min="100"
          max="100000"
          value={filters.priceMax}
          onChange={(e) => updateFilter('priceMax', Number(e.target.value))}
          className="w-full px-3 py-2 rounded-creative text-sm focus:outline-none transition-all"
          style={{
            backgroundColor: theme.colors.backgroundTertiary,
            borderColor: theme.colors.borderPrimary,
            borderWidth: '1px',
            borderStyle: 'solid',
            color: theme.colors.textPrimary,
          }}
          placeholder="Max"
          aria-label="Maximum price"
        />
      </div>
      <label className="sr-only">Price range slider</label>
      <input
        type="range"
        min="100"
        max="100000"
        step="100"
        value={filters.priceMax}
        onChange={(e) => updateFilter('priceMax', Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          backgroundColor: theme.colors.backgroundTertiary,
          accentColor: theme.colors.brandPrimary,
        }}
        aria-label="Price range slider"
      />
      <div
        className="flex justify-between text-xs"
        style={{ color: theme.colors.textTertiary }}
      >
        <span>â‚¹{filters.priceMin}</span>
        <span>â‚¹{filters.priceMax}</span>
      </div>
    </div>
  );

  const renderCategorySection = () => (
    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
      {categories.map((category) => (
        <label key={category._id} className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.categories.includes(category._id)}
            onChange={() => toggleArrayFilter('categories', category._id)}
            className="w-4 h-4 rounded focus:ring-2"
            style={{
              accentColor: theme.colors.brandPrimary,
              backgroundColor: theme.colors.backgroundTertiary,
              borderColor: theme.colors.borderPrimary,
            }}
          />
          <span
            className="text-sm transition-colors group-hover:opacity-80"
            style={{ color: theme.colors.textSecondary }}
          >
            {category.name}
          </span>
        </label>
      ))}
    </div>
  );

  const renderMaterialSection = () => (
    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
      {MATERIAL_OPTIONS.map((material) => (
        <label key={material} className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.materials.includes(material)}
            onChange={() => toggleArrayFilter('materials', material)}
            className="w-4 h-4 rounded focus:ring-2"
            style={{
              accentColor: theme.colors.brandPrimary,
              backgroundColor: theme.colors.backgroundTertiary,
              borderColor: theme.colors.borderPrimary,
            }}
          />
          <span
            className="text-sm transition-colors group-hover:opacity-80"
            style={{ color: theme.colors.textSecondary }}
          >
            {material}
          </span>
        </label>
      ))}
    </div>
  );

  const renderFinishSection = () => (
    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
      {FINISH_OPTIONS.map((finish) => (
        <label key={finish} className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.finishes.includes(finish)}
            onChange={() => toggleArrayFilter('finishes', finish)}
            className="w-4 h-4 rounded focus:ring-2"
            style={{
              accentColor: theme.colors.brandPrimary,
              backgroundColor: theme.colors.backgroundTertiary,
              borderColor: theme.colors.borderPrimary,
            }}
          />
          <span
            className="text-sm transition-colors group-hover:opacity-80"
            style={{ color: theme.colors.textSecondary }}
          >
            {finish}
          </span>
        </label>
      ))}
    </div>
  );

  const renderStyleSection = () => (
    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
      {STYLE_OPTIONS.map((style) => (
        <label key={style} className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.styles.includes(style)}
            onChange={() => toggleArrayFilter('styles', style)}
            className="w-4 h-4 rounded focus:ring-2"
            style={{
              accentColor: theme.colors.brandPrimary,
              backgroundColor: theme.colors.backgroundTertiary,
              borderColor: theme.colors.borderPrimary,
            }}
          />
          <span
            className="text-sm transition-colors group-hover:opacity-80"
            style={{ color: theme.colors.textSecondary }}
          >
            {style}
          </span>
        </label>
      ))}
    </div>
  );

  const renderRoomSection = () => (
    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
      {ROOM_OPTIONS.map((room) => (
        <label key={room} className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.rooms.includes(room)}
            onChange={() => toggleArrayFilter('rooms', room)}
            className="w-4 h-4 rounded focus:ring-2"
            style={{
              accentColor: theme.colors.brandPrimary,
              backgroundColor: theme.colors.backgroundTertiary,
              borderColor: theme.colors.borderPrimary,
            }}
          />
          <span
            className="text-sm transition-colors group-hover:opacity-80"
            style={{ color: theme.colors.textSecondary }}
          >
            {room}
          </span>
        </label>
      ))}
    </div>
  );

  const renderBrandsSection = () => (
    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
      {brands.map((brand) => {
        const isSelected = filters.brands.includes(brand);
        return (
          <button
            type="button"
            key={brand}
            onClick={() => toggleArrayFilter('brands', brand)}
            className="px-4 py-2 rounded-creative border-2 text-sm font-semibold transition-all"
            style={{
              borderColor: isSelected ? theme.colors.brandPrimary : theme.colors.borderPrimary,
              backgroundColor: isSelected ? `${theme.colors.brandPrimary}25` : 'transparent',
              color: isSelected ? theme.colors.textPrimary : theme.colors.textSecondary,
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = theme.colors.brandPrimary;
                e.currentTarget.style.color = theme.colors.textPrimary;
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = theme.colors.borderPrimary;
                e.currentTarget.style.color = theme.colors.textSecondary;
              }
            }}
          >
            {brand}
          </button>
        );
      })}
    </div>
  );

  const renderRatingSection = () => (
    <div className="space-y-2">
      {[4, 3, 2, 1].map((rating) => (
        <label key={rating} className="flex items-center gap-2 cursor-pointer group">
          <input
            type="radio"
            name="rating"
            checked={filters.minRating === rating}
            onChange={() => updateFilter('minRating', rating)}
            className="w-4 h-4 focus:ring-2"
            style={{
              accentColor: theme.colors.brandPrimary,
              backgroundColor: theme.colors.backgroundTertiary,
              borderColor: theme.colors.borderPrimary,
            }}
          />
          <span
            className="text-sm transition-colors group-hover:opacity-80"
            style={{ color: theme.colors.textSecondary }}
          >
            {rating}â˜… and above
          </span>
        </label>
      ))}
      <label className="flex items-center gap-2 cursor-pointer group">
        <input
          type="radio"
          name="rating"
          checked={filters.minRating === 0}
          onChange={() => updateFilter('minRating', 0)}
          className="w-4 h-4 focus:ring-2"
          style={{
            accentColor: theme.colors.brandPrimary,
            backgroundColor: theme.colors.backgroundTertiary,
            borderColor: theme.colors.borderPrimary,
          }}
        />
        <span
          className="text-sm transition-colors group-hover:opacity-80"
          style={{ color: theme.colors.textSecondary }}
        >
          All Ratings
        </span>
      </label>
    </div>
  );

  const renderColorsSection = () => (
    <div className="flex flex-wrap gap-2">
      {availableColors.map((color) => {
        const isSelected = filters.colors.includes(color);
        return (
          <button
            type="button"
            key={color}
            onClick={() => toggleArrayFilter('colors', color)}
            className="relative w-10 h-10 rounded-full border-2 transition-all"
            style={{
              backgroundColor: color,
              borderColor: isSelected ? theme.colors.brandPrimary : theme.colors.borderPrimary,
              boxShadow: isSelected ? `0 0 0 2px ${theme.colors.brandPrimary}60` : 'none',
            }}
            title={color}
          >
            {isSelected && (
              <svg
                className="absolute inset-0 m-auto w-5 h-5 drop-shadow-lg"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: '#FFFFFF' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );

  const sectionDefinitions: SectionDefinition[] = [
    { key: 'price', title: 'Price', render: renderPriceSection, defaultOpen: true },
    { key: 'category', title: 'Category', render: renderCategorySection },
    { key: 'room', title: 'Room', render: renderRoomSection },
    { key: 'material', title: 'Material', render: renderMaterialSection },
    { key: 'finish', title: 'Finish', render: renderFinishSection },
    { key: 'style', title: 'Style', render: renderStyleSection },
    { key: 'brands', title: 'Brands', render: renderBrandsSection },
    { key: 'rating', title: 'Rating', render: renderRatingSection },
    { key: 'colors', title: 'Colors', render: renderColorsSection },
  ];

  const selectedSections = sectionDefinitions.filter((section) => activeSections.includes(section.key));

  const content = (
    <div className="space-y-6">
      <div
        className="border rounded-creative shadow-card p-4"
        style={{
          backgroundColor: theme.colors.cardBackground,
          borderColor: theme.colors.borderPrimary,
        }}
      >
        <p
          className="text-xs uppercase tracking-[0.35em] mb-3"
          style={{ color: theme.colors.textTertiary }}
        >
          Choose filters
        </p>
        <div className="flex flex-wrap gap-2">
          {sectionDefinitions.map((section) => {
            const isActive = activeSections.includes(section.key);
            return (
              <button
                type="button"
                key={section.key}
                onClick={() => toggleSectionSelection(section.key)}
                className="px-4 py-2 text-xs uppercase tracking-[0.3em] rounded-creative border-2 transition-all"
                style={{
                  borderColor: isActive ? theme.colors.brandPrimary : theme.colors.borderPrimary,
                  backgroundColor: isActive ? `${theme.colors.brandPrimary}25` : 'transparent',
                  color: isActive ? theme.colors.textPrimary : theme.colors.textTertiary,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = theme.colors.brandPrimary;
                    e.currentTarget.style.color = theme.colors.textPrimary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = theme.colors.borderPrimary;
                    e.currentTarget.style.color = theme.colors.textTertiary;
                  }
                }}
              >
                {section.title}
              </button>
            );
          })}
        </div>
        <p
          className="text-[0.7rem] mt-3 uppercase tracking-[0.25em]"
          style={{ color: theme.colors.textTertiary }}
        >
          Toggle a group to expand its filters.
        </p>
      </div>

      {selectedSections.length === 0 ? (
        <div
          className="border rounded-creative p-6 text-sm"
          style={{
            backgroundColor: theme.colors.cardBackground,
            borderColor: theme.colors.borderPrimary,
            color: theme.colors.textTertiary,
          }}
        >
          Select a filter group to refine the collection.
        </div>
      ) : (
        selectedSections.map((section) => (
          <CollapsibleSection
            key={section.key}
            title={section.title}
            defaultOpen={section.defaultOpen ?? true}
          >
            {section.render()}
          </CollapsibleSection>
        ))
      )}

      <div
        className="space-y-3 pt-6 border-t-2"
        style={{ borderColor: theme.colors.borderPrimary }}
      >
        <button
          type="button"
          onClick={() => {
            // Track filter usage
            const activeFilters: Record<string, any> = {};
            if (filters.categories.length > 0) activeFilters.categories = filters.categories;
            if (filters.brands.length > 0) activeFilters.brands = filters.brands;
            if (filters.colors.length > 0) activeFilters.colors = filters.colors;
            if (filters.materials.length > 0) activeFilters.materials = filters.materials;
            if (filters.finishes.length > 0) activeFilters.finishes = filters.finishes;
            if (filters.styles.length > 0) activeFilters.styles = filters.styles;
            if (filters.rooms.length > 0) activeFilters.rooms = filters.rooms;
            if (filters.minRating > 0) activeFilters.minRating = filters.minRating;
            if (filters.priceMin > 100 || filters.priceMax < 100000) {
              activeFilters.priceRange = `${filters.priceMin}-${filters.priceMax}`;
            }

            analytics.filter(activeFilters);
            analytics.buttonClick('Apply Filters', 'Filter Sidebar');
            onApplyFilters?.();
          }}
          className="w-full px-6 py-4 rounded-creative font-extrabold uppercase tracking-[0.35em] transition-all duration-300 transform hover:scale-105 shadow-elegant"
          style={{
            background: `linear-gradient(135deg, ${theme.colors.buttonPrimary} 0%, ${theme.colors.buttonSecondary} 100%)`,
            color: '#FFFFFF',
          }}
          aria-label="Apply selected filters"
        >
          Apply Filters
        </button>
        <button
          type="button"
          onClick={() => {
            analytics.buttonClick('Clear Filters', 'Filter Sidebar');
            onClearFilters();
          }}
          className="w-full px-6 py-4 border-2 rounded-creative font-extrabold uppercase tracking-[0.35em] transition-all duration-300"
          style={{
            backgroundColor: theme.colors.backgroundTertiary,
            borderColor: theme.colors.borderPrimary,
            color: theme.colors.textSecondary,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
            e.currentTarget.style.borderColor = theme.colors.borderSecondary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.backgroundTertiary;
            e.currentTarget.style.borderColor = theme.colors.borderPrimary;
          }}
          aria-label="Clear all filters"
        >
          Clear All
        </button>
      </div>
    </div>
  );

  if (onClose) {
    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title="FILTERS"
        showApplyButton={false}
      >
        <div className="pb-8">
          {content}
        </div>
      </BottomSheet>
    );
  }

  return (
    <div
      className="border-2 rounded-creative shadow-card p-6 h-fit sticky top-24"
      style={{
        backgroundColor: theme.colors.backgroundPrimary,
        borderColor: theme.colors.borderPrimary,
      }}
    >
      {content}
    </div>
  );
};


