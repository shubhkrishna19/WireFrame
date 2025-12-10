import React from 'react';
import { Link } from 'react-router-dom';
import { AnnouncementBar } from '../components/AnnouncementBar';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { usePageTracking } from '../hooks/usePageTracking';

import { FeaturedProducts } from '../components/FeaturedProducts';
import { Testimonials } from '../components/Testimonials';
import { SEO } from '../components/SEO';
import { pageMetadata } from '../utils/seoConfig';
import { RecentlyViewed } from '../components/RecentlyViewed';
import { useParallax } from '../hooks/useParallax';

export const Home: React.FC = () => {
  usePageTracking('Home');
  const parallaxOffset = useParallax(0.5);

  return (
    <div className="min-h-screen gradient-background">
      <SEO
        title={pageMetadata.home.title}
        description={pageMetadata.home.description}
      />
      <AnnouncementBar />
      <Navbar />

      {/* Hero Section with Banner Image */}
      <section className="relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 py-20 lg:py-32 overflow-hidden">
        {/* Hero Banner Imagery - Premium Furniture Aesthetic */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 overflow-hidden">
            <img
              loading="lazy"
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=2000&q=80"
              alt="Modern living room with elegant furniture and warm lighting"
              className="w-full h-full object-cover opacity-40"
              style={{ transform: `translateY(${parallaxOffset}px)` }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-950/90 via-neutral-900/75 to-neutral-950/92"></div>
          </div>
          <div className="absolute top-0 right-0 h-full w-1/2 hidden lg:block overflow-hidden">
            <img
              loading="lazy"
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=80"
              alt="Premium wooden furniture with contemporary design"
              className="w-full h-full object-cover opacity-60 scale-105"
              style={{ transform: `translateY(${parallaxOffset * 0.7}px)` }}
            />
            <div className="absolute inset-0 bg-gradient-to-l from-neutral-950/90 via-neutral-950/65 to-transparent"></div>
          </div>
        </div>
        {/* Colorful abstract background pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM4QjJFM0QiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20 z-10"></div>
        {/* Colorful gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-primary-600/10 z-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-primary-600/20 to-blue-700/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 z-10"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-cyan-400/15 to-blue-500/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="text-center">
            <div className="mb-6 flex flex-col items-center">
              {/* Branded Logo */}
              <div className="mb-4">
                <h1 className="text-6xl lg:text-8xl font-black tracking-wide text-blue-300" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                  BLUEWUD
                </h1>
                <p className="text-xl lg:text-2xl mt-2 text-tagline" style={{ fontFamily: '"Dancing Script", cursive', fontStyle: 'italic' }}>
                  every home's a story
                </p>
              </div>
              <p className="text-xl lg:text-2xl text-blue-300 font-bold drop-shadow-xl">
                Premium Furniture • Smart Storage • Modern Living
              </p>
            </div>
            <p className="text-lg text-neutral-200/90 max-w-3xl mx-auto mb-10 font-medium leading-relaxed">
              Discover India's finest engineered wood furniture. From space-saving wardrobes to elegant TV units,
              we craft premium pieces designed for modern homes with timeless style and uncompromising quality.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/products"
                className="px-12 py-6 bg-gradient-to-r from-primary-600 via-blue-600 to-primary-600 text-white rounded-lg font-bold uppercase tracking-wide text-lg hover:from-blue-600 hover:via-primary-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Shop Now
              </Link>
              <Link
                to="/products?category=Beds"
                className="px-12 py-6 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg font-bold uppercase tracking-wide text-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                Explore Furniture
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
              <div className="bg-neutral-900/70 border border-neutral-700 rounded-lg p-6 shadow-lg backdrop-blur-sm hover:bg-neutral-900/80 hover:border-blue-500/30 transition-all">
                <div className="text-4xl mb-3">🪵</div>
                <p className="text-xs uppercase tracking-wider text-neutral-400 mb-2">Quality Craftsmanship</p>
                <h3 className="text-xl font-bold text-neutral-100 mb-2">Premium Materials</h3>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  Engineered wood with laminate finish, built to last with attention to every detail.
                </p>
              </div>
              <div className="bg-neutral-900/70 border border-neutral-700 rounded-lg p-6 shadow-lg backdrop-blur-sm hover:bg-neutral-900/80 hover:border-blue-500/30 transition-all">
                <div className="text-4xl mb-3">📐</div>
                <p className="text-xs uppercase tracking-wider text-neutral-400 mb-2">Smart Design</p>
                <h3 className="text-xl font-bold text-neutral-100 mb-2">Space Optimization</h3>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  Thoughtfully designed storage solutions that maximize space while maintaining elegance.
                </p>
              </div>
              <div className="bg-neutral-900/70 border border-neutral-700 rounded-lg p-6 shadow-lg backdrop-blur-sm hover:bg-neutral-900/80 hover:border-blue-500/30 transition-all">
                <div className="text-4xl mb-3">🔧</div>
                <p className="text-xs uppercase tracking-wider text-neutral-400 mb-2">Customer First</p>
                <h3 className="text-xl font-bold text-neutral-100 mb-2">Easy Assembly</h3>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  DIY-friendly design with clear instructions and all hardware included for hassle-free setup.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-3">🚚</div>
              <h3 className="font-bold text-neutral-900 mb-1">Free Delivery</h3>
              <p className="text-sm text-neutral-600">On orders above ₹10,000</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-3">✓</div>
              <h3 className="font-bold text-neutral-900 mb-1">Quality Assured</h3>
              <p className="text-sm text-neutral-600">Premium engineered wood</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-3">🛡️</div>
              <h3 className="font-bold text-neutral-900 mb-1">12 Month Warranty</h3>
              <p className="text-sm text-neutral-600">Manufacturing defects covered</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="font-bold text-neutral-900 mb-1">24/7 Support</h3>
              <p className="text-sm text-neutral-600">Always here to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* Lookbook Highlights */}
      <section className="py-24 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-500/20 to-blue-500/15 rounded-full blur-3xl translate-x-1/3 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[32rem] h-[32rem] bg-gradient-to-br from-blue-600/15 via-transparent to-primary-700/20 rounded-full blur-[180px] -translate-x-1/3 translate-y-1/3"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold text-neutral-50 drop-shadow-[0_12px_40px_rgba(0,0,0,0.55)] mb-6 font-heading tracking-tight">
              Shop by Room
            </h2>
            <p className="text-xl text-neutral-200 max-w-3xl mx-auto font-medium leading-relaxed">
              Explore our curated furniture collections designed for every space in your home.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="group relative overflow-hidden rounded-lg bg-neutral-900/80 border border-neutral-800 shadow-lg transition-all duration-500 hover:shadow-xl hover:scale-[1.02]">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:opacity-90 transition-opacity duration-500"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=900&h=1200&fit=crop')" }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/80 via-neutral-900/40 to-neutral-950/95"></div>
              <div className="relative z-10 p-10 h-full flex flex-col justify-between min-h-[400px]">
                <div>
                  <span className="inline-block px-4 py-2 text-xs tracking-wider uppercase text-neutral-300 border border-neutral-700 rounded-full bg-neutral-900/70">
                    BEDROOM
                  </span>
                  <h3 className="mt-6 text-3xl font-bold text-neutral-100">Beds & Wardrobes</h3>
                  <p className="mt-3 text-neutral-300 text-sm leading-relaxed">
                    Create your perfect sanctuary with our elegant bed frames and spacious wardrobes designed for comfort and storage.
                  </p>
                </div>
                <Link
                  to="/collections/bedroom"
                  className="mt-10 inline-flex items-center gap-3 text-neutral-100 font-semibold uppercase tracking-wide hover:text-blue-400 transition-colors"
                >
                  Shop Bedroom
                  <span className="w-8 h-px bg-neutral-400 group-hover:bg-blue-400 transition-colors"></span>
                </Link>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-lg bg-neutral-900/80 border border-neutral-800 shadow-lg transition-all duration-500 hover:shadow-xl hover:scale-[1.02]">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:opacity-90 transition-opacity duration-500"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=900&h=1200&fit=crop')" }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/80 via-neutral-900/40 to-neutral-950/95"></div>
              <div className="relative z-10 p-10 h-full flex flex-col justify-between min-h-[400px]">
                <div>
                  <span className="inline-block px-4 py-2 text-xs tracking-wider uppercase text-neutral-300 border border-neutral-700 rounded-full bg-neutral-900/70">
                    LIVING ROOM
                  </span>
                  <h3 className="mt-6 text-3xl font-bold text-neutral-100">TV Units & Coffee Tables</h3>
                  <p className="mt-3 text-neutral-300 text-sm leading-relaxed">
                    Elevate your living space with sleek TV units and stylish coffee tables perfect for entertaining.
                  </p>
                </div>
                <Link
                  to="/collections/living-room"
                  className="mt-10 inline-flex items-center gap-3 text-neutral-100 font-semibold uppercase tracking-wide hover:text-blue-400 transition-colors"
                >
                  Shop Living Room
                  <span className="w-8 h-px bg-neutral-400 group-hover:bg-blue-400 transition-colors"></span>
                </Link>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-lg bg-neutral-900/80 border border-neutral-800 shadow-lg transition-all duration-500 hover:shadow-xl hover:scale-[1.02]">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:opacity-90 transition-opacity duration-500"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=900&h=1200&fit=crop')" }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/80 via-neutral-900/40 to-neutral-950/95"></div>
              <div className="relative z-10 p-10 h-full flex flex-col justify-between min-h-[400px]">
                <div>
                  <span className="inline-block px-4 py-2 text-xs tracking-wider uppercase text-neutral-300 border border-neutral-700 rounded-full bg-neutral-900/70">
                    STUDY & OFFICE
                  </span>
                  <h3 className="mt-6 text-3xl font-bold text-neutral-100">Study Tables & Bookshelves</h3>
                  <p className="mt-3 text-neutral-300 text-sm leading-relaxed">
                    Boost productivity with ergonomic study tables and organized bookshelves for your workspace.
                  </p>
                </div>
                <Link
                  to="/collections/study-office"
                  className="mt-10 inline-flex items-center gap-3 text-neutral-100 font-semibold uppercase tracking-wide hover:text-blue-400 transition-colors"
                >
                  Shop Study & Office
                  <span className="w-8 h-px bg-neutral-400 group-hover:bg-blue-400 transition-colors"></span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* Featured Benefits */}
      <section className="py-24 bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-800 relative overflow-hidden">
        {/* Background accents */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-1/2 h-full opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/30 to-transparent"></div>
          </div>
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
            <div className="absolute inset-0 bg-gradient-to-l from-blue-500/30 to-transparent"></div>
          </div>
        </div>

        {/* Colorful accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-500/15 to-blue-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-600/15 to-primary-700/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 z-10"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-extrabold text-neutral-50 drop-shadow-[0_12px_45px_rgba(0,0,0,0.55)] mb-6 font-heading tracking-tight">
              Why Choose Bluewud
            </h2>
            <p className="text-xl text-neutral-200 max-w-2xl mx-auto font-medium">
              Premium quality furniture with innovative features
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {/* Engineered Wood */}
            <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-800 p-10 lg:p-14 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary-500/40 hover:border-primary-500/70 bg-neutral-900/90 backdrop-blur-sm">
              {/* Accent overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-blue-500/5"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-500/20 to-blue-600/15 rounded-full -mr-32 -mt-32 opacity-30 group-hover:opacity-50 transition-opacity blur-2xl"></div>

              <div className="relative z-10">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-blue-600 rounded-xl flex items-center justify-center mb-4 border-2 border-primary-500 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-neutral-50 mb-4 font-heading">
                    Engineered Wood
                  </h3>
                  <p className="text-neutral-200 text-lg leading-relaxed font-medium">
                    High-quality engineered wood with premium laminates. Durable, sustainable,
                    and designed to withstand daily use while maintaining its beauty.
                  </p>
                </div>
                <div className="space-y-3 mt-6">
                  <div className="flex items-center gap-2 text-neutral-200 font-medium">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Termite and borer resistant</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-200 font-medium">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Scratch and moisture resistant finish</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-200 font-medium">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Long-lasting durability</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-200 font-medium">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Eco-friendly and sustainable</span>
                  </div>
                </div>
                <Link
                  to="/products"
                  className="inline-block mt-8 px-10 py-4 bg-gradient-to-r from-primary-600 via-blue-600 to-primary-600 text-white rounded-lg font-bold uppercase tracking-wide hover:from-blue-600 hover:via-primary-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Explore Products →
                </Link>
              </div>
            </div>

            {/* Space-Saving Design */}
            <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-800 p-10 lg:p-14 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-blue-500/40 hover:border-blue-500/70 bg-neutral-900/90 backdrop-blur-sm">
              {/* Accent overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-cyan-600/15 rounded-full -mr-32 -mt-32 opacity-30 group-hover:opacity-50 transition-opacity blur-2xl"></div>

              <div className="relative z-10">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mb-4 border-2 border-blue-500 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7H4V5zM10 12a1 1 0 011-1h4a1 1 0 011 1v7h-6v-7zM16 8a1 1 0 011-1h2a1 1 0 011 1v11h-4V8z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-neutral-50 mb-4 font-heading">
                    Smart Storage
                  </h3>
                  <p className="text-neutral-200 text-lg leading-relaxed font-medium">
                    Innovative space-saving designs with multi-functional features.
                    Maximize your storage while minimizing footprint with clever organization.
                  </p>
                </div>
                <div className="space-y-3 mt-6">
                  <div className="flex items-center gap-2 text-neutral-200 font-medium">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Optimized compartments</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-200 font-medium">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Multi-functional designs</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-200 font-medium">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Perfect for compact spaces</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-200 font-medium">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Organized and clutter-free</span>
                  </div>
                </div>
                <Link
                  to="/products?category=Wardrobes"
                  className="inline-block mt-8 px-10 py-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 text-white rounded-lg font-bold uppercase tracking-wide hover:from-cyan-600 hover:via-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  View Storage Solutions →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* Featured Products Preview - Trend Recommendations */}
      <section className="py-24 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 relative overflow-hidden">
        {/* Colorful Geometric Background Accents */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary-600/15 to-blue-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-800/15 to-primary-700/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-primary-800/10 to-blue-800/10 rounded-full blur-2xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold text-neutral-50 drop-shadow-[0_12px_40px_rgba(0,0,0,0.55)] mb-4 font-heading tracking-tight">
              Trending Now
            </h2>
            <p className="text-xl text-neutral-200 font-extrabold max-w-2xl mx-auto drop-shadow-md">
              Discover our most popular items and trending collections
            </p>
          </div>
          <div className="text-center">
            <Link
              to="/products"
              className="inline-block px-12 py-6 bg-gradient-to-r from-primary-600 via-blue-600 to-primary-600 text-white rounded-lg font-extrabold uppercase tracking-widest text-xl hover:from-blue-600 hover:via-primary-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-primary-600/50"
            >
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Recently Viewed Products */}
      <RecentlyViewed />

      {/* Testimonials Section */}
      <Testimonials />

      <Footer />
    </div>
  );
};


