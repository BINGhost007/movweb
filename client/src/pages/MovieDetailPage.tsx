import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { HeartIcon, BookmarkIcon, PlayIcon, ArrowDownTrayIcon, StarIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import ReactPlayer from 'react-player';

interface Movie {
  _id: string;
  title: string;
  description: string;
  year: number;
  duration: number;
  rating: number;
  quality: string;
  posterUrl: string;
  streamingUrl: string;
  downloadUrl: string;
  categories: { _id: string; name: string }[];
  tags: string[];
  views: number;
  downloads: number;
  createdBy: { _id: string; name: string };
}

interface RelatedMovie {
  _id: string;
  title: string;
  posterUrl: string;
  year: number;
  rating: number;
}

const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [relatedMovies, setRelatedMovies] = useState<RelatedMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch movie details
        const movieResponse = await api.get(`/movies/${id}`);
        setMovie(movieResponse.data.data);
        
        // Fetch related movies
        const relatedResponse = await api.get(`/movies/${id}/related`);
        setRelatedMovies(relatedResponse.data.data);
        
        // Check if movie is in favorites
        if (user) {
          const favoriteResponse = await api.get(`/favorites/check/${id}`);
          setIsFavorite(favoriteResponse.data.isFavorite);
          
          const watchlistResponse = await api.get(`/watchlist/check/${id}`);
          setIsInWatchlist(watchlistResponse.data.isInWatchlist);
        }
        
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Failed to load movie details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovieDetails();
  }, [id, user]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      toast.error('Please login to add to favorites');
      return;
    }
    
    try {
      if (isFavorite) {
        // Remove from favorites
        const favorites = await api.get('/favorites');
        const favorite = favorites.data.data.find((f: any) => f.movie._id === id);
        if (favorite) {
          await api.delete(`/favorites/${favorite._id}`);
          setIsFavorite(false);
          toast.success('Removed from favorites');
        }
      } else {
        // Add to favorites
        await api.post('/favorites', { movieId: id });
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (err) {
      console.error('Error updating favorites:', err);
      toast.error('Failed to update favorites');
    }
  };

  const handleWatchlistToggle = async () => {
    if (!user) {
      toast.error('Please login to add to watchlist');
      return;
    }
    
    try {
      if (isInWatchlist) {
        // Remove from watchlist
        const watchlist = await api.get('/watchlist');
        const item = watchlist.data.data.find((w: any) => w.movie._id === id);
        if (item) {
          await api.delete(`/watchlist/${item._id}`);
          setIsInWatchlist(false);
          toast.success('Removed from watchlist');
        }
      } else {
        // Add to watchlist
        await api.post('/watchlist', { movieId: id });
        setIsInWatchlist(true);
        toast.success('Added to watchlist');
      }
    } catch (err) {
      console.error('Error updating watchlist:', err);
      toast.error('Failed to update watchlist');
    }
  };

  const handleDownload = async () => {
    if (!user) {
      toast.error('Please login to download');
      return;
    }
    
    try {
      const response = await api.post(`/movies/${id}/download`);
      window.open(response.data.downloadUrl, '_blank');
      toast.success('Download started');
    } catch (err) {
      console.error('Error downloading:', err);
      toast.error('Failed to start download');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Movie not found</p>
        <Link to="" className="text-blue-400 hover:text-blue-300 mt-4 inline-block">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Movie Header */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Poster */}
        <div className="lg:w-1/3">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full rounded-lg shadow-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/default-movie.jpg';
            }}
          />
        </div>
        
        {/* Movie Info */}
        <div className="lg:w-2/3 space-y-4">
          <h1 className="text-3xl font-bold text-white">{movie.title}</h1>
          
          <div className="flex items-center space-x-4 text-gray-400">
            <span>{movie.year}</span>
            <span>{movie.duration} min</span>
            <div className="flex items-center">
              <StarIcon className="h-5 w-5 text-yellow-400" />
              <span className="ml-1">{movie.rating.toFixed(1)}</span>
            </div>
            <span className="bg-yellow-600 text-white px-2 py-1 rounded text-sm">{movie.quality}</span>
          </div>
          
          <p className="text-gray-300 leading-relaxed">{movie.description}</p>
          
          <div className="flex flex-wrap gap-2">
            {movie.categories.map((category) => (
              <span key={category._id} className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
                {category.name}
              </span>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {movie.tags.map((tag, index) => (
              <span key={index} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center space-x-4 pt-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
            >
              <PlayIcon className="h-5 w-5 mr-2" />
              {isPlaying ? 'Pause' : 'Watch Now'}
            </button>
            
            <button
              onClick={handleDownload}
              className="flex items-center bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Download
            </button>
            
            <button
              onClick={handleFavoriteToggle}
              className={`p-2 rounded-full transition-colors ${isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <HeartIcon className="h-6 w-6" fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
            
            <button
              onClick={handleWatchlistToggle}
              className={`p-2 rounded-full transition-colors ${isInWatchlist ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'}`}
              title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
            >
              <BookmarkIcon className="h-6 w-6" fill={isInWatchlist ? 'currentColor' : 'none'} />
            </button>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>Views: {movie.views} | Downloads: {movie.downloads}</p>
            <p>Added by: {movie.createdBy.name}</p>
          </div>
        </div>
      </div>
      
      {/* Video Player */}
      {isPlaying && movie.streamingUrl && (
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="aspect-video bg-black rounded-md overflow-hidden">
            <ReactPlayer
              url={movie.streamingUrl}
              controls={true}
              width="100%"
              height="100%"
              playing={isPlaying}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />
          </div>
        </div>
      )}
      
      {/* Related Movies */}
      {relatedMovies.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Related Movies</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {relatedMovies.map((relatedMovie) => (
              <div key={relatedMovie._id} className="bg-gray-800 rounded-lg overflow-hidden">
                <Link to={`/movie/${relatedMovie._id}`} className="block">
                  <img
                    src={relatedMovie.posterUrl}
                    alt={relatedMovie.title}
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/default-movie.jpg';
                    }}
                  />
                </Link>
                
                <div className="p-2">
                  <h3 className="font-semibold text-white truncate text-sm mb-1">{relatedMovie.title}</h3>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{relatedMovie.year}</span>
                    <div className="flex items-center">
                      <StarIcon className="h-3 w-3 text-yellow-400" />
                      <span className="ml-1">{relatedMovie.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default MovieDetailPage;