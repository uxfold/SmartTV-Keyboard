'use client';

import { useRef, useEffect } from 'react';
import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import { Movie } from '@/types';
import MovieCard from './MovieCard';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onMovieSelect?: (movie: Movie) => void;
  isLoading?: boolean;
}

export function MovieRow({ title, movies, onMovieSelect, isLoading }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { ref, focusKey, hasFocusedChild } = useFocusable({
    focusable: false,
    saveLastFocusedChild: true,
    trackChildren: true,
    onFocus: () => {
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    },
  });

  // Scroll to focused child
  useEffect(() => {
    if (hasFocusedChild && scrollRef.current) {
      const focusedElement = scrollRef.current.querySelector('[data-focused="true"]');
      if (focusedElement) {
        focusedElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [hasFocusedChild]);

  if (isLoading) {
    return (
      <div className="mb-8" ref={scrollRef}>
        <h2 className="text-2xl font-bold text-white mb-4 px-12">{title}</h2>
        <div className="flex gap-4 px-12 overflow-x-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="w-[200px] h-[300px] bg-gray-800 rounded-lg animate-pulse flex-shrink-0"
            />
          ))}
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return null;
  }

  return (
    <div className="mb-8" ref={scrollRef}>
      <h2 className="text-2xl font-bold text-white mb-4 px-12">{title}</h2>
      <FocusContext.Provider value={focusKey}>
        <div
          ref={ref}
          className="flex gap-4 px-12 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
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
    </div>
  );
}

export default MovieRow;
