import { Link } from 'react-router-dom';
import { StarIcon, PlayIcon } from '@heroicons/react/24/solid';

interface MovieCardProps {
  movie: {
    _id: string;
    title: string;
    posterUrl: string;
    year: number;
    rating: number;
    quality: string;
  };
}

const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300 group">
      <div className="relative">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/default-movie.jpg';
          }}
        />
        
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link
            to={`/movie/${movie._id}`}
            className="bg-white bg-opacity-90 hover:bg-opacity-100 text-black rounded-full p-3 transition-all duration-200"
          >
            <PlayIcon className="h-6 w-6" />
          </Link>
        </div>
        
        <div className="absolute top-2 left-2 bg-yellow-600 text-white px-2 py-1 rounded text-xs font-bold">
          {movie.quality}
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="font-semibold text-white truncate mb-1">{movie.title}</h3>
        
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>{movie.year}</span>
          <div className="flex items-center">
            <StarIcon className="h-4 w-4 text-yellow-400" />
            <span className="ml-1">{movie.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;