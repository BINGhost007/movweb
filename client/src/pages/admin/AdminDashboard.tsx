import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ChartBarIcon, FilmIcon, UsersIcon, TagIcon, CogIcon } from '@heroicons/react/24/outline';

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
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/stats');
        setStats(response.data.data);
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
      <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
      
      {/* Quick Stats */}
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
      
      {/* Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link 
          to="/admin/movies"
          className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 shadow-lg transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">Manage Movies</p>
              <p className="text-gray-400 text-sm mt-1">Add, edit, or delete movies</p>
            </div>
            <FilmIcon className="h-8 w-8 text-blue-400" />
          </div>
        </Link>
        
        <Link 
          to="/admin/users"
          className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 shadow-lg transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">Manage Users</p>
              <p className="text-gray-400 text-sm mt-1">View and manage user accounts</p>
            </div>
            <UsersIcon className="h-8 w-8 text-green-400" />
          </div>
        </Link>
        
        <Link 
          to="/admin/categories"
          className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 shadow-lg transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">Manage Categories</p>
              <p className="text-gray-400 text-sm mt-1">Add, edit, or delete categories</p>
            </div>
            <TagIcon className="h-8 w-8 text-yellow-400" />
          </div>
        </Link>
        
        <Link 
          to="/admin/stats"
          className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 shadow-lg transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">View Statistics</p>
              <p className="text-gray-400 text-sm mt-1">Detailed platform analytics</p>
            </div>
            <CogIcon className="h-8 w-8 text-purple-400" />
          </div>
        </Link>
      </div>
      
      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Movie Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Movies</span>
              <span className="text-white font-medium">{stats?.movies.total || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Popular Movies</span>
              <span className="text-white font-medium">{stats?.movies.popular || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Views</span>
              <span className="text-white font-medium">{stats?.movies.views || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Downloads</span>
              <span className="text-white font-medium">{stats?.movies.downloads || 0}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">User Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Users</span>
              <span className="text-white font-medium">{stats?.users.total || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Active Users</span>
              <span className="text-white font-medium">{stats?.users.active || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Admin Users</span>
              <span className="text-white font-medium">{stats?.users.admin || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Inactive Users</span>
              <span className="text-white font-medium">{stats?.users.inactive || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;