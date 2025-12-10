import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  const { toggleMode, isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 bg-secondary">
      {/* Newsletter Section */}
      <div className="bg-tertiary section-padding">
        <div className="container-primary text-center">
          <h2 className="heading-tertiary mb-4">
            Get Exclusive Deals & New Arrivals First
          </h2>
          <p className="body-text mb-6">
            Join our community and unlock special discounts, insider updates, and early access to new furniture collections.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="input-primary flex-1"
            />
            <button type="submit" className="btn btn-primary">
              Subscribe
            </button>
          </form>
          {isSubscribed && (
            <p className="mt-3 caption text-green-500 font-medium">
              ✓ Thank you for subscribing!
            </p>
          )}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="border-t border-primary py-12">
        <div className="container-primary">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

            {/* Column 1: Brand & Theme Toggle */}
            <div className="lg:col-span-2">
              <Logo size="lg" showText={true} showTagline={true} />
              <p className="body-text mt-4 mb-6 max-w-sm">
                Premium engineered wood furniture for modern living. Every home's a story.
              </p>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleMode}
                className="flex items-center gap-3 px-6 py-3 rounded-lg border-2 border-primary hover-border-accent transition-all-smooth bg-tertiary"
                title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              >
                <span className="text-2xl">
                  {isDark ? '☀️' : '🌙'}
                </span>
                <div className="text-left">
                  <div className="text-primary font-bold text-sm">Theme</div>
                  <div className="caption">{isDark ? 'Light' : 'Dark'} Mode</div>
                </div>
              </button>
            </div>

            {/* Column 2: Shop */}
            <div>
              <h3 className="text-primary font-bold text-base mb-4 uppercase tracking-wide">
                Shop
              </h3>
              <ul className="space-y-2">
                {['All Products', 'Bedroom', 'Living Room', 'Study & Office', 'Dining & Kitchen', 'Storage', 'New Arrivals'].map((item) => (
                  <li key={item}>
                    <Link to={`/products`} className="link caption">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Company */}
            <div>
              <h3 className="text-primary font-bold text-base mb-4 uppercase tracking-wide">
                Company
              </h3>
              <ul className="space-y-2">
                {[
                  { label: 'About Us', path: '/about-us' },
                  { label: 'Contact', path: '/contact' },
                  { label: 'Blog', path: '/blog' },
                  { label: 'Careers', path: '/careers' },
                  { label: 'Press', path: '/press' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link to={item.path} className="link caption">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Support */}
            <div>
              <h3 className="text-primary font-bold text-base mb-4 uppercase tracking-wide">
                Support
              </h3>
              <ul className="space-y-2">
                {[
                  { label: 'FAQ', path: '/faq' },
                  { label: 'Shipping & Returns', path: '/shipping' },
                  { label: 'Track Order', path: '/track-order' },
                  { label: 'Size Guide', path: '/size-guide' },
                  { label: 'Warranty', path: '/warranty' },
                  { label: 'Privacy Policy', path: '/privacy' },
                  { label: 'Terms of Service', path: '/terms' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link to={item.path} className="link caption">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social & Payment Icons */}
          <div className="mt-12 pt-8 border-t border-primary">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">

              {/* Social Media */}
              <div className="flex items-center gap-4">
                <span className="text-secondary text-sm font-semibold">Follow Us:</span>
                <div className="flex gap-3">
                  {[
                    { name: 'Facebook', icon: '📘', url: '#' },
                    { name: 'Instagram', icon: '📷', url: '#' },
                    { name: 'Twitter', icon: '🐦', url: '#' },
                    { name: 'Pinterest', icon: '📌', url: '#' },
                    { name: 'YouTube', icon: '▶️', url: '#' },
                  ].map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-tertiary border border-primary hover-border-accent hover-lift transition-all-smooth"
                      aria-label={social.name}
                      title={social.name}
                    >
                      <span className="text-xl">{social.icon}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="flex items-center gap-4">
                <span className="text-secondary text-sm font-semibold">We Accept:</span>
                <div className="flex gap-2">
                  {['💳', '🏦', '📱', '💰'].map((icon, i) => (
                    <div
                      key={i}
                      className="w-12 h-8 flex items-center justify-center bg-tertiary border border-primary rounded"
                    >
                      <span className="text-xl">{icon}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Copyright & Links */}
          <div className="mt-8 pt-8 border-t border-primary text-center">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="caption">
                © {currentYear} Bluewud. All rights reserved. Made with ❤️ in India.
              </p>
              <div className="flex gap-6">
                <Link to="/privacy" className="link caption">
                  Privacy
                </Link>
                <Link to="/terms" className="link caption">
                  Terms
                </Link>
                <Link to="/sitemap" className="link caption">
                  Sitemap
                </Link>
                <Link to="/accessibility" className="link caption">
                  Accessibility
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
