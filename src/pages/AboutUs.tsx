import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useTheme } from '../contexts/ThemeContext';
import { usePageTracking } from '../hooks/usePageTracking';
import { SEO } from '../components/SEO';
import { pageMetadata } from '../utils/seoConfig';

const AboutUs: React.FC = () => {
  const { theme } = useTheme();
  usePageTracking('About Us');

  return (
    <div className="about-us-page">
      <SEO
        title={pageMetadata.about.title}
        description={pageMetadata.about.description}
      />
      <div className="min-h-screen gradient-background">
        <Navbar />

        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM4QjJFM0QiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h1 className="heading-hero text-center">
                About Bluewud
              </h1>
              <p className="text-xl lg:text-2xl max-w-3xl mx-auto font-semibold leading-relaxed text-secondary">
                Crafting premium furniture with engineered wood, smart storage, and innovative design for modern living
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-24 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2
                  className="text-4xl font-extrabold mb-6"
                  style={{ color: theme.colors.textPrimary }}
                >
                  Our Story
                </h2>
                <div className="space-y-4" style={{ color: theme.colors.textSecondary }}>
                  <p className="text-lg leading-relaxed">
                    Founded by <span style={{ color: theme.colors.accentPrimary, fontWeight: 'bold' }}>Abhinav Kumar Singh</span>, Bluewud began as a collective of furniture designers and space optimists determined to merge functional design with modern aesthetics. We work with precision engineering, partnering with sustainable wood suppliers and advanced manufacturing facilities to produce furniture that feels premium yet remains accessible.
                  </p>
                  <p className="text-lg leading-relaxed">
                    From <span style={{ color: theme.colors.textPrimary, fontWeight: 'bold' }}>engineered wood construction</span> to <span style={{ color: theme.colors.textPrimary, fontWeight: 'bold' }}>smart storage solutions</span>, every piece is designed for durability, space optimization, and contemporary style.
                  </p>
                  <p className="text-lg leading-relaxed">
                    We craft furniture that transitions seamlessly from compact apartments to spacious homes, embodying the philosophy that true quality lies in thoughtful design and practical innovation.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div
                  className="rounded-creative overflow-hidden border-2 shadow-elegant"
                  style={{ borderColor: theme.colors.borderPrimary }}
                >
                  <img
                    src="https://placehold.co/1200x1600/8B4513/FFFFFF?text=Bluewud+Furniture"
                    alt="Bluewud manufacturing facility"
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-24 relative" style={{ backgroundColor: theme.colors.backgroundSecondary }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-4xl font-extrabold text-center mb-16"
              style={{ color: theme.colors.textPrimary }}
            >
              Our Values
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Design',
                  icon: '🎨',
                  description: 'Contemporary designs that blend seamlessly with modern interiors while maximizing space and functionality.',
                },
                {
                  title: 'Quality',
                  icon: '🪵',
                  description: 'We use premium engineered wood and high-grade materials to create furniture that stands the test of time.',
                },
                {
                  title: 'Innovation',
                  icon: '💡',
                  description: 'Smart storage solutions and space-saving designs that maximize functionality without compromising style.',
                },
                {
                  title: 'Affordability',
                  icon: '💰',
                  description: 'Premium quality furniture at accessible prices, making modern design available to everyone.',
                },
              ].map((value, index) => (
                <div
                  key={index}
                  className="border-2 rounded-creative p-8 shadow-card"
                  style={{
                    backgroundColor: theme.colors.cardBackground,
                    borderColor: theme.colors.borderPrimary,
                  }}
                >
                  <div className="text-5xl mb-4">{value.icon}</div>
                  <h3
                    className="text-2xl font-bold mb-4"
                    style={{ color: theme.colors.textPrimary }}
                  >
                    {value.title}
                  </h3>
                  <p style={{ color: theme.colors.textSecondary }}>
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-24 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2
                className="text-4xl font-extrabold mb-6"
                style={{ color: theme.colors.textPrimary }}
              >
                Our Mission
              </h2>
              <p
                className="text-xl max-w-3xl mx-auto leading-relaxed"
                style={{ color: theme.colors.textSecondary }}
              >
                To redefine modern living by creating beautiful, functional furniture that empowers individuals to optimize their spaces while maintaining style and quality.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-16">
              <div
                className="border-2 rounded-creative p-8"
                style={{
                  backgroundColor: theme.colors.cardBackground,
                  borderColor: theme.colors.borderPrimary,
                }}
              >
                <h3
                  className="text-2xl font-bold mb-4"
                  style={{ color: theme.colors.textPrimary }}
                >
                  Founded in 2015
                </h3>
                <p style={{ color: theme.colors.textSecondary }}>
                  Precision-engineered furniture designed and manufactured in India. Each piece is carefully crafted with attention to detail and quality control.
                </p>
              </div>
              <div
                className="border-2 rounded-creative p-8"
                style={{
                  backgroundColor: theme.colors.cardBackground,
                  borderColor: theme.colors.borderPrimary,
                }}
              >
                <h3
                  className="text-2xl font-bold mb-4"
                  style={{ color: theme.colors.textPrimary }}
                >
                  10,000+ Happy Homes
                </h3>
                <p style={{ color: theme.colors.textSecondary }}>
                  Trusted by thousands of customers across India. We're committed to delivering quality furniture with excellent customer service.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative" style={{ backgroundColor: theme.colors.backgroundSecondary }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2
              className="text-4xl font-extrabold mb-6"
              style={{ color: theme.colors.textPrimary }}
            >
              Join Our Journey
            </h2>
            <p
              className="text-xl mb-8"
              style={{ color: theme.colors.textSecondary }}
            >
              Discover our collection of premium furniture pieces crafted for modern living spaces.
            </p>
            <Link
              to="/products"
              className="inline-block px-12 py-6 rounded-creative font-extrabold uppercase tracking-widest text-xl transition-all shadow-elegant transform hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${theme.colors.buttonPrimary} 0%, ${theme.colors.buttonSecondary} 100%)`,
                color: '#FFFFFF',
              }}
            >
              Explore Collection
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export { AboutUs };
export default AboutUs;
