import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { movies } from '../data/movies';

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const categories = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
    'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery',
    'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Trending', path: '/trending' },
    { name: 'New Releases', path: '/new' },
    { name: 'Categories', path: '/categories' },
    ...(user ? [
      { name: 'My Favorites', path: '/favorites' },
      { name: 'Watchlist', path: '/watchlist' }
    ] : [])
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/95 backdrop-blur-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-red-600">NETFLIX</div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-gray-300 ${
                  location.pathname === link.path ? 'text-white' : 'text-gray-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-black/50 border border-gray-600 rounded-md px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:border-white focus:bg-black/70 transition-all w-64"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>

          {/* Categories Dropdown */}
          <div className="hidden lg:block relative">
            <button
              onClick={() => setShowCategories(!showCategories)}
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Genres ▼
            </button>
            {showCategories && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-black/95 backdrop-blur-sm border border-gray-700 rounded-md shadow-lg">
                <div className="grid grid-cols-2 gap-1 p-2">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      to={`/category/${category.toLowerCase()}`}
                      onClick={() => setShowCategories(false)}
                      className="text-sm text-gray-300 hover:text-white hover:bg-gray-800 px-2 py-1 rounded transition-colors"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.email?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-black/95 backdrop-blur-sm border border-gray-700 rounded-md shadow-lg">
                <div className="p-2">
                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="block text-sm text-gray-300 hover:text-white hover:bg-gray-800 px-2 py-2 rounded transition-colors"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/favorites"
                    onClick={() => setShowUserMenu(false)}
                    className="block text-sm text-gray-300 hover:text-white hover:bg-gray-800 px-2 py-2 rounded transition-colors"
                  >
                    My Favorites
                  </Link>
                  <Link
                    to="/watchlist"
                    onClick={() => setShowUserMenu(false)}
                    className="block text-sm text-gray-300 hover:text-white hover:bg-gray-800 px-2 py-2 rounded transition-colors"
                  >
                    Watchlist
                  </Link>
                  <hr className="border-gray-700 my-2" />
                  <button
                    onClick={() => setShowUserMenu(false)}
                    className="block w-full text-left text-sm text-gray-300 hover:text-white hover:bg-gray-800 px-2 py-2 rounded transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;