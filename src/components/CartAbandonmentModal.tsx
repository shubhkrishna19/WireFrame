import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getCart, CartItem } from '../store/cartStore';
import { useCurrency } from '../contexts/CurrencyContext';
import { useTheme } from '../contexts/ThemeContext';

export const CartAbandonmentModal: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();
    const { theme } = useTheme();

    useEffect(() => {
        let hasShown = sessionStorage.getItem('abandonmentModalShown');

        const handleMouseLeave = async (e: MouseEvent) => {
            // Only trigger if mouse leaves from top of page (exit intent)
            if (e.clientY <= 0 && !hasShown) {
                const cart = await getCart();
                if (cart.length > 0) {
                    setCartItems(cart);
                    setShowModal(true);
                    sessionStorage.setItem('abandonmentModalShown', 'true');
                    hasShown = 'true';
                }
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, []);

    const handleCheckout = () => {
        setShowModal(false);
        navigate('/checkout');
    };

    const handleViewCart = () => {
        setShowModal(false);
        navigate('/cart');
    };

    const handleContinueShopping = () => {
        setShowModal(false);
    };

    const totalValue = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    return (
        <AnimatePresence>
            {showModal && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 z-[100]"
                        onClick={handleContinueShopping}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -50 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-md mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            className="rounded-lg shadow-2xl p-8 border-2"
                            style={{
                                backgroundColor: theme.colors.cardBackground,
                                borderColor: theme.colors.borderPrimary,
                            }}
                        >
                            {/* Close Button */}
                            <button
                                onClick={handleContinueShopping}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Icon */}
                            <div className="flex justify-center mb-4">
                                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-4">
                                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Title */}
                            <h2
                                className="text-2xl font-bold text-center mb-2"
                                style={{ color: theme.colors.textPrimary }}
                            >
                                Wait! Don't Leave Yet
                            </h2>

                            {/* Message */}
                            <p
                                className="text-center mb-6"
                                style={{ color: theme.colors.textSecondary }}
                            >
                                You have <span className="font-bold" style={{ color: theme.colors.textPrimary }}>{cartItems.length} item{cartItems.length > 1 ? 's' : ''}</span> in your cart worth{' '}
                                <span className="font-bold text-green-600">{formatPrice(totalValue)}</span>
                            </p>

                            {/* Cart Preview */}
                            <div className="mb-6 max-h-40 overflow-y-auto space-y-2">
                                {cartItems.slice(0, 3).map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-3 p-2 rounded"
                                        style={{ backgroundColor: theme.colors.backgroundSecondary }}
                                    >
                                        <img
                                            src={item.image || 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=100&h=100&fit=crop&auto=format'}
                                            alt={item.name}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate" style={{ color: theme.colors.textPrimary }}>
                                                {item.name}
                                            </p>
                                            <p className="text-xs" style={{ color: theme.colors.textTertiary }}>
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <p className="text-sm font-bold" style={{ color: theme.colors.textPrimary }}>
                                            {formatPrice(item.unitPrice)}
                                        </p>
                                    </div>
                                ))}
                                {cartItems.length > 3 && (
                                    <p className="text-xs text-center" style={{ color: theme.colors.textTertiary }}>
                                        +{cartItems.length - 3} more item{cartItems.length - 3 > 1 ? 's' : ''}
                                    </p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={handleCheckout}
                                    className="w-full py-3 px-6 rounded-lg font-bold text-white transition-all transform hover:scale-105 shadow-lg"
                                    style={{ backgroundColor: theme.colors.buttonPrimary }}
                                >
                                    Complete Checkout
                                </button>
                                <button
                                    onClick={handleViewCart}
                                    className="w-full py-3 px-6 rounded-lg font-semibold border-2 transition-all"
                                    style={{
                                        color: theme.colors.buttonPrimary,
                                        borderColor: theme.colors.buttonPrimary,
                                        backgroundColor: 'transparent',
                                    }}
                                >
                                    View Cart
                                </button>
                                <button
                                    onClick={handleContinueShopping}
                                    className="w-full py-2 text-sm font-medium transition-colors hover:opacity-80"
                                    style={{ color: theme.colors.textSecondary }}
                                >
                                    Continue Shopping
                                </button>
                            </div>

                            {/* Trust Badge */}
                            <div className="mt-6 pt-4 border-t flex items-center justify-center gap-2" style={{ borderColor: theme.colors.borderPrimary }}>
                                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <p className="text-xs" style={{ color: theme.colors.textTertiary }}>
                                    Secure checkout · Free shipping on orders above ₹10,000
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
