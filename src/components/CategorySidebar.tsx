import React, { useState, useEffect } from 'react';
import * as dataStore from '../store/dataStore';
import { Category } from '../data/mockData';

interface CategorySidebarProps {
  selectedCategoryId?: string | null;
  onCategorySelect?: (categoryId: string | null) => void;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  selectedCategoryId,
  onCategorySelect,
}) => {
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

  const handleCategoryClick = (categoryId: string | null) => {
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">Categories</h2>
      <nav className="space-y-1">
        <button
          onClick={() => handleCategoryClick(null)}
          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${selectedCategoryId === null
              ? 'bg-primary-100 text-primary-700 font-semibold'
              : 'text-gray-700 hover:bg-gray-100'
            }`}
        >
          All Products
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => handleCategoryClick(category._id)}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${selectedCategoryId === category._id
                ? 'bg-primary-100 text-primary-700 font-semibold'
                : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            {category.name}
          </button>
        ))}
      </nav>
    </div>
  );
};
