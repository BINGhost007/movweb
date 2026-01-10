import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { HeartIcon, StarIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';

interface FavoriteMovie {
  _id: string;
  movie: {
    _id: string;
    title: string;
    posterUrl: string;
    year: number;
    rating: number;
  };
}

const FavoritesPage = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const response = await api.get('/favorites');
        setFavorites(response.data.data);
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setError('Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const handleRemoveFavorite = async (favoriteId: string) => {
    try {
      await api.delete(`/favorites/${favoriteId}`);
      setFavorites(favorites.filter(f => f._id !== favoriteId));
      toast.success('Removed from favorites');
    } catch (err) {
      console.error('Error removing favorite:', err);
      toast.error('Failed to remove from favorites');
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Please login to view your favorites</p>
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
      <h2 className="text-2xl font-bold text-white">My Favorites</h2>
      
      {favorites.length === 0 ? (
        <div className="text-center py-8">
          <HeartIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">You haven't added any movies to favorites yet</p>
          <Link to="" className="text-blue-400 hover:text-blue-300 mt-4 inline-block">
            Browse movies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {favorites.map((favorite) => (
            <div key={favorite._id} className="bg-gray-800 rounded-lg overflow-hidden relative">
              <button
                onClick={() => handleRemoveFavorite(favorite._id)}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 z-10"
                title="Remove from favorites"
              >
                <HeartIcon className="h-5 w-5" fill="currentColor" />
              </button>
              
              <Link to={`/movie/${favorite.movie._id}`} className="block">
                <img
                  src={favorite.movie.posterUrl}
                  alt={favorite.movie.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/default-movie.jpg';
                  }}
                />
              </Link>
              
              <div className="p-3">
                <h3 className="font-semibold text-white truncate mb-1">{favorite.movie.title}</h3>
                
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{favorite.movie.year}</span>
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 text-yellow-400" />
                    <span className="ml-1">{favorite.movie.rating.toFixed(1)}</span>
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

export default FavoritesPage;