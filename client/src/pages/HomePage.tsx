import { useState, useMemo } from 'react';
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

// Mock data to demonstrate UI structure
const MOCK_MOVIES: Movie[] = [
  {
    _id: '1',
    title: 'The Shawshank Redemption',
    posterUrl: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=The+Shawshank+Redemption',
    year: 1994,
    rating: 9.3,
    quality: 'HD',
    isPopular: true
  },
  {
    _id: '2',
    title: 'The Godfather',
    posterUrl: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=The+Godfather',
    year: 1972,
    rating: 9.2,
    quality: 'HD',
    isPopular: true
  },
  {
    _id: '3',
    title: 'The Dark Knight',
    posterUrl: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=The+Dark+Knight',
    year: 2008,
    rating: 9.0,
    quality: '4K',
    isPopular: true
  },
  {
    _id: '4',
    title: 'Pulp Fiction',
    posterUrl: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Pulp+Fiction',
    year: 1994,
    rating: 8.9,
    quality: 'HD',
    isPopular: true
  },
  {
    _id: '5',
    title: 'Forrest Gump',
    posterUrl: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Forrest+Gump',
    year: 1994,
    rating: 8.8,
    quality: 'HD',
    isPopular: true
  },
  {
    _id: '6',
    title: 'Inception',
    posterUrl: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Inception',
    year: 2010,
    rating: 8.8,
    quality: '4K',
    isPopular: true
  },
  {
    _id: '7',
    title: 'The Matrix',
    posterUrl: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=The+Matrix',
    year: 1999,
    rating: 8.7,
    quality: 'HD',
    isPopular: false
  },
  {
    _id: '8',
    title: 'Goodfellas',
    posterUrl: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Goodfellas',
    year: 1990,
    rating: 8.7,
    quality: 'HD',
    isPopular: false
  },
  {
    _id: '9',
    title: 'The Silence of the Lambs',
    posterUrl: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Silence+of+the+Lambs',
    year: 1991,
    rating: 8.6,
    quality: 'HD',
    isPopular: false
  },
  {
    _id: '10',
    title: 'Interstellar',
    posterUrl: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Interstellar',
    year: 2014,
    rating: 8.6,
    quality: '4K',
    isPopular: false
  },
  {
    _id: '11',
    title: 'The Green Mile',
    posterUrl: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=The+Green+Mile',
    year: 1999,
    rating: 8.6,
    quality: 'HD',
    isPopular: false
  },
  {
    _id: '12',
    title: 'Parasite',
    posterUrl: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Parasite',
    year: 2019,
    rating: 8.5,
    quality: '4K',
    isPopular: false
  },
  {
    _id: '13',
    title: 'The Prestige',
    posterUrl: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=The+Prestige',
    year: 2006,
    rating: 8.5,
    quality: 'HD',
    isPopular: false
  },
  {
    _id: '14',
    title: 'The Departed',
    posterUrl: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=The+Departed',
    year: 2006,
    rating: 8.5,
    quality: 'HD',
    isPopular: false
  },
  {
    _id: '15',
    title: 'Gladiator',
    posterUrl: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Gladiator',
    year: 2000,
    rating: 8.5,
    quality: 'HD',
    isPopular: false
  },
  {
    _id: '16',
    title: 'The Lion King',
    posterUrl: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=The+Lion+King',
    year: 1994,
    rating: 8.5,
    quality: 'HD',
    isPopular: false
  },
  {
    _id: '17',
    title: 'Saving Private Ryan',
    posterUrl: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Saving+Private+Ryan',
    year: 1998,
    rating: 8.6,
    quality: '4K',
    isPopular: false
  },
  {
    _id: '18',
    title: 'The Usual Suspects',
    posterUrl: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=The+Usual+Suspects',
    year: 1995,
    rating: 8.5,
    quality: 'HD',
    isPopular: false
  }
];

const ITEMS_PER_PAGE = 12;

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter movies based on search term
  const filteredMovies = useMemo(() => {
    if (!searchTerm) {
      return MOCK_MOVIES;
    }
    return MOCK_MOVIES.filter(movie =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Get popular movies
  const popularMovies = useMemo(() => {
    return MOCK_MOVIES.filter(movie => movie.isPopular);
  }, []);

  // Paginate filtered movies
  const paginatedMovies = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredMovies.slice(startIndex, endIndex);
  }, [filteredMovies, currentPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredMovies.length / ITEMS_PER_PAGE);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-12">
      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Popular Movies Section */}
      {!searchTerm && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Popular Movies</h2>
          
          {popularMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {popularMovies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No popular movies available. Add movies through the admin panel.</p>
          )}
        </section>
      )}

      {/* All Movies Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white">
          {searchTerm ? `Search Results for "${searchTerm}"` : 'All Movies'}
        </h2>
        
        {paginatedMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {paginatedMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">
            {searchTerm 
              ? `No movies found matching "${searchTerm}"`
              : 'No movies available. Add movies through the admin panel.'}
          </p>
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