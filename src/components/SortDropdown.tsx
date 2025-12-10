import React from 'react';

export type SortOption = 
  | 'recommended'
  | 'price_low'
  | 'price_high'
  | 'newest'
  | 'bestsellers'
  | 'best_rating'
  | 'most_reviewed';

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'bestsellers', label: 'Best Sellers' },
  { value: 'best_rating', label: 'Best Ratings' },
  { value: 'most_reviewed', label: 'Most Reviewed' },
];

export const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="appearance-none bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl px-5 py-2.5 pr-10 font-medium text-gray-700 hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all cursor-pointer shadow-lg hover:shadow-xl"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};
