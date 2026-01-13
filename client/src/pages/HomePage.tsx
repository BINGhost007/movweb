import MovieCard from '../components/MovieCard';

type HomeMovie = {
  id: string;
  title: string;
  year: number;
  rating: number;
  quality: string;
};

const sampleMovies: HomeMovie[] = [
  { id: '1', title: 'The Last Horizon', year: 2024, rating: 8.4, quality: '4K' },
  { id: '2', title: 'Midnight Protocol', year: 2023, rating: 7.9, quality: '1080p' },
  { id: '3', title: 'Atlas of Dreams', year: 2023, rating: 7.7, quality: '1080p' },
  { id: '4', title: 'Golden Circuit', year: 2024, rating: 8.0, quality: '4K' },
  { id: '5', title: 'Saffron Moon', year: 2022, rating: 7.4, quality: '1080p' },
  { id: '6', title: 'Neon Runner', year: 2020, rating: 7.6, quality: '4K' },
  { id: '7', title: 'Echoes of Autumn', year: 2019, rating: 8.1, quality: '1080p' },
  { id: '8', title: 'Crimson Harbor', year: 2021, rating: 7.2, quality: '720p' },
  { id: '9', title: 'Shadow Theater', year: 2022, rating: 7.8, quality: '1080p' },
  { id: '10', title: 'Brightwater', year: 2023, rating: 8.2, quality: '4K' },
  { id: '11', title: 'Silent Interval', year: 2017, rating: 7.3, quality: '720p' },
  { id: '12', title: 'Paper Skies', year: 2016, rating: 7.0, quality: '720p' },
  { id: '13', title: 'Frostline', year: 2015, rating: 6.9, quality: '1080p' },
  { id: '14', title: 'Wild Meridian', year: 2021, rating: 7.5, quality: '1080p' },
  { id: '15', title: 'Nova Brigade', year: 2019, rating: 7.1, quality: '1080p' },
  { id: '16', title: 'Cobalt City', year: 2018, rating: 7.0, quality: '720p' },
  { id: '17', title: 'Clockwork Garden', year: 2022, rating: 7.6, quality: '1080p' },
  { id: '18', title: 'Deepwood', year: 2021, rating: 6.7, quality: '720p' }
];

const HomePage = () => {
  return (
    <div className="home">
      <header className="home__header">
        <h1 className="home__title">Movie Library</h1>
        <p className="home__subtitle">Static demo list (no API calls). Showing {sampleMovies.length} movies.</p>
      </header>

      <section className="movie-grid" aria-label="Movies">
        {sampleMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </section>
    </div>
  );
};

export default HomePage;
