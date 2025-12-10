import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useTheme } from '../contexts/ThemeContext';
import { usePageTracking } from '../hooks/usePageTracking';
import { SEO } from '../components/SEO';
import { pageMetadata } from '../utils/seoConfig';

const Lookbook: React.FC = () => {
  const { theme } = useTheme();
  usePageTracking('Lookbook');

  const collections = [
    {
      id: 'modern-living',
      title: 'Modern Living',
      description: 'Sleek lines, neutral tones, and functional design for the contemporary home.',
      image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=800&q=80',
      tags: ['living room', 'modern', 'sofa'],
      color: 'brandPrimary',
    },
    {
      id: 'cozy-bedroom',
      title: 'Cozy Retreat',
      description: 'Create a sanctuary with warm wood finishes, soft textures, and ambient lighting.',
      image: 'https://images.unsplash.com/photo-1505693416388-b0346ef4143d?auto=format&fit=crop&w=800&q=80',
      tags: ['bedroom', 'cozy', 'bed'],
      color: 'stateSuccess',
    },
    {
      id: 'home-office',
      title: 'Productive Spaces',
      description: 'Ergonomic desks and chairs designed to boost focus and creativity.',
      image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
      tags: ['office', 'study', 'desk'],
      color: 'accentCool',
    },
    {
      id: 'dining',
      title: 'Gather & Dine',
      description: 'Elegant dining sets that become the heart of your home for family meals and entertaining.',
      image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80',
      tags: ['dining', 'table', 'chairs'],
      color: 'brandDark',
    },
  ];

  return (
    <>
      <SEO
        title={pageMetadata.lookbook.title}
        description={pageMetadata.lookbook.description}
      />
      <div
        className="min-h-screen"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.backgroundPrimary} 0%, ${theme.colors.backgroundSecondary} 50%, ${theme.colors.backgroundPrimary} 100%)`,
          color: theme.colors.textPrimary,
        }}
      >
        <Navbar />

        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h1
                className="text-5xl lg:text-7xl font-extrabold mb-6 drop-shadow-[0_20px_60px_rgba(0,0,0,0.65)]"
                style={{ color: theme.colors.textPrimary }}
              >
                The Bluewud Lookbook
              </h1>
              <p
                className="text-xl lg:text-2xl max-w-3xl mx-auto font-semibold leading-relaxed"
                style={{ color: theme.colors.textSecondary }}
              >
                Curated collections for modern living, cozy retreats, and productive workspaces
              </p>
            </div>
          </div>
        </section>

        {/* Collections Grid */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10">
              {collections.map((collection) => (
                <div
                  key={collection.id}
                  className="group relative overflow-hidden rounded-creative bg-neutral-900/80 border-2 border-neutral-800 shadow-card transition-all duration-500 hover:shadow-card-hover"
                  style={{ borderColor: theme.colors.borderPrimary }}
                >
                  <div className="absolute inset-0 opacity-70 group-hover:opacity-90 transition-opacity duration-500">
                    <img
                      src={collection.image}
                      alt={collection.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/80 via-neutral-900/40 to-neutral-950/95"></div>
                  <div className="relative z-10 p-10 h-full flex flex-col justify-between min-h-[500px]">
                    <div>
                      <span
                        className="inline-block px-4 py-2 text-xs tracking-[0.4em] uppercase border-2 rounded-full mb-4"
                        style={{
                          color: theme.colors[collection.color as keyof typeof theme.colors],
                          borderColor: `${theme.colors[collection.color as keyof typeof theme.colors]}66`,
                          backgroundColor: `${theme.colors[collection.color as keyof typeof theme.colors]}20`,
                        }}
                      >
                        {collection.tags[0].toUpperCase()}
                      </span>
                      <h3
                        className="text-3xl font-bold mb-4"
                        style={{ color: theme.colors.textPrimary }}
                      >
                        {collection.title}
                      </h3>
                      <p
                        className="text-neutral-300 text-sm leading-relaxed mb-6"
                        style={{ color: theme.colors.textSecondary }}
                      >
                        {collection.description}
                      </p>
                    </div>
                    <Link
                      to={`/products?category=${collection.tags[0]}`}
                      className="inline-flex items-center gap-3 font-semibold uppercase tracking-[0.3em] transition-colors group-hover:gap-4"
                      style={{
                        color: theme.colors[collection.color as keyof typeof theme.colors],
                      }}
                    >
                      View Collection
                      <span
                        className="w-8 h-px transition-all group-hover:w-12"
                        style={{
                          backgroundColor: theme.colors[collection.color as keyof typeof theme.colors],
                        }}
                      ></span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Styling Tips Section */}
        <section className="py-24" style={{ backgroundColor: theme.colors.backgroundSecondary }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-4xl font-extrabold text-center mb-16"
              style={{ color: theme.colors.textPrimary }}
            >
              Interior Design Tips
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Define Your Palette',
                  tip: 'Start with a neutral base for large furniture pieces and add personality with colorful accents like cushions and rugs.',
                },
                {
                  title: 'Lighting Matters',
                  tip: 'Layer your lighting with a mix of ambient, task, and accent lights to create depth and mood in your rooms.',
                },
                {
                  title: 'Texture & Materials',
                  tip: 'Mix different textures like wood, metal, and fabric to add visual interest and warmth to your space.',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="border-2 rounded-creative p-6"
                  style={{
                    backgroundColor: theme.colors.cardBackground,
                    borderColor: theme.colors.borderPrimary,
                  }}
                >
                  <h3
                    className="text-xl font-bold mb-4"
                    style={{ color: theme.colors.textPrimary }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ color: theme.colors.textSecondary }}>
                    {item.tip}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2
              className="text-4xl font-extrabold mb-6"
              style={{ color: theme.colors.textPrimary }}
            >
              Transform Your Home
            </h2>
            <p
              className="text-xl mb-8"
              style={{ color: theme.colors.textSecondary }}
            >
              Explore our complete collection and find pieces that reflect your personal style.
            </p>
            <Link
              to="/products"
              className="inline-block px-12 py-6 rounded-creative font-extrabold uppercase tracking-widest text-xl transition-all shadow-elegant transform hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${theme.colors.buttonPrimary} 0%, ${theme.colors.buttonSecondary} 100%)`,
                color: '#FFFFFF',
              }}
            >
              Shop Now
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export { Lookbook };
export default Lookbook;

