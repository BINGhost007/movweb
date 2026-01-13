import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { getMovieById, getMoviesByGenre, Movie } from '../data/movies';

const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundMovie = getMovieById(id);
      setMovie(foundMovie || null);
      
      if (foundMovie) {
        // Get related movies from the same genre
        const related = getMoviesByGenre(foundMovie.genres[0])
          .filter(m => m.id !== id)
          .slice(0, 6);
        setRelatedMovies(related);
      }
      
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Movie not found</h1>
          <Link to="/" className="text-red-400 hover:text-red-300">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const posterGradients = [
    'from-red-600 to-red-800',
    'from-blue-600 to-blue-800',
    'from-purple-600 to-purple-800',
    'from-green-600 to-green-800',
    'from-yellow-600 to-yellow-800',
    'from-pink-600 to-pink-800',
    'from-indigo-600 to-indigo-800',
    'from-orange-600 to-orange-800',
  ];

  const gradientIndex = parseInt(movie.id) % posterGradients.length;
  const gradient = posterGradients[gradientIndex];

  const initials = movie.title
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0]?.toUpperCase())
    .join('');

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(45deg, 
              hsl(${parseInt(movie.id) * 7 % 360}, 70%, 15%), 
              hsl(${parseInt(movie.id) * 7 % 360}, 70%, 5%)
            )`
          }}
        ></div>
        
        {/* Content */}
        <div className="relative z-20 container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            {/* Movie Poster */}
            <div className="flex-shrink-0">
              <div className={`w-80 h-96 bg-gradient-to-br ${gradient} rounded-lg overflow-hidden shadow-2xl`}>
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white/90 text-6xl font-bold tracking-wider">
                    {initials}
                  </span>
                </div>
              </div>
            </div>

            {/* Movie Info */}
            <div className="flex-1 max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 text-shadow-lg">
                {movie.title}
              </h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400 text-xl">★</span>
                  <span className="text-white font-bold text-lg">{movie.imdbRating.toFixed(1)}</span>
                  <span className="text-gray-400">({movie.year})</span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-gray-300">{movie.duration}</span>
                <span className={`px-3 py-1 rounded text-sm font-bold ${
                  movie.ageRating === 'R' ? 'bg-red-600 text-white' : 
                  movie.ageRating === 'PG-13' ? 'bg-orange-500 text-white' :
                  movie.ageRating === 'PG' ? 'bg-yellow-500 text-black' :
                  'bg-green-500 text-white'
                }`}>
                  {movie.ageRating}
                </span>
                <span className={`px-3 py-1 rounded text-sm font-bold ${
                  movie.quality === '4K' ? 'bg-purple-600 text-white' :
                  movie.quality === '1080p' ? 'bg-blue-600 text-white' :
                  'bg-green-600 text-white'
                }`}>
                  {movie.quality}
                </span>
              </div>

              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {movie.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div>
                  <span className="text-gray-400 font-semibold">Director:</span>
                  <p className="text-white">{movie.director}</p>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold">Cast:</span>
                  <p className="text-white">{movie.cast.slice(0, 3).join(', ')}</p>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold">Genres:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {movie.genres.map((genre) => (
                      <Link
                        key={genre}
                        to={`/category/${genre.toLowerCase()}`}
                        className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-3 py-1 rounded-full text-sm transition-colors"
                      >
                        {genre}
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold">Language:</span>
                  <p className="text-white">{movie.language}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg transition-colors flex items-center justify-center space-x-2 text-lg">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 5v10l8-5-8-5z"/>
                  </svg>
                  <span>Watch Now</span>
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors flex items-center justify-center space-x-2 text-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  <span>Add to Watchlist</span>
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors flex items-center justify-center space-x-2 text-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>Add to Favorites</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Movie Details Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Details */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-white mb-6">Movie Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-gray-400 font-semibold mb-2">Director</h3>
                    <p className="text-white">{movie.director}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400 font-semibold mb-2">Cast</h3>
                    <p className="text-white">{movie.cast.join(', ')}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400 font-semibold mb-2">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {movie.genres.map((genre) => (
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
                <div className="space-y-4">
                  <div>
                    <h3 className="text-gray-400 font-semibold mb-2">Release Date</h3>
                    <p className="text-white">{new Date(movie.releaseDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400 font-semibold mb-2">Duration</h3>
                    <p className="text-white">{movie.duration}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400 font-semibold mb-2">Country</h3>
                    <p className="text-white">{movie.country}</p>
                  </div>
                </div>
              </div>

              {/* Scores */}
              <div className="mt-8">
                <h3 className="text-xl font-bold text-white mb-4">Ratings & Reviews</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">{movie.imdbRating.toFixed(1)}</div>
                    <div className="text-gray-400 text-sm">IMDb</div>
                  </div>
                  {movie.metacriticScore && (
                    <div className="bg-gray-800 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-400">{movie.metacriticScore}</div>
                      <div className="text-gray-400 text-sm">Metacritic</div>
                    </div>
                  )}
                  {movie.rottenTomatoesScore && (
                    <div className="bg-gray-800 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-red-400">{movie.rottenTomatoesScore}%</div>
                      <div className="text-gray-400 text-sm">Rotten Tomatoes</div>
                    </div>
                  )}
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">{movie.rating.toFixed(1)}</div>
                    <div className="text-gray-400 text-sm">User Rating</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Quick Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Quality:</span>
                    <span className="text-white font-semibold">{movie.quality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Age Rating:</span>
                    <span className="text-white font-semibold">{movie.ageRating}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Language:</span>
                    <span className="text-white font-semibold">{movie.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Year:</span>
                    <span className="text-white font-semibold">{movie.year}</span>
                  </div>
                  {movie.boxOffice && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Box Office:</span>
                      <span className="text-white font-semibold">{movie.boxOffice}</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="mt-6">
                  <h4 className="text-white font-semibold mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {movie.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Movies */}
      {relatedMovies.length > 0 && (
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
              More like this
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {relatedMovies.map((relatedMovie) => (
                <MovieCard key={relatedMovie.id} movie={relatedMovie} size="small" />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default MovieDetailPage;