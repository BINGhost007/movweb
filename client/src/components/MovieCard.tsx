export type MovieCardMovie = {
  title: string;
  year: number;
  quality: string;
  rating?: number;
  imdbRating?: number;
};

interface MovieCardProps {
  movie: MovieCardMovie;
  showDescription?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const displayRating = movie.rating ?? movie.imdbRating;

  const initials = movie.title
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  return (
    <article className="movie-card">
      <div className="movie-card__poster" aria-hidden="true">
        <span className="movie-card__initials">{initials || 'MV'}</span>
      </div>

      <h3 className="movie-card__title">{movie.title}</h3>

      <dl className="movie-card__meta">
        <div className="movie-card__meta-row">
          <dt className="sr-only">Year</dt>
          <dd>{movie.year}</dd>
        </div>

        <div className="movie-card__meta-row">
          <dt className="sr-only">Rating</dt>
          <dd>{typeof displayRating === 'number' ? displayRating.toFixed(1) : '—'}</dd>
        </div>

        <div className="movie-card__meta-row">
          <dt className="sr-only">Quality</dt>
          <dd>
            <span className="badge">{movie.quality}</span>
          </dd>
        </div>
      </dl>
    </article>
  );
};

export default MovieCard;
