import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ChartBarIcon, FilmIcon, UsersIcon, TagIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

interface Stats {
  movies: {
    total: number;
    popular: number;
    views: number;
    downloads: number;
  };
  users: {
    total: number;
    active: number;
    admin: number;
    inactive: number;
  };
  categories: {
    total: number;
  };
  topMovies: {
    byViews: { title: string; views: number }[];
    byDownloads: { title: string; downloads: number }[];
  };
}

interface MovieStats {
  _id: string;
  count: number;
  avgRating: number;
  totalViews: number;
  totalDownloads: number;
}

interface ActivityStats {
  _id: string;
  count: number;
}

const AdminStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [movieStats, setMovieStats] = useState<MovieStats[]>([]);
  const [activityStats, setActivityStats] = useState<ActivityStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch main stats
        const statsResponse = await api.get('/stats');
        setStats(statsResponse.data.data);
        
        // Fetch movie stats
        const movieStatsResponse = await api.get('/stats/movies');
        setMovieStats(movieStatsResponse.data.data);
        
        // Fetch activity stats
        const activityStatsResponse = await api.get('/stats/activity');
        setActivityStats(activityStatsResponse.data.data);
        
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Access denied. Admin privileges required.</p>
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
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Platform Statistics</h1>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Movies</p>
              <p className="text-3xl font-bold text-white mt-2">{stats?.movies.total || 0}</p>
            </div>
            <div className="bg-blue-600 p-3 rounded-full">
              <FilmIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-white mt-2">{stats?.users.total || 0}</p>
            </div>
            <div className="bg-green-600 p-3 rounded-full">
              <UsersIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Views</p>
              <p className="text-3xl font-bold text-white mt-2">{stats?.movies.views || 0}</p>
            </div>
            <div className="bg-purple-600 p-3 rounded-full">
              <ChartBarIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Categories</p>
              <p className="text-3xl font-bold text-white mt-2">{stats?.categories.total || 0}</p>
            </div>
            <div className="bg-yellow-600 p-3 rounded-full">
              <TagIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Movie Statistics by Quality</h3>
          <div className="space-y-4">
            {movieStats.map((stat) => (
              <div key={stat._id} className="bg-gray-700 rounded-md p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium">{stat._id}</p>
                    <p className="text-gray-400 text-sm">
                      {stat.count} movies • Avg Rating: {stat.avgRating.toFixed(1)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{stat.totalViews} views</p>
                    <p className="text-gray-400 text-sm">{stat.totalDownloads} downloads</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">User Activity (Last 30 Days)</h3>
          <div className="space-y-2">
            {activityStats.length > 0 ? (
              activityStats.map((stat) => (
                <div key={stat._id} className="flex justify-between items-center p-2 bg-gray-700 rounded">
                  <span className="text-gray-300">{stat._id}</span>
                  <span className="text-white font-medium">{stat.count} logins</span>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No activity data available</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Top Movies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Top Movies by Views</h3>
          <div className="space-y-3">
            {stats?.topMovies.byViews.map((movie, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-700 rounded-md">
                <div className="flex items-center">
                  <span className="text-gray-400 mr-3">{index + 1}.</span>
                  <span className="text-white font-medium">{movie.title}</span>
                </div>
                <div className="flex items-center">
                  <ArrowTrendingUpIcon className="h-5 w-5 text-green-400 mr-1" />
                  <span className="text-white font-medium">{movie.views} views</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Top Movies by Downloads</h3>
          <div className="space-y-3">
            {stats?.topMovies.byDownloads.map((movie, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-700 rounded-md">
                <div className="flex items-center">
                  <span className="text-gray-400 mr-3">{index + 1}.</span>
                  <span className="text-white font-medium">{movie.title}</span>
                </div>
                <div className="flex items-center">
                  <ArrowTrendingDownIcon className="h-5 w-5 text-blue-400 mr-1" />
                  <span className="text-white font-medium">{movie.downloads} downloads</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* User Stats */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">User Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-700 rounded-md p-4 text-center">
            <p className="text-gray-400 text-sm">Total Users</p>
            <p className="text-2xl font-bold text-white mt-2">{stats?.users.total || 0}</p>
          </div>
          
          <div className="bg-green-600 rounded-md p-4 text-center">
            <p className="text-white text-sm">Active Users</p>
            <p className="text-2xl font-bold text-white mt-2">{stats?.users.active || 0}</p>
          </div>
          
          <div className="bg-yellow-600 rounded-md p-4 text-center">
            <p className="text-white text-sm">Admin Users</p>
            <p className="text-2xl font-bold text-white mt-2">{stats?.users.admin || 0}</p>
          </div>
          
          <div className="bg-red-600 rounded-md p-4 text-center">
            <p className="text-white text-sm">Inactive Users</p>
            <p className="text-2xl font-bold text-white mt-2">{stats?.users.inactive || 0}</p>
          </div>
        </div>
      </div>
      
      {/* Movie Stats */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Movie Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-700 rounded-md p-4 text-center">
            <p className="text-gray-400 text-sm">Total Movies</p>
            <p className="text-2xl font-bold text-white mt-2">{stats?.movies.total || 0}</p>
          </div>
          
          <div className="bg-yellow-600 rounded-md p-4 text-center">
            <p className="text-white text-sm">Popular Movies</p>
            <p className="text-2xl font-bold text-white mt-2">{stats?.movies.popular || 0}</p>
          </div>
          
          <div className="bg-purple-600 rounded-md p-4 text-center">
            <p className="text-white text-sm">Total Views</p>
            <p className="text-2xl font-bold text-white mt-2">{stats?.movies.views || 0}</p>
          </div>
          
          <div className="bg-blue-600 rounded-md p-4 text-center">
            <p className="text-white text-sm">Total Downloads</p>
            <p className="text-2xl font-bold text-white mt-2">{stats?.movies.downloads || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;