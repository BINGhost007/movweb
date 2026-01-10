import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BookmarkIcon, StarIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';

interface WatchlistMovie {
  _id: string;
  movie: {
    _id: string;
    title: string;
    posterUrl: string;
    year: number;
    rating: number;
  };
}

const WatchlistPage = () => {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<WatchlistMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        setLoading(true);
        const response = await api.get('/watchlist');
        setWatchlist(response.data.data);
      } catch (err) {
        console.error('Error fetching watchlist:', err);
        setError('Failed to load watchlist');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchWatchlist();
    }
  }, [user]);

  const handleRemoveFromWatchlist = async (watchlistId: string) => {
    try {
      await api.delete(`/watchlist/${watchlistId}`);
      setWatchlist(watchlist.filter(w => w._id !== watchlistId));
      toast.success('Removed from watchlist');
    } catch (err) {
      console.error('Error removing from watchlist:', err);
      toast.error('Failed to remove from watchlist');
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Please login to view your watchlist</p>
        <Link to="/login" className="text-blue-400 hover:text-blue-300 mt-4 inline-block">
          Login
        </Link>
      </div>
    );
  }

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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">My Watchlist</h2>
      
      {watchlist.length === 0 ? (
        <div className="text-center py-8">
          <BookmarkIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">Your watchlist is empty</p>
          <Link to="" className="text-blue-400 hover:text-blue-300 mt-4 inline-block">
            Browse movies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {watchlist.map((item) => (
            <div key={item._id} className="bg-gray-800 rounded-lg overflow-hidden relative">
              <button
                onClick={() => handleRemoveFromWatchlist(item._id)}
                className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1 z-10"
                title="Remove from watchlist"
              >
                <BookmarkIcon className="h-5 w-5" fill="currentColor" />
              </button>
              
              <Link to={`/movie/${item.movie._id}`} className="block">
                <img
                  src={item.movie.posterUrl}
                  alt={item.movie.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/default-movie.jpg';
                  }}
                />
              </Link>
              
              <div className="p-3">
                <h3 className="font-semibold text-white truncate mb-1">{item.movie.title}</h3>
                
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{item.movie.year}</span>
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 text-yellow-400" />
                    <span className="ml-1">{item.movie.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;