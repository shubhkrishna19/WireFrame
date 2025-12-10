import React from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../contexts/CompareContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

import { addToCart } from '../store/cartStore';
import { useToast } from '../components/Toast';
import { analytics } from '../utils/analytics';
import * as dataStore from '../store/dataStore';
import { SEO } from '../components/SEO';
import { pageMetadata } from '../utils/seoConfig';
import { logger } from '../utils/logger';

export const ProductComparison: React.FC = () => {
    const { compareList, removeFromCompare, clearCompare } = useCompare();
    const { formatPrice } = useCurrency();
    const { success, error: showError } = useToast();

    const handleAddToCart = async (productId: string, name: string, price: number) => {
        try {
            const fullProduct = await dataStore.getProductById(productId);
            if (!fullProduct) return;

            const defaultSize = fullProduct.sizes[0] || 'M';
            const defaultColor = fullProduct.colors[0] || 'Black';

            const result = await addToCart(fullProduct, defaultSize, defaultColor, 1);
            if (result.success) {
                success(`${name} added to cart!`);
                analytics.addToCart(productId, name, price, 1);
            } else {
                showError(result.message || 'Failed to add to cart');
            }
        } catch (error) {
            logger.error('Error adding to cart from comparison:', error);
            showError('Failed to add to cart');
        }
    };

    if (compareList.length === 0) {
        return (
            <div className="min-h-screen flex flex-col gradient-background">
                <SEO
                    title={pageMetadata.productComparison.title}
                    description={pageMetadata.productComparison.description}
                />
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center px-4 text-center section-padding">
                    <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-6">
                        <svg className="w-12 h-12 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <h2 className="heading-secondary mb-4">No products to compare</h2>
                    <p className="body-text mb-8 max-w-md">
                        Add products to the comparison list to see them side by side.
                    </p>
                    <Link to="/products" className="btn btn-primary">
                        Browse Products
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col gradient-background">
            <SEO
                title={pageMetadata.productComparison.title}
                description={pageMetadata.productComparison.description}
            />
            <Navbar />
            <main className="flex-grow container-primary section-padding">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="heading-primary">Product Comparison</h1>
                    <button
                        onClick={clearCompare}
                        className="px-6 py-3 border-2 rounded-lg font-bold uppercase tracking-wide transition-all-smooth hover-border-accent"
                        style={{
                            borderColor: '#DC2626',
                            color: '#DC2626',
                        }}
                    >
                        Clear All
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[800px] card">
                        <thead>
                            <tr>
                                <th className="p-4 text-left w-48 bg-secondary border-primary text-secondary font-bold uppercase tracking-wide">Features</th>
                                {compareList.map(product => (
                                    <th key={product._id} className="p-4 border-primary min-w-[250px] relative">
                                        <button
                                            onClick={() => removeFromCompare(product._id)}
                                            className="absolute top-2 right-2 text-tertiary hover:text-accent transition-colors-fast"
                                            title="Remove"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                        <div className="flex flex-col items-center">
                                            <Link to={`/products/${product.slug}`}>
                                                <img
                                                    src={product.thumbnail}
                                                    alt={product.name}
                                                    className="w-48 h-48 object-cover rounded-creative mb-4 hover-scale"
                                                    loading="lazy"
                                                />
                                            </Link>
                                            <Link
                                                to={`/products/${product.slug}`}
                                                className="link-primary text-lg text-center mb-2"
                                            >
                                                {product.name}
                                            </Link>
                                            <div className="text-xl font-bold text-accent mb-4">
                                                {formatPrice(product.price)}
                                            </div>
                                            <button
                                                onClick={() => handleAddToCart(product._id, product.name, product.price)}
                                                className="btn btn-primary w-full"
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            <tr>
                                <td className="p-4 font-semibold bg-secondary text-secondary">Rating</td>
                                {compareList.map(product => (
                                    <td key={product._id} className="p-4 text-center">
                                        <div className="flex justify-center items-center gap-1">
                                            <span className="font-bold text-yellow-500">{product.rating || 4.5}</span>
                                            <svg className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 24 24">
                                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                            </svg>
                                            <span className="caption">({product.reviewCount || 0})</span>
                                        </div>
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-4 font-semibold bg-secondary text-secondary">Brand</td>
                                {compareList.map(product => (
                                    <td key={product._id} className="p-4 text-center text-primary">
                                        {product.brand || 'Bluewud'}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-4 font-semibold bg-secondary text-secondary">Availability</td>
                                {compareList.map(product => (
                                    <td key={product._id} className="p-4 text-center">
                                        {product.stock > 0 ? (
                                            <span className="badge badge-new">In Stock</span>
                                        ) : (
                                            <span className="badge badge-sale">Out of Stock</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-4 font-semibold bg-secondary text-secondary">Colors</td>
                                {compareList.map(product => (
                                    <td key={product._id} className="p-4 text-center">
                                        <div className="flex justify-center gap-1 flex-wrap">
                                            {product.colors?.map(c => (
                                                <span key={c} className="px-2 py-1 text-xs border border-primary rounded bg-secondary">{c}</span>
                                            )) || '-'}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-4 font-semibold bg-secondary text-secondary">Material</td>
                                {compareList.map(product => (
                                    <td key={product._id} className="p-4 text-center text-primary">
                                        {product.specifications?.material || '-'}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-4 font-semibold bg-secondary text-secondary">Finish</td>
                                {compareList.map(product => (
                                    <td key={product._id} className="p-4 text-center text-primary">
                                        {product.specifications?.finish || '-'}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-4 font-semibold bg-secondary text-secondary">Dimensions</td>
                                {compareList.map(product => (
                                    <td key={product._id} className="p-4 text-center text-primary">
                                        {product.specifications?.dimensions ? (
                                            <div className="caption">
                                                {product.specifications.dimensions.length} x {product.specifications.dimensions.width} x {product.specifications.dimensions.height}
                                            </div>
                                        ) : '-'}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-4 font-semibold bg-secondary text-secondary">Description</td>
                                {compareList.map(product => (
                                    <td key={product._id} className="p-4 text-sm text-center text-secondary">
                                        <div className="line-clamp-4">{product.description}</div>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </main>
            <Footer />
        </div>
    );
};
