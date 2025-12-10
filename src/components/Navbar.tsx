import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Logo } from './Logo';
import { getCartItemsCount } from '../store/cartStore';
import { getWishlistCount } from '../store/wishlistStore';
import { SearchAutocomplete } from './SearchAutocomplete';


export const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);
  const [shouldBounce, setShouldBounce] = useState(false);
  const [prevCartCount, setPrevCartCount] = useState(0);

  useEffect(() => {
    const updateCounts = async () => {
      try {
        const cartCountValue = await getCartItemsCount();

        // Trigger bounce if count increased
        if (cartCountValue > prevCartCount && prevCartCount > 0) {
          setShouldBounce(true);
          setTimeout(() => setShouldBounce(false), 600);
        }

        setPrevCartCount(cartCountValue);
        setCartCount(cartCountValue);
        const wishlistCountValue = await getWishlistCount();
        setWishlistCount(wishlistCountValue);
      } catch (error) {
        // Silently fail
      }
    };
    updateCounts();
    window.addEventListener('storage', updateCounts);
    const interval = setInterval(updateCounts, 2000);
    return () => {
      window.removeEventListener('storage', updateCounts);
      clearInterval(interval);
    };
  }, [prevCartCount]);



  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleDropdownEnter = (category: string) => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setActiveDropdown(category);
  };

  const handleDropdownLeave = () => {
    const timeout = setTimeout(() => {
      setActiveDropdown(null);
    }, 300); // 300ms delay before closing
    setDropdownTimeout(timeout);
  };

  // Hardcoded furniture categories
  const furnitureCategories: Record<string, { name: string; subcategories: string[] }[]> = {
    'Living Room': [
      { name: 'Sofas', subcategories: ['3 Seater', '2 Seater', 'L-Shape'] },
      { name: 'TV Units', subcategories: ['Standard', 'Large'] },
      { name: 'Coffee Tables', subcategories: ['Standard', 'With Storage'] },
      { name: 'Shoe Racks', subcategories: ['Standard', 'Cabinet'] },
    ],
    'Bedroom': [
      { name: 'Beds', subcategories: ['King Size', 'Queen Size', 'Single'] },
      { name: 'Wardrobes', subcategories: ['2 Door', '3 Door', '4 Door'] },
      { name: 'Bedside Tables', subcategories: ['Standard', 'Modern'] },
      { name: 'Dressing Tables', subcategories: ['Standard', 'Wall Mounted'] },
    ],
    'Study & Office': [
      { name: 'Study Tables', subcategories: ['Standard', 'Large'] },
      { name: 'Office Chairs', subcategories: ['Ergonomic', 'Executive'] },
      { name: 'Bookshelves', subcategories: ['3 Tier', '4 Tier', '5 Tier'] },
    ],
    'Dining & Kitchen': [
      { name: 'Dining Tables', subcategories: ['4 Seater', '6 Seater', '8 Seater'] },
    ],
    'Decor': [
      { name: 'Wall Decor', subcategories: ['Shelves'] },
      { name: 'Lighting', subcategories: ['Lamps'] },
    ],
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${shouldBounce ? 'animate-bounce-subtle' : ''
        }`}
      style={{
        backgroundColor: theme.colors.backgroundPrimary,
        borderBottom: `1px solid ${theme.colors.borderSecondary}`,
      }}
    >
      {/* Top Bar - Promo */}
      <div
        className="w-full py-2 text-center text-xs font-medium tracking-wide"
        style={{
          backgroundColor: theme.colors.primary,
          color: '#ffffff',
        }}
      >
        FREE SHIPPING ON ALL ORDERS ABOVE ₹999 | EASY RETURNS
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md hover:bg-opacity-10 hover:bg-gray-500"
              style={{ color: theme.colors.textPrimary }}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/">
              <Logo />
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <SearchAutocomplete
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSearch={handleSearch}
            />
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <Link
              to="/wishlist"
              className="p-2 rounded-full hover:bg-opacity-10 hover:bg-gray-500 relative transition-colors"
              style={{ color: theme.colors.textPrimary }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span
                  className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 rounded-full"
                  style={{ backgroundColor: theme.colors.accentPrimary }}
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="p-2 rounded-full hover:bg-opacity-10 hover:bg-gray-500 relative transition-colors"
              style={{ color: theme.colors.textPrimary }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span
                  className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 rounded-full"
                  style={{ backgroundColor: theme.colors.accentPrimary }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {!isAuthenticated ? (
              <Link
                to="/login"
                className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-md transition-colors"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: '#ffffff',
                }}
              >
                <span>Login</span>
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'user' ? null : 'user')}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-opacity-10 hover:bg-gray-500 transition-colors"
                  style={{ color: theme.colors.textPrimary }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeDropdown === 'user' && (
                  <div
                    className="absolute right-0 mt-2 w-48 py-2 shadow-lg border z-50"
                    style={{
                      backgroundColor: theme.colors.backgroundPrimary,
                      borderColor: theme.colors.borderSecondary,
                    }}
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-opacity-80 transition-colors"
                      style={{ color: theme.colors.textPrimary }}
                      onClick={() => setActiveDropdown(null)}
                    >
                      Profile
                    </Link>
                    {(user?.role === 'admin' || user?.role === 'editor') && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 hover:bg-opacity-80 transition-colors"
                        style={{ color: theme.colors.textPrimary }}
                        onClick={() => setActiveDropdown(null)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setActiveDropdown(null);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-opacity-80 transition-colors"
                      style={{ color: theme.colors.textPrimary }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu - Desktop */}
        <div className="hidden lg:block border-t" style={{ borderColor: theme.colors.borderSecondary }}>
          <div className="flex items-center gap-8 py-3">
            {Object.entries(furnitureCategories).map(([category, items]) => (
              <div
                key={category}
                className="relative"
                onMouseEnter={() => handleDropdownEnter(category)}
                onMouseLeave={handleDropdownLeave}
              >
                <Link
                  to={`/category/${encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and'))}`}
                  className="flex items-center gap-1 font-medium transition-colors hover:opacity-80"
                  style={{ color: theme.colors.textPrimary }}
                  onClick={() => setActiveDropdown(null)}
                >
                  {category}
                  {items.length > 0 && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>

                {/* Mega Menu Dropdown - Stays open on hover */}
                {activeDropdown === category && items.length > 0 && (
                  <div
                    className="absolute left-0 top-full mt-2 w-screen max-w-4xl shadow-xl border z-50 p-6 rounded-lg"
                    style={{
                      backgroundColor: theme.colors.backgroundPrimary,
                      borderColor: theme.colors.borderSecondary,
                    }}
                    onMouseEnter={() => handleDropdownEnter(category)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <div className="grid grid-cols-3 gap-8">
                      {items.map((item: any) => (
                        <div key={item.name}>
                          <h3
                            className="font-bold mb-3 text-base"
                            style={{ color: theme.colors.textPrimary }}
                          >
                            {item.name}
                          </h3>
                          <ul className="space-y-2">
                            {item.subcategories.map((sub: string) => (
                              <li key={sub}>
                                <Link
                                  to={`/category/${encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and'))}/${encodeURIComponent(sub.toLowerCase().replace(/\s+/g, '-'))}`}
                                  className="text-sm transition-colors hover:opacity-80 block"
                                  style={{ color: theme.colors.textSecondary }}
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  {sub}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    {/* View All Link */}
                    <div className="mt-6 pt-4 border-t" style={{ borderColor: theme.colors.borderSecondary }}>
                      <Link
                        to={`/category/${encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and'))}`}
                        className="font-bold text-sm hover:underline"
                        style={{ color: theme.colors.accentPrimary }}
                        onClick={() => setActiveDropdown(null)}
                      >
                        View All {category} →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <Link
              to="/products?filter=new"
              className="font-medium transition-colors hover:opacity-80"
              style={{ color: theme.colors.textPrimary }}
            >
              New Arrivals
            </Link>

            <Link
              to="/products?category=Chest of Drawer"
              className="font-medium transition-colors hover:opacity-80"
              style={{ color: theme.colors.textPrimary }}
            >
              Chest of Drawer
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden border-t"
            style={{
              backgroundColor: theme.colors.backgroundPrimary,
              borderColor: theme.colors.borderSecondary,
            }}
          >
            {/* Mobile Search */}
            <div className="px-4 py-3 border-b" style={{ borderColor: theme.colors.borderSecondary }}>
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full px-4 py-2 pr-10 rounded-md border"
                    style={{
                      backgroundColor: theme.colors.backgroundSecondary,
                      borderColor: theme.colors.borderSecondary,
                      color: theme.colors.textPrimary,
                    }}
                  />
                  <button
                    type="submit"
                    className="absolute right-0 top-0 h-full px-3"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>

            <div className="px-4 py-4 space-y-3">
              {Object.keys(furnitureCategories).map((category) => (
                <Link
                  key={category}
                  to={`/collections/${encodeURIComponent(category)}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 font-medium"
                  style={{ color: theme.colors.textPrimary }}
                >
                  {category}
                </Link>
              ))}
              <Link
                to="/products?filter=new"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 font-medium"
                style={{ color: theme.colors.textPrimary }}
              >
                New Arrivals
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 font-medium"
                    style={{ color: theme.colors.textPrimary }}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 font-medium"
                    style={{ color: theme.colors.textPrimary }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 font-medium"
                  style={{ color: theme.colors.textPrimary }}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
