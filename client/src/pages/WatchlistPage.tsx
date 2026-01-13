import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { Movie } from '../data/movies';

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading watchlist from API/localStorage
    const loadWatchlist = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock watchlist movies (in a real app, this would come from user data)
        const watchlistMovies: Movie[] = [
          // These would typically be loaded from user preferences/API
        ];
        
        setWatchlist(watchlistMovies);
      } catch (error) {
        console.error('Error loading watchlist:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWatchlist();
  }, []);

  const removeFromWatchlist = (movieId: string) => {
    setWatchlist(prev => prev.filter(movie => movie.id !== movieId));
  };

  const markAsWatched = (movieId: string) => {
    // In a real app, this would move the movie to watched list or update status
    removeFromWatchlist(movieId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center space-x-3">
            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>My Watchlist</span>
          </h1>
          <p className="text-gray-400">
            Movies you want to watch
          </p>
        </div>

        {watchlist.length > 0 ? (
          <div>
            {/* Stats */}
            <div className="bg-gray-900 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-500">{watchlist.length}</div>
                  <div className="text-gray-400">Movies to Watch</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-500">
                    {Math.round(watchlist.reduce((sum, movie) => sum + movie.imdbRating, 0) / watchlist.length * 10) / 10}
                  </div>
                  <div className="text-gray-400">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500">
                    {new Set(watchlist.flatMap(movie => movie.genres)).size}
                  </div>
                  <div className="text-gray-400">Genres</div>
                </div>
              </div>
            </div>

            {/* Movies Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
              {watchlist.map((movie) => (
                <div key={movie.id} className="relative group">
                  <MovieCard movie={movie} size="medium" />
                  <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      onClick={() => markAsWatched(movie.id)}
                      className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full"
                      title="Mark as watched"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => removeFromWatchlist(movie.id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
                      title="Remove from watchlist"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Genres Summary */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Your Watchlist Genres</h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(watchlist.flatMap(movie => movie.genres)))
                  .sort((a, b) => {
                    const countA = watchlist.filter(movie => movie.genres.includes(a)).length;
                    const countB = watchlist.filter(movie => movie.genres.includes(b)).length;
                    return countB - countA;
                  })
                  .map((genre) => {
                    const count = watchlist.filter(movie => movie.genres.includes(genre)).length;
                    return (
                      <Link
                        key={genre}
                        to={`/category/${genre.toLowerCase()}`}
                        className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-4 py-2 rounded-full transition-colors flex items-center space-x-2"
                      >
                        <span>{genre}</span>
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                          {count}
                        </span>
                      </Link>
                    );
                  })}
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <svg className="w-24 h-24 text-gray-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            <h2 className="text-2xl font-bold text-white mb-4">Your watchlist is empty</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Start building your watchlist by adding movies you want to watch. Click the + icon on any movie to add it here.
            </p>
            <div className="space-y-4">
              <Link
                to="/"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Discover Movies
              </Link>
              <div className="text-gray-500 text-sm">
                or browse by genre
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Thriller'].map((genre) => (
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
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;