import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { getMoviesByGenre, getAllGenres, Movie } from '../data/movies';

const CategoriesPage = () => {
  const { genre } = useParams<{ genre?: string }>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>(genre || '');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 12;

  const allGenres = getAllGenres();

  useEffect(() => {
    if (genre) {
      setSelectedGenre(genre);
      loadMoviesByGenre(genre);
    } else {
      setSelectedGenre('');
      setMovies([]);
    }
  }, [genre]);

  const loadMoviesByGenre = async (genreName: string) => {
    setIsLoading(true);
    try {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const genreMovies = getMoviesByGenre(genreName);
      setMovies(genreMovies);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenreSelect = (genreName: string) => {
    setSelectedGenre(genreName);
    loadMoviesByGenre(genreName);
  };

  // Pagination
  const totalPages = Math.ceil(movies.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const paginatedMovies = movies.slice(startIndex, startIndex + resultsPerPage);

  const genreEmojis: Record<string, string> = {
    'Action': '🎬',
    'Adventure': '🗺️',
    'Animation': '🎨',
    'Comedy': '😂',
    'Crime': '🔫',
    'Documentary': '📹',
    'Drama': '🎭',
    'Family': '👨‍👩‍👧‍👦',
    'Fantasy': '🧙‍♂️',
    'History': '📜',
    'Horror': '👻',
    'Music': '🎵',
    'Mystery': '🔍',
    'Romance': '💕',
    'Sci-Fi': '🚀',
    'Thriller': '⚡',
    'War': '⚔️',
    'Western': '🤠'
  };

  const genreColors: Record<string, string> = {
    'Action': 'from-red-600 to-red-800',
    'Adventure': 'from-green-600 to-green-800',
    'Animation': 'from-pink-600 to-pink-800',
    'Comedy': 'from-yellow-600 to-yellow-800',
    'Crime': 'from-gray-600 to-gray-800',
    'Documentary': 'from-blue-600 to-blue-800',
    'Drama': 'from-purple-600 to-purple-800',
    'Family': 'from-orange-600 to-orange-800',
    'Fantasy': 'from-indigo-600 to-indigo-800',
    'History': 'from-amber-600 to-amber-800',
    'Horror': 'from-red-800 to-black',
    'Music': 'from-rose-600 to-rose-800',
    'Mystery': 'from-slate-600 to-slate-800',
    'Romance': 'from-pink-500 to-rose-500',
    'Sci-Fi': 'from-cyan-600 to-cyan-800',
    'Thriller': 'from-orange-700 to-red-700',
    'War': 'from-red-700 to-gray-700',
    'Western': 'from-yellow-700 to-orange-700'
  };

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {selectedGenre ? `${selectedGenre} Movies` : 'Browse Categories'}
          </h1>
          <p className="text-gray-400">
            {selectedGenre 
              ? `Discover amazing ${selectedGenre.toLowerCase()} movies`
              : 'Explore movies by genre'
            }
          </p>
        </div>

        {!selectedGenre ? (
          /* Genre Grid */
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">All Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {allGenres.map((genreName) => (
                <button
                  key={genreName}
                  onClick={() => handleGenreSelect(genreName)}
                  className="group relative overflow-hidden rounded-lg aspect-square transition-transform hover:scale-105"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${genreColors[genreName] || 'from-gray-600 to-gray-800'}`}></div>
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
                  <div className="relative z-10 h-full flex flex-col items-center justify-center text-white">
                    <div className="text-4xl mb-2">
                      {genreEmojis[genreName] || '🎬'}
                    </div>
                    <div className="text-sm font-semibold text-center px-2">
                      {genreName}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Movies Grid */
          <div>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="loading-spinner"></div>
              </div>
            ) : movies.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <Link 
                      to="/categories" 
                      className="text-red-400 hover:text-red-300 font-medium transition-colors"
                    >
                      ← All Categories
                    </Link>
                    <span className="text-gray-400">•</span>
                    <span className="text-white font-semibold">
                      {movies.length} movie{movies.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
                  {paginatedMovies.map((movie) => (
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
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 3v10a2 2 0 002 2h6a2 2 0 002-2V7H7z" />
                </svg>
                <h3 className="text-xl font-semibold text-white mb-2">No movies found</h3>
                <p className="text-gray-400 mb-6">
                  There are no movies in the {selectedGenre} category yet.
                </p>
                <Link
                  to="/categories"
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Browse All Categories
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;