import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useTheme } from '../contexts/ThemeContext';
import { SEO } from '../components/SEO';
import { pageMetadata } from '../utils/seoConfig';

export const NotFound: React.FC = () => {
  const { theme } = useTheme();

  return (
    <>
      <SEO
        title={pageMetadata.notFound.title}
        description={pageMetadata.notFound.description}
        noindex={true}
      />
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: theme.colors.backgroundPrimary }}
      >
        <Navbar />

        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="text-center max-w-2xl">
            {/* Large 404 with furniture icon */}
            <div className="mb-8">
              <div className="inline-block relative">
                <h1
                  className="text-9xl font-black opacity-10 select-none"
                  style={{ color: theme.colors.textPrimary }}
                >
                  404
                </h1>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-32 h-32"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: theme.colors.buttonPrimary }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Message */}
            <h2
              className="text-4xl font-bold mb-4"
              style={{ color: theme.colors.textPrimary }}
            >
              Oops! Room Not Found
            </h2>
            <p
              className="text-lg mb-8 leading-relaxed"
              style={{ color: theme.colors.textSecondary }}
            >
              Looks like this piece of furniture has been moved to another room.
              Let's get you back to browsing our collection!
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="px-8 py-4 rounded-lg font-bold uppercase tracking-wide transition-all duration-300 transform hover:scale-105 shadow-lg"
                style={{
                  backgroundColor: theme.colors.buttonPrimary,
                  color: '#FFFFFF',
                }}
              >
                Go to Homepage
              </Link>
              <Link
                to="/products"
                className="px-8 py-4 rounded-lg font-bold uppercase tracking-wide border-2 transition-all duration-300 transform hover:scale-105"
                style={{
                  borderColor: theme.colors.borderPrimary,
                  color: theme.colors.textPrimary,
                  backgroundColor: theme.colors.backgroundSecondary,
                }}
              >
                Browse Furniture
              </Link>
            </div>

            {/* Popular Categories */}
            <div className="mt-12 pt-8 border-t" style={{ borderColor: theme.colors.borderPrimary }}>
              <p
                className="text-sm font-semibold mb-4 uppercase tracking-wider"
                style={{ color: theme.colors.textTertiary }}
              >
                Popular Categories
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                {['Bedroom', 'Living Room', 'Study & Office', 'Dining & Kitchen'].map((category) => (
                  <Link
                    key={category}
                    to={`/collections/${category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                    className="px-4 py-2 rounded border transition-colors"
                    style={{
                      borderColor: theme.colors.borderSecondary,
                      color: theme.colors.textSecondary,
                      backgroundColor: theme.colors.backgroundSecondary,
                    }}
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};
