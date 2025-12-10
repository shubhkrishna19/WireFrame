import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { Product } from '../data/mockData';
import { addToCart } from '../store/cartStore';
import { addToWishlist, removeFromWishlist, isInWishlist } from '../store/wishlistStore';
import { useToast } from './Toast';
import { useNavigate } from 'react-router-dom';

interface QuickViewModalProps {
    product: Product;
    onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
    const { theme } = useTheme();
    const { formatPrice } = useCurrency();
    const toast = useToast();
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
    const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        const checkWishlist = async () => {
            const inWishlist = await isInWishlist(product._id);
            setIsWishlisted(inWishlist);
        };
        checkWishlist();

        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [product._id]);

    const handleAddToCart = async () => {
        if (!selectedSize || !selectedColor) {
            toast.warning('Please select size and color');
            return;
        }

        const result = await addToCart(product, selectedSize, selectedColor, quantity);
        if (result.success) {
            toast.success('Added to cart!');
        } else {
            toast.error(result.message || 'Failed to add to cart');
        }
    };

    const handleWishlistToggle = async () => {
        if (isWishlisted) {
            await removeFromWishlist(product._id);
            setIsWishlisted(false);
            toast.success('Removed from wishlist');
        } else {
            await addToWishlist(product._id);
            setIsWishlisted(true);
            toast.success('Added to wishlist');
        }
    };

    const handleViewFullDetails = () => {
        navigate(`/products/${product.slug}`);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black"
                style={{ opacity: 0.7 }}
            />

            {/* Modal */}
            <div
                className="relative max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-creative shadow-2xl animate-slide-up"
                style={{ backgroundColor: theme.colors.cardBackground }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-opacity-80 transition-all"
                    style={{ backgroundColor: theme.colors.backgroundSecondary }}
                    aria-label="Close quick view"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: theme.colors.textPrimary }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
                    {/* Left: Images */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="aspect-square rounded-creative overflow-hidden bg-gray-100">
                            <img
                                src={product.images[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Thumbnail Gallery */}
                        {product.images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index ? 'ring-2 ring-offset-2' : ''
                                            }`}
                                        style={{
                                            borderColor: selectedImage === index ? theme.colors.accentPrimary : theme.colors.borderSecondary,
                                        }}
                                    >
                                        <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex flex-col">
                        <div className="flex-1 space-y-4">
                            {/* Title */}
                            <div>
                                <h2 className="text-3xl font-bold mb-2" style={{ color: theme.colors.textPrimary }}>
                                    {product.name}
                                </h2>
                                <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                                    {product.description}
                                </p>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-black" style={{ color: theme.colors.accentPrimary }}>
                                    {formatPrice(product.price)}
                                </span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                    <span className="text-lg line-through" style={{ color: theme.colors.textTertiary }}>
                                        {formatPrice(product.originalPrice)}
                                    </span>
                                )}
                            </div>

                            {/* Stock Status */}
                            {product.stock > 0 ? (
                                <div className="flex items-center gap-2 text-green-600">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-semibold">In Stock {product.stock < 10 && `(Only ${product.stock} left)`}</span>
                                </div>
                            ) : (
                                <div className="text-red-600 font-semibold">Out of Stock</div>
                            )}

                            {/* Size Selection */}
                            {product.sizes && product.sizes.length > 0 && (
                                <div>
                                    <label className="block text-sm font-semibold mb-2" style={{ color: theme.colors.textPrimary }}>
                                        Size
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {product.sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className="px-4 py-2 rounded-lg border-2 font-semibold transition-all"
                                                style={{
                                                    borderColor: selectedSize === size ? theme.colors.accentPrimary : theme.colors.borderPrimary,
                                                    backgroundColor: selectedSize === size ? theme.colors.accentPrimary : 'transparent',
                                                    color: selectedSize === size ? '#FFFFFF' : theme.colors.textPrimary,
                                                }}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Color Selection */}
                            {product.colors && product.colors.length > 0 && (
                                <div>
                                    <label className="block text-sm font-semibold mb-2" style={{ color: theme.colors.textPrimary }}>
                                        Color: {selectedColor}
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {product.colors.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className="px-4 py-2 rounded-lg border-2 font-semibold capitalize transition-all"
                                                style={{
                                                    borderColor: selectedColor === color ? theme.colors.accentPrimary : theme.colors.borderPrimary,
                                                    backgroundColor: selectedColor === color ? theme.colors.accentPrimary : 'transparent',
                                                    color: selectedColor === color ? '#FFFFFF' : theme.colors.textPrimary,
                                                }}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity */}
                            <div>
                                <label className="block text-sm font-semibold mb-2" style={{ color: theme.colors.textPrimary }}>
                                    Quantity
                                </label>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 rounded-lg border-2 font-bold transition-all hover:bg-opacity-80"
                                        style={{ borderColor: theme.colors.borderPrimary, color: theme.colors.textPrimary }}
                                    >
                                        -
                                    </button>
                                    <span className="text-xl font-bold w-12 text-center" style={{ color: theme.colors.textPrimary }}>
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="w-10 h-10 rounded-lg border-2 font-bold transition-all hover:bg-opacity-80"
                                        style={{ borderColor: theme.colors.borderPrimary, color: theme.colors.textPrimary }}
                                        disabled={quantity >= product.stock}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3 mt-6">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="w-full py-4 rounded-creative font-bold text-lg transition-all hover:opacity-90 disabled:opacity-50"
                                style={{
                                    background: `linear-gradient(135deg, ${theme.colors.buttonPrimary} 0%, ${theme.colors.buttonSecondary} 100%)`,
                                    color: '#FFFFFF',
                                }}
                            >
                                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </button>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={handleWishlistToggle}
                                    className="py-3 rounded-creative font-semibold border-2 transition-all hover:opacity-80"
                                    style={{
                                        borderColor: theme.colors.borderPrimary,
                                        color: isWishlisted ? '#EF4444' : theme.colors.textPrimary,
                                    }}
                                >
                                    {isWishlisted ? '♥ Wishlisted' : '♡ Wishlist'}
                                </button>

                                <button
                                    onClick={handleViewFullDetails}
                                    className="py-3 rounded-creative font-semibold border-2 transition-all hover:opacity-80"
                                    style={{
                                        borderColor: theme.colors.borderPrimary,
                                        color: theme.colors.textPrimary,
                                    }}
                                >
                                    Full Details →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
        </div>
    );
};
