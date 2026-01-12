type Movie = {
  id: string;
  title: string;
  year: number;
  rating: number;
  quality: string;
};

const MOCK_MOVIES: Movie[] = [
  { id: '1', title: 'The Shawshank Redemption', year: 1994, rating: 9.3, quality: 'HD' },
  { id: '2', title: 'The Godfather', year: 1972, rating: 9.2, quality: 'HD' },
  { id: '3', title: 'The Dark Knight', year: 2008, rating: 9.0, quality: '4K' },
  { id: '4', title: 'Pulp Fiction', year: 1994, rating: 8.9, quality: 'HD' },
  { id: '5', title: 'Forrest Gump', year: 1994, rating: 8.8, quality: 'HD' },
  { id: '6', title: 'Inception', year: 2010, rating: 8.8, quality: '4K' },
  { id: '7', title: 'The Matrix', year: 1999, rating: 8.7, quality: 'HD' },
  { id: '8', title: 'Goodfellas', year: 1990, rating: 8.7, quality: 'HD' },
  { id: '9', title: 'Interstellar', year: 2014, rating: 8.6, quality: '4K' },
  { id: '10', title: 'Spirited Away', year: 2001, rating: 8.6, quality: 'HD' },
  { id: '11', title: 'Parasite', year: 2019, rating: 8.5, quality: '4K' },
  { id: '12', title: 'The Prestige', year: 2006, rating: 8.5, quality: 'HD' }
];

const HomePage = () => {
  return (
    <div className="bg-slate-50 text-slate-900 rounded-lg border border-slate-200 p-6 md:p-8">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Movies</h1>
        <p className="text-slate-600">
          Showing {MOCK_MOVIES.length} sample movies (mock data). No API calls.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {MOCK_MOVIES.map((movie) => (
          <div
            key={movie.id}
            className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-semibold leading-snug">{movie.title}</h2>
              <span className="shrink-0 inline-flex items-center rounded-full bg-slate-900 text-white px-2 py-0.5 text-xs font-medium">
                {movie.quality}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm text-slate-700">
              <span>{movie.year}</span>
              <span className="font-medium">Rating: {movie.rating.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
