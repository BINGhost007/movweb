import MovieCard from '../components/MovieCard';

export type HomeMovie = {
  id: string;
  title: string;
  year: number;
  rating: number;
  genre: string;
  quality: '720p' | '1080p' | '4K';
};

const POPULAR_MOVIES: HomeMovie[] = [
  { id: '1', title: 'The Shawshank Redemption', year: 1994, rating: 9.3, genre: 'Drama', quality: '1080p' },
  { id: '2', title: 'The Godfather', year: 1972, rating: 9.2, genre: 'Crime', quality: '1080p' },
  { id: '3', title: 'The Dark Knight', year: 2008, rating: 9.0, genre: 'Action', quality: '4K' },
  { id: '4', title: 'Pulp Fiction', year: 1994, rating: 8.9, genre: 'Crime', quality: '1080p' },
  { id: '5', title: 'Forrest Gump', year: 1994, rating: 8.8, genre: 'Drama', quality: '1080p' },
  { id: '6', title: 'Inception', year: 2010, rating: 8.8, genre: 'Sci-Fi', quality: '4K' },
  { id: '7', title: 'The Matrix', year: 1999, rating: 8.7, genre: 'Sci-Fi', quality: '1080p' },
  { id: '8', title: 'Goodfellas', year: 1990, rating: 8.7, genre: 'Crime', quality: '1080p' },
  { id: '9', title: 'Interstellar', year: 2014, rating: 8.6, genre: 'Adventure', quality: '4K' },
  { id: '10', title: 'Spirited Away', year: 2001, rating: 8.6, genre: 'Animation', quality: '1080p' },
  { id: '11', title: 'Parasite', year: 2019, rating: 8.5, genre: 'Thriller', quality: '4K' },
  { id: '12', title: 'The Prestige', year: 2006, rating: 8.5, genre: 'Mystery', quality: '1080p' },
  { id: '13', title: 'Fight Club', year: 1999, rating: 8.8, genre: 'Drama', quality: '1080p' },
  { id: '14', title: 'Gladiator', year: 2000, rating: 8.5, genre: 'Action', quality: '1080p' },
  { id: '15', title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001, rating: 8.9, genre: 'Fantasy', quality: '4K' },
  { id: '16', title: 'The Silence of the Lambs', year: 1991, rating: 8.6, genre: 'Thriller', quality: '1080p' },
  { id: '17', title: 'Saving Private Ryan', year: 1998, rating: 8.6, genre: 'War', quality: '1080p' },
  { id: '18', title: 'The Green Mile', year: 1999, rating: 8.6, genre: 'Drama', quality: '1080p' },
  { id: '19', title: "Schindler's List", year: 1993, rating: 9.0, genre: 'History', quality: '1080p' },
  { id: '20', title: 'Se7en', year: 1995, rating: 8.6, genre: 'Thriller', quality: '1080p' },
];

const GENRES = Array.from(new Set(POPULAR_MOVIES.map((m) => m.genre))).sort();

const HomePage = () => {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Popular Movies</h1>
          <p className="text-slate-600">
            A simple, clean streaming homepage with <span className="font-medium">{POPULAR_MOVIES.length}</span>{' '}
            hardcoded movies. No API calls.
          </p>
        </div>

        <div id="popular" className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {POPULAR_MOVIES.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      <section id="genres" className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-semibold">Genres</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {GENRES.map((genre) => (
            <span
              key={genre}
              className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700"
            >
              {genre}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
