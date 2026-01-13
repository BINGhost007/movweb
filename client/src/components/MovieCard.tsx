import { Link } from 'react-router-dom';
import { Movie } from '../data/movies';

interface MovieCardProps {
  movie: Movie;
  showDescription?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const MovieCard = ({ movie, showDescription = false, size = 'medium' }: MovieCardProps) => {
  const sizeClasses = {
    small: 'w-40',
    medium: 'w-48',
    large: 'w-56'
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case '4K':
        return 'bg-purple-600 text-white';
      case '1080p':
        return 'bg-blue-600 text-white';
      case '720p':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getAgeRatingColor = (rating: string) => {
    switch (rating.toUpperCase()) {
      case 'G':
        return 'bg-green-500 text-white';
      case 'PG':
        return 'bg-yellow-500 text-black';
      case 'PG-13':
        return 'bg-orange-500 text-white';
      case 'R':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

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

  // Generate consistent gradient based on movie ID
  const gradientIndex = parseInt(movie.id) % posterGradients.length;
  const gradient = posterGradients[gradientIndex];

  // Generate initials from title
  const initials = movie.title
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0]?.toUpperCase())
    .join('');

  return (
    <div className={`group ${sizeClasses[size]} flex-shrink-0`}>
      <Link to={`/movie/${movie.id}`} className="block">
        <article className="movie-card relative overflow-hidden">
          {/* Movie Poster */}
          <div className={`aspect-[2/3] w-full bg-gradient-to-br ${gradient} flex items-center justify-center relative`}>
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <span className="text-white/90 text-4xl font-bold tracking-wider">
                {initials}
              </span>
            </div>
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="text-center p-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-2 transition-colors">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 5v10l8-5-8-5z"/>
                    </svg>
                  </button>
                  <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-2 transition-colors">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                  </button>
                </div>
                <p className="text-white text-xs font-medium">Play Trailer</p>
              </div>
            </div>

            {/* Quality Badge */}
            <div className="absolute top-2 right-2">
              <span className={`text-xs font-bold px-2 py-1 rounded ${getQualityColor(movie.quality)}`}>
                {movie.quality}
              </span>
            </div>

            {/* Age Rating */}
            <div className="absolute top-2 left-2">
              <span className={`text-xs font-bold px-2 py-1 rounded ${getAgeRatingColor(movie.ageRating)}`}>
                {movie.ageRating}
              </span>
            </div>

            {/* Rating */}
            <div className="absolute bottom-2 right-2 flex items-center space-x-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <span className="text-white text-sm font-bold">{movie.imdbRating.toFixed(1)}</span>
            </div>
          </div>

          {/* Movie Info */}
          <div className="p-4">
            <h3 className="text-white font-semibold text-lg leading-tight line-clamp-2 mb-2 group-hover:text-red-400 transition-colors">
              {movie.title}
            </h3>
            
            <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
              <span>{movie.year}</span>
              <span>•</span>
              <span>{movie.duration}</span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-1 mb-2">
              {movie.genres.slice(0, 2).map((genre) => (
                <span
                  key={genre}
                  className="genre-tag text-xs"
                >
                  {genre}
                </span>
              ))}
              {movie.genres.length > 2 && (
                <span className="text-xs text-gray-500">+{movie.genres.length - 2}</span>
              )}
            </div>

            {/* Description (shown on hover) */}
            {showDescription && (
              <p className="text-gray-300 text-sm line-clamp-3 leading-relaxed">
                {movie.description}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 mt-3">
              <button className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors flex items-center justify-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 5v10l8-5-8-5z"/>
                </svg>
                <span>Watch Now</span>
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
              </button>
            </div>
          </div>
        </article>
      </Link>
    </div>
  );
};

export default MovieCard;