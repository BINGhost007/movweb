import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { 
  getTrendingMovies, 
  getPopularMovies, 
  getNewReleases, 
  getRecommendedMovies,
  getFeaturedMovie 
} from '../data/movies';
import { Movie } from '../data/movies';

const HomePage = () => {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [newReleases, setNewReleases] = useState<Movie[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);

  useEffect(() => {
    // Load data
    setFeaturedMovie(getFeaturedMovie());
    setTrendingMovies(getTrendingMovies());
    setPopularMovies(getPopularMovies());
    setNewReleases(getNewReleases());
    setRecommendedMovies(getRecommendedMovies());
  }, []);

  if (!featuredMovie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Banner */}
      <section className="relative h-screen flex items-center">
        {/* Background Image/Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(45deg, 
              hsl(${parseInt(featuredMovie.id) * 7 % 360}, 70%, 20%), 
              hsl(${parseInt(featuredMovie.id) * 7 % 360}, 70%, 10%)
            )`
          }}
        ></div>
        
        {/* Hero Content */}
        <div className="relative z-20 container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 text-shadow-lg">
              {featuredMovie.title}
            </h1>
            <p className="text-xl text-gray-300 mb-6 leading-relaxed">
              {featuredMovie.description}
            </p>
            
            <div className="flex items-center space-x-4 mb-8">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-400 text-lg">★</span>
                <span className="text-white font-semibold">{featuredMovie.imdbRating.toFixed(1)}</span>
                <span className="text-gray-400">({featuredMovie.year})</span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-gray-300">{featuredMovie.duration}</span>
              <span className={`px-2 py-1 rounded text-sm font-bold ${featuredMovie.ageRating === 'R' ? 'bg-red-600 text-white' : 'bg-yellow-500 text-black'}`}>
                {featuredMovie.ageRating}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {featuredMovie.genres.map((genre) => (
                <span
                  key={genre}
                  className="bg-gray-800/80 backdrop-blur-sm text-gray-300 px-3 py-1 rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to={`/movie/${featuredMovie.id}`}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg transition-colors flex items-center justify-center space-x-2 text-lg"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 5v10l8-5-8-5z"/>
                </svg>
                <span>Watch Now</span>
              </Link>
              <Link
                to={`/movie/${featuredMovie.id}`}
                className="bg-gray-700/80 backdrop-blur-sm hover:bg-gray-600/80 text-white font-semibold py-4 px-8 rounded-lg transition-colors flex items-center justify-center space-x-2 text-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>More Info</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="animate-bounce">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="relative z-30 -mt-32 pb-20">
        <div className="container mx-auto px-4 space-y-12">
          
          {/* Trending Now */}
          {trendingMovies.length > 0 && (
            <section className="fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center space-x-2">
                  <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                  </svg>
                  <span>Trending Now</span>
                </h2>
                <Link to="/trending" className="text-red-400 hover:text-red-300 font-medium transition-colors">
                  See All →
                </Link>
              </div>
              <div className="carousel-container">
                <div className="carousel-track">
                  {trendingMovies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} size="medium" />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Popular Movies */}
          {popularMovies.length > 0 && (
            <section className="fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center space-x-2">
                  <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span>Popular Movies</span>
                </h2>
                <Link to="/popular" className="text-red-400 hover:text-red-300 font-medium transition-colors">
                  See All →
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {popularMovies.slice(0, 12).map((movie) => (
                  <MovieCard key={movie.id} movie={movie} size="medium" />
                ))}
              </div>
            </section>
          )}

          {/* New Releases */}
          {newReleases.length > 0 && (
            <section className="fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center space-x-2">
                  <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>New Releases</span>
                </h2>
                <Link to="/new" className="text-red-400 hover:text-red-300 font-medium transition-colors">
                  See All →
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {newReleases.slice(0, 12).map((movie) => (
                  <MovieCard key={movie.id} movie={movie} size="medium" />
                ))}
              </div>
            </section>
          )}

          {/* Recommended For You */}
          {recommendedMovies.length > 0 && (
            <section className="fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center space-x-2">
                  <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>Recommended For You</span>
                </h2>
                <Link to="/recommended" className="text-red-400 hover:text-red-300 font-medium transition-colors">
                  See All →
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {recommendedMovies.slice(0, 12).map((movie) => (
                  <MovieCard key={movie.id} movie={movie} size="medium" />
                ))}
              </div>
            </section>
          )}

          {/* Call to Action */}
          <section className="bg-gradient-to-r from-red-900/20 to-black/20 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Discover Your Next Favorite Movie
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Explore our vast collection of movies across all genres. From classic cinema to the latest blockbusters, find your perfect movie night.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/categories"
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Browse All Categories
              </Link>
              <Link
                to="/search"
                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Search Movies
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HomePage;