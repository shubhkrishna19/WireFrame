import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { ProductCard } from '../components/ProductCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import * as dataStore from '../store/dataStore';
import { Product } from '../data/mockData';

export const CategoryPage: React.FC = () => {
    const { category, subcategory } = useParams<{ category: string; subcategory?: string }>();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('featured');

    const categoryName = category ? decodeURIComponent(category).replace(/-/g, ' ') : '';
    const subcategoryName = subcategory ? decodeURIComponent(subcategory).replace(/-/g, ' ') : '';

    useEffect(() => {
        loadProducts();
    }, [category, subcategory, sortBy]);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const allProducts = await dataStore.getProducts();

            // Filter by category/subcategory
            let filtered = allProducts.filter((product: Product) => {
                const productCategory = product.categoryId.toLowerCase();
                const productName = product.name.toLowerCase();
                const categoryMatch = categoryName.toLowerCase();

                // Check if product matches the category
                if (!productCategory.includes(categoryMatch) && !productName.includes(categoryMatch)) {
                    return false;
                }

                // If subcategory specified, match it
                if (subcategoryName) {
                    const subcategoryMatch = subcategoryName.toLowerCase();
                    return productName.includes(subcategoryMatch) || productCategory.includes(subcategoryMatch);
                }

                return true;
            });

            // Sort products
            switch (sortBy) {
                case 'price-low':
                    filtered.sort((a: Product, b: Product) => a.price - b.price);
                    break;
                case 'price-high':
                    filtered.sort((a: Product, b: Product) => b.price - a.price);
                    break;
                case 'name':
                    filtered.sort((a: Product, b: Product) => a.name.localeCompare(b.name));
                    break;
                case 'newest':
                    filtered.sort((a: Product, b: Product) => {
                        const dateA = new Date(a.createdAt || 0).getTime();
                        const dateB = new Date(b.createdAt || 0).getTime();
                        return dateB - dateA;
                    });
                    break;
                default:
                    break;
            }

            setProducts(filtered);
        } catch (error) {
            console.error('Error loading products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const displayTitle = subcategoryName || categoryName;
    const capitalizedTitle = displayTitle
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return (
        <>
            <SEO
                title={`${capitalizedTitle} | Bluewud Furniture`}
                description={`Shop premium ${displayTitle} furniture from Bluewud. Quality engineered wood furniture for modern living.`}
            />
            <div className="min-h-screen gradient-background">
                <Navbar />

                <div className="container-primary section-padding">
                    {/* Breadcrumbs */}
                    <nav className="mb-8">
                        <div className="flex items-center gap-2 caption">
                            <Link to="/" className="link">Home</Link>
                            <span>/</span>
                            {categoryName && (
                                <>
                                    <Link to={`/category/${category}`} className="link capitalize">
                                        {categoryName}
                                    </Link>
                                    {subcategoryName && (
                                        <>
                                            <span>/</span>
                                            <span className="text-primary capitalize">{subcategoryName}</span>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </nav>

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                        <div>
                            <h1 className="heading-primary mb-2">{capitalizedTitle}</h1>
                            <p className="body-text">
                                {loading ? 'Loading...' : `${products.length} products available`}
                            </p>
                        </div>

                        {/* Sort */}
                        <div className="flex items-center gap-3">
                            <label className="text-secondary font-semibold text-sm">Sort by:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="input-primary py-2"
                            >
                                <option value="featured">Featured</option>
                                <option value="newest">Newest First</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="name">Name: A-Z</option>
                            </select>
                        </div>
                    </div>

                    {/* Products Grid */}
                    {loading ? (
                        <LoadingSkeleton variant="product-grid" />
                    ) : products.length > 0 ? (
                        <div className="grid-products">
                            {products.map((product, index) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    index={index}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="w-24 h-24 mx-auto mb-6 bg-secondary rounded-full flex items-center justify-center">
                                <span className="text-5xl">🛋️</span>
                            </div>
                            <h2 className="heading-secondary mb-4">No Products Found</h2>
                            <p className="body-text mb-6">
                                We couldn't find any products in this category yet.
                            </p>
                            <Link to="/products" className="btn btn-primary">
                                Browse All Products
                            </Link>
                        </div>
                    )}
                </div>

                <Footer />
            </div>
        </>
    );
};
