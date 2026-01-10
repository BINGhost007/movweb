import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';

interface Movie {
  _id: string;
  title: string;
  posterUrl: string;
  year: number;
  rating: number;
  quality: string;
  isPopular: boolean;
}

const HomePage = () => {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        
        // Fetch popular movies
        const popularResponse = await api.get('/movies/popular');
        setPopularMovies(popularResponse.data.data);
        
        // Fetch all movies with pagination
        const allResponse = await api.get('/movies', {
          params: {
            page: currentPage,
            limit: 12,
            search: searchTerm
          }
        });
        
        setAllMovies(allResponse.data.data);
        setTotalPages(allResponse.data.pagination.totalPages);
        
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to load movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovies();
  }, [currentPage, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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

  return (
    <div className="space-y-12">
      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Popular Movies Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Popular Movies</h2>
        
        {popularMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {popularMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No popular movies available</p>
        )}
      </section>

      {/* All Movies Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white">All Movies</h2>
        
        {allMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {allMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No movies found</p>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {page}
                </button>
              ))}
            </nav>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;