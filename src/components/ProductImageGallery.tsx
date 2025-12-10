import React, { useState, useEffect } from 'react';
import { Product } from '../data/mockData';
import { colorImageMap } from '../data/productImages';
import { useTheme } from '../contexts/ThemeContext';
import { getColorHex } from '../utils/colorMap';

interface ProductImageGalleryProps {
  product: Product;
  selectedColor: string;
  onImageClick?: (index: number) => void;
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ product, selectedColor, onImageClick }) => {
  const { theme } = useTheme();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [displayImages, setDisplayImages] = useState<string[]>([]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  // Get color-matched images or default images
  useEffect(() => {
    // Priority: product.colorImages[selectedColor] > colorImageMap > product.images > thumbnail
    const productColorImages = product.colorImages?.[selectedColor];
    const legacyColorImages = colorImageMap[product._id]?.[selectedColor];

    const colorImages = productColorImages ||
      legacyColorImages ||
      product.images ||
      [product.thumbnail];

    setDisplayImages(colorImages);
    setSelectedImageIndex(0);
  }, [selectedColor, product]);

  // Get background color based on selected color
  const backgroundColor = `${getColorHex(selectedColor)}15`; // 15 = ~8% opacity in hex

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        className="aspect-square overflow-hidden border-2 shadow-elegant relative group cursor-zoom-in rounded-creative"
        style={{
          backgroundColor: backgroundColor,
          borderColor: theme.colors.borderPrimary,
        }}
        onClick={() => onImageClick?.(selectedImageIndex)}
        onMouseMove={(e) => {
          if (isZoomed) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setZoomPosition({ x, y });
          }
        }}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>

        <img
          src={displayImages[selectedImageIndex] || product.thumbnail}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{
            transform: isZoomed ? `scale(2) translate(${-zoomPosition.x}%, ${-zoomPosition.y}%)` : 'scale(1)',
            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
          }}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1200&h=1200&fit=crop&auto=format';
          }}
        />

        {/* Zoom indicator */}
        <div
          className="absolute top-4 right-4 backdrop-blur-sm border-2 p-2.5 rounded-creative opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-elegant z-20 pointer-events-none"
          style={{
            backgroundColor: `${theme.colors.cardBackground}CC`,
            borderColor: theme.colors.borderPrimary,
          }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: theme.colors.textPrimary }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
          </svg>
        </div>
      </div>

      {/* Thumbnail Images */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {displayImages.slice(0, 8).map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className="aspect-square overflow-hidden border-2 transition-all rounded-creative"
              style={{
                borderColor: selectedImageIndex === index ? theme.colors.buttonPrimary : theme.colors.borderPrimary,
                borderWidth: selectedImageIndex === index ? '3px' : '2px',
                backgroundColor: theme.colors.backgroundSecondary,
              }}
              onMouseEnter={(e) => {
                if (selectedImageIndex !== index) {
                  e.currentTarget.style.borderColor = theme.colors.borderSecondary;
                }
              }}
              onMouseLeave={(e) => {
                if (selectedImageIndex !== index) {
                  e.currentTarget.style.borderColor = theme.colors.borderPrimary;
                }
              }}
            >
              <img
                src={image}
                alt={`${product.name} view ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=400&h=400&fit=crop&auto=format';
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

