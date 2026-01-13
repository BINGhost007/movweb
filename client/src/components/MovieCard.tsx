interface MovieCardProps {
  movie: {
    id: string;
    title: string;
    year: number;
    rating: number;
    genre: string;
    quality: string;
  };
}

const POSTER_GRADIENTS = [
  'from-indigo-500 to-violet-500',
  'from-emerald-500 to-teal-500',
  'from-rose-500 to-orange-500',
  'from-sky-500 to-blue-600',
  'from-fuchsia-500 to-purple-600',
  'from-amber-500 to-yellow-500',
  'from-cyan-500 to-sky-500',
  'from-lime-500 to-emerald-500',
];

const MovieCard = ({ movie }: MovieCardProps) => {
  const index = (Number.parseInt(movie.id, 10) || 0) % POSTER_GRADIENTS.length;
  const gradient = POSTER_GRADIENTS[index];

  const initials = movie.title
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className={`aspect-[2/3] w-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <span className="text-white/90 text-4xl font-extrabold tracking-tight">{initials}</span>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold leading-snug text-slate-900 line-clamp-2 group-hover:text-slate-950">
          {movie.title}
        </h3>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
            {movie.year}
          </span>
          <span className="inline-flex items-center rounded-full bg-violet-100 px-2.5 py-1 text-xs font-medium text-violet-800">
            {movie.genre}
          </span>
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800">
            {movie.quality}
          </span>
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800">
            ★ {movie.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </article>
  );
};

export default MovieCard;
