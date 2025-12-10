import React from 'react';
import { ProductCard } from './ProductCard';
import { Link } from 'react-router-dom';
import { mockProducts } from '../data/mockData';

// Select a few featured products (e.g., first 4 items)
const featuredProducts = mockProducts.slice(0, 4);

export const FeaturedProducts: React.FC = () => {
    return (
        <section className="py-20 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-neutral-50 mb-4 drop-shadow-xl">
                        Bestselling Furniture
                    </h2>
                    <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
                        Discover our most-loved pieces that customers can't get enough of
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredProducts.map((product) => (
                        <div key={product._id} className="transform transition-transform hover:scale-105">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Link
                        to="/products"
                        className="inline-block px-10 py-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white rounded-lg font-bold uppercase tracking-wide hover:from-cyan-500 hover:via-blue-600 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        Explore All Furniture →
                    </Link>
                </div>
            </div>
        </section>
    );
};
