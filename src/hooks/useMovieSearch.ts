'use client';

import { useState, useEffect } from 'react';
import { Movie } from '@/types';
import { searchMovies } from '@/lib/omdb';
import { useDebounce } from './useDebounce';

interface UseMovieSearchResult {
  movies: Movie[];
  isLoading: boolean;
  error: string | null;
  totalResults: number;
}

export function useMovieSearch(query: string, debounceMs: number = 500): UseMovieSearchResult {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);

  const debouncedQuery = useDebounce(query, debounceMs);

  useEffect(() => {
    async function fetchMovies() {
      if (!debouncedQuery.trim()) {
        setMovies([]);
        setTotalResults(0);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await searchMovies(debouncedQuery);

        if (response.Response === 'True' && response.Search) {
          setMovies(response.Search);
          setTotalResults(parseInt(response.totalResults || '0', 10));
        } else {
          setMovies([]);
          setTotalResults(0);
          if (response.Error && response.Error !== 'Movie not found!') {
            setError(response.Error);
          }
        }
      } catch {
        setError('Failed to search movies');
        setMovies([]);
        setTotalResults(0);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMovies();
  }, [debouncedQuery]);

  return { movies, isLoading, error, totalResults };
}
