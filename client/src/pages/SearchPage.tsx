import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { searchMovies, Movie } from '../data/movies';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 12;

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [searchParams]);

  const performSearch = async (query: string) => {
    setIsLoading(true);
    try {
      // Simulate search delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const results = searchMovies(query);
      setSearchResults(results);
      setCurrentPage(1);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchParams({});
  };

  // Pagination
  const totalPages = Math.ceil(searchResults.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const paginatedResults = searchResults.slice(startIndex, startIndex + resultsPerPage);

  const genres = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
    'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery',
    'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'
  ];

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Search Movies
          </h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for movies, actors, directors, genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button
              type="submit"
              className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Quick Genre Links */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Browse by Genre</h2>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <Link
                key={genre}
                to={`/category/${genre.toLowerCase()}`}
                className="genre-tag"
              >
                {genre}
              </Link>
            ))}
          </div>
        </div>

        {/* Search Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="loading-spinner"></div>
          </div>
        ) : searchQuery && searchResults.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Search Results for "{searchQuery}"
              </h2>
              <span className="text-gray-400">
                {searchResults.length} movie{searchResults.length !== 1 ? 's' : ''} found
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
              {paginatedResults.map((movie) => (
                <MovieCard key={movie.id} movie={movie} size="medium" />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg ${
                        currentPage === page
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : searchQuery && searchResults.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
            <p className="text-gray-400 mb-4">
              We couldn't find any movies matching "{searchQuery}"
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>Try:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Checking your spelling</li>
                <li>Using different keywords</li>
                <li>Searching for a genre instead</li>
                <li>Browsing our popular movies</li>
              </ul>
            </div>
            <Link
              to="/"
              className="inline-block mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Browse Popular Movies
            </Link>
          </div>
        ) : (
          /* Default State */
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">Discover Amazing Movies</h3>
            <p className="text-gray-400 mb-6">
              Search for your favorite movies, actors, directors, or browse by genre
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
              {genres.slice(0, 12).map((genre) => (
                <Link
                  key={genre}
                  to={`/category/${genre.toLowerCase()}`}
                  className="bg-gray-800 hover:bg-gray-700 text-white p-4 rounded-lg transition-colors text-center"
                >
                  <div className="text-2xl mb-2">
                    {genre === 'Action' && '🎬'}
                    {genre === 'Comedy' && '😂'}
                    {genre === 'Drama' && '🎭'}
                    {genre === 'Horror' && '👻'}
                    {genre === 'Sci-Fi' && '🚀'}
                    {genre === 'Romance' && '💕'}
                    {genre === 'Thriller' && '🔍'}
                    {genre === 'Adventure' && '🗺️'}
                    {genre === 'Animation' && '🎨'}
                    {genre === 'Fantasy' && '🧙‍♂️'}
                    {genre === 'Crime' && '🔫'}
                    {genre === 'Documentary' && '📹'}
                  </div>
                  <div className="text-sm font-medium">{genre}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;