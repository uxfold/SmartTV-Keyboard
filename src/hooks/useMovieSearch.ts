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
      const trimmedQuery = debouncedQuery.trim();

      // OMDB requires at least 3 characters to search
      if (!trimmedQuery || trimmedQuery.length < 3) {
        setMovies([]);
        setTotalResults(0);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await searchMovies(trimmedQuery);

        if (response.Response === 'True' && response.Search) {
          setMovies(response.Search);
          setTotalResults(parseInt(response.totalResults || '0', 10));
        } else {
          setMovies([]);
          setTotalResults(0);
          // Don't show "Too many results" as an error
          if (response.Error && response.Error !== 'Movie not found!' && response.Error !== 'Too many results.') {
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
