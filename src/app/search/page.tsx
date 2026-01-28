'use client';

import { useState, useCallback } from 'react';
import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import { SpatialNavigationProvider } from '@/lib/spatialNavigation';
import { Movie } from '@/types';
import { useMovieSearch } from '@/hooks/useMovieSearch';
import PredictiveKeyboard from '@/components/keyboard/PredictiveKeyboard';
import MovieGrid from '@/components/movie/MovieGrid';
import Navbar from '@/components/layout/Navbar';

export default function SearchPage() {
  const [searchText, setSearchText] = useState('');
  const { movies, isLoading, error, totalResults } = useMovieSearch(searchText, 500);

  const { ref, focusKey } = useFocusable({
    focusable: false,
    saveLastFocusedChild: true,
    trackChildren: true,
  });

  const handleTextChange = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  const handleMovieSelect = useCallback((movie: Movie) => {
    console.log('Selected movie:', movie);
  }, []);

  return (
    <SpatialNavigationProvider>
      <FocusContext.Provider value={focusKey}>
        <main ref={ref} className="min-h-screen bg-black pt-24">
          <Navbar />

          <div className="flex h-[calc(100vh-96px)]">
            {/* Left side - Keyboard */}
            <div className="w-[450px] flex-shrink-0 border-r border-gray-800 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Search Movies</h2>
              <PredictiveKeyboard onTextChange={handleTextChange} />

              {/* Search info */}
              <div className="mt-6 text-gray-400">
                {isLoading && (
                  <p className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
                    Searching...
                  </p>
                )}
                {!isLoading && totalResults > 0 && (
                  <p>Found {totalResults} results</p>
                )}
                {error && (
                  <p className="text-red-400">{error}</p>
                )}
              </div>
            </div>

            {/* Right side - Results */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {searchText ? `Results for "${searchText}"` : 'Start typing to search'}
                </h2>

                <MovieGrid
                  movies={movies}
                  onMovieSelect={handleMovieSelect}
                  isLoading={isLoading}
                  emptyMessage={searchText ? 'No movies found' : 'Use the keyboard to search for movies'}
                />
              </div>
            </div>
          </div>
        </main>
      </FocusContext.Provider>
    </SpatialNavigationProvider>
  );
}
