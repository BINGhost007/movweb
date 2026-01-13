import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { Movie } from '../data/movies';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading favorites from API/localStorage
    const loadFavorites = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock favorite movies (in a real app, this would come from user data)
        const favoriteMovies: Movie[] = [
          // These would typically be loaded from user preferences/API
        ];
        
        setFavorites(favoriteMovies);
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const removeFromFavorites = (movieId: string) => {
    setFavorites(prev => prev.filter(movie => movie.id !== movieId));
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
            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
            </svg>
            <span>My Favorites</span>
          </h1>
          <p className="text-gray-400">
            Your favorite movies collection
          </p>
        </div>

        {favorites.length > 0 ? (
          <div>
            {/* Stats */}
            <div className="bg-gray-900 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-500">{favorites.length}</div>
                  <div className="text-gray-400">Favorite Movies</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-500">
                    {Math.round(favorites.reduce((sum, movie) => sum + movie.imdbRating, 0) / favorites.length * 10) / 10}
                  </div>
                  <div className="text-gray-400">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-500">
                    {new Set(favorites.flatMap(movie => movie.genres)).size}
                  </div>
                  <div className="text-gray-400">Genres</div>
                </div>
              </div>
            </div>

            {/* Movies Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
              {favorites.map((movie) => (
                <div key={movie.id} className="relative group">
                  <MovieCard movie={movie} size="medium" />
                  <button
                    onClick={() => removeFromFavorites(movie.id)}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    title="Remove from favorites"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Genres Summary */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Your Favorite Genres</h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(favorites.flatMap(movie => movie.genres)))
                  .sort((a, b) => {
                    const countA = favorites.filter(movie => movie.genres.includes(a)).length;
                    const countB = favorites.filter(movie => movie.genres.includes(b)).length;
                    return countB - countA;
                  })
                  .map((genre) => {
                    const count = favorites.filter(movie => movie.genres.includes(genre)).length;
                    return (
                      <Link
                        key={genre}
                        to={`/category/${genre.toLowerCase()}`}
                        className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-4 py-2 rounded-full transition-colors flex items-center space-x-2"
                      >
                        <span>{genre}</span>
                        <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-white mb-4">No favorites yet</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Start building your collection by adding movies to your favorites. Click the heart icon on any movie to add it here.
            </p>
            <div className="space-y-4">
              <Link
                to="/"
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
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

export default FavoritesPage;