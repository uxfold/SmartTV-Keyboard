'use client';

import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import { Movie } from '@/types';
import MovieCard from './MovieCard';

interface MovieGridProps {
  movies: Movie[];
  onMovieSelect?: (movie: Movie) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function MovieGrid({ movies, onMovieSelect, isLoading, emptyMessage = 'No movies found' }: MovieGridProps) {
  const { ref, focusKey } = useFocusable({
    focusable: false,
    saveLastFocusedChild: true,
    trackChildren: true,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-gray-400 text-lg">Searching...</p>
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-xl">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <FocusContext.Provider value={focusKey}>
      <div
        ref={ref}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4"
      >
        {movies.map((movie) => (
          <MovieCard
            key={movie.imdbID}
            movie={movie}
            onSelect={onMovieSelect}
            size="medium"
          />
        ))}
      </div>
    </FocusContext.Provider>
  );
}

export default MovieGrid;
