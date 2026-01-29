'use client';

import { useState, useCallback, useEffect } from 'react';
import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import { SpatialNavigationProvider } from '@/lib/spatialNavigation';
import { Movie } from '@/types';
import { useMovieSearch } from '@/hooks/useMovieSearch';
import { searchMovies } from '@/lib/omdb';
import PredictiveKeyboard from '@/components/keyboard/PredictiveKeyboard';
import MovieGrid from '@/components/movie/MovieGrid';
import Navbar from '@/components/layout/Navbar';

// Prediction chip component for movie title suggestions
function SuggestionChip({
  title,
  onSelect
}: {
  title: string;
  onSelect: () => void;
}) {
  const { ref, focused } = useFocusable({
    onEnterPress: onSelect,
  });

  return (
    <button
      ref={ref}
      onClick={onSelect}
      className={`
        px-3 py-1 text-sm rounded transition-all whitespace-nowrap
        ${focused
          ? 'bg-white text-black'
          : 'text-gray-300 hover:text-white'
        }
      `}
    >
      {title}
    </button>
  );
}

export default function SearchPage() {
  const [searchText, setSearchText] = useState('');
  const [movieSuggestions, setMovieSuggestions] = useState<string[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [isLoadingRecommended, setIsLoadingRecommended] = useState(true);

  const { movies, isLoading, totalResults } = useMovieSearch(searchText, 500);

  const { ref, focusKey } = useFocusable({
    focusable: false,
    saveLastFocusedChild: true,
    trackChildren: true,
    isFocusBoundary: false,
  });

  // Fetch recommended movies on mount
  useEffect(() => {
    async function fetchRecommended() {
      setIsLoadingRecommended(true);
      try {
        // Fetch popular/recommended movies from various categories
        const queries = ['marvel', 'batman', 'star wars', 'pixar', 'james bond'];
        const results: Movie[] = [];

        for (const query of queries) {
          const response = await searchMovies(query);
          if (response.Search) {
            results.push(...response.Search.slice(0, 4));
          }
        }

        // Remove duplicates and shuffle
        const unique = results.filter((movie, index, self) =>
          index === self.findIndex(m => m.imdbID === movie.imdbID)
        );

        // Shuffle the array
        const shuffled = unique.sort(() => Math.random() - 0.5);

        setRecommendedMovies(shuffled.slice(0, 20));
      } catch (error) {
        console.error('Failed to fetch recommended movies:', error);
      } finally {
        setIsLoadingRecommended(false);
      }
    }

    fetchRecommended();
  }, []);

  // Update movie suggestions when search results change
  useEffect(() => {
    if (movies.length > 0) {
      // Get unique movie titles as suggestions (limit to 5)
      const titles = movies
        .map(m => m.Title)
        .filter((title, index, self) => self.indexOf(title) === index)
        .slice(0, 5);
      setMovieSuggestions(titles);
    } else {
      setMovieSuggestions([]);
    }
  }, [movies]);

  const handleTextChange = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  const handleMovieSelect = useCallback((movie: Movie) => {
    console.log('Selected movie:', movie);
  }, []);

  // When a movie suggestion is selected from the top bar
  const handleSuggestionSelect = useCallback((title: string) => {
    setSearchText(title);
  }, []);

  // Determine which movies to show
  const trimmedSearch = searchText.trim();
  const isSearchTooShort = trimmedSearch.length > 0 && trimmedSearch.length < 3;
  const displayMovies = trimmedSearch.length >= 3 ? movies : recommendedMovies;
  const displayLoading = trimmedSearch.length >= 3 ? isLoading : isLoadingRecommended;
  const showingRecommended = trimmedSearch.length < 3;

  return (
    <SpatialNavigationProvider>
      <FocusContext.Provider value={focusKey}>
        <main ref={ref} className="min-h-screen bg-black">
          <Navbar />

          <div className="flex pt-20 h-screen">
            {/* Left side - Search title and Keyboard */}
            <div className="w-[420px] flex-shrink-0 p-6 flex flex-col">
              <h1 className="text-[28px] font-light text-white mb-6 italic">Search</h1>
              <PredictiveKeyboard
                onTextChange={handleTextChange}
              />

              {/* Loading indicator */}
              {isLoading && searchText && (
                <div className="mt-4 flex items-center gap-2 text-gray-400">
                  <span className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
                  <span>Searching...</span>
                </div>
              )}
              {!isLoading && totalResults > 0 && searchText && (
                <p className="mt-4 text-gray-400">Found {totalResults} results</p>
              )}
            </div>

            {/* Right side - Suggestions and Results */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Related movie suggestions bar - positioned above movie results */}
              <div className="px-6 py-4 flex items-center gap-2 min-h-[48px] overflow-x-auto">
                {movieSuggestions.length > 0 && trimmedSearch.length >= 3 ? (
                  <>
                    <span className="text-gray-500 text-sm flex-shrink-0">Related:</span>
                    <div className="flex items-center gap-1 overflow-x-auto">
                      {movieSuggestions.map((title, index) => (
                        <span key={title} className="flex items-center flex-shrink-0">
                          <SuggestionChip
                            title={title}
                            onSelect={() => handleSuggestionSelect(title)}
                          />
                          {index < movieSuggestions.length - 1 && (
                            <span className="text-gray-600 mx-1">|</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </>
                ) : isSearchTooShort ? (
                  <span className="text-gray-400 text-lg">Type at least 3 characters to search</span>
                ) : showingRecommended ? (
                  <span className="text-gray-400 text-lg">Recommended for you</span>
                ) : null}
              </div>

              {/* Movie Results Grid */}
              <div className="flex-1 overflow-y-auto px-2">
                <MovieGrid
                  movies={displayMovies}
                  onMovieSelect={handleMovieSelect}
                  isLoading={displayLoading}
                  emptyMessage={trimmedSearch.length >= 3 ? 'No movies found' : 'Loading recommendations...'}
                />
              </div>
            </div>
          </div>
        </main>
      </FocusContext.Provider>
    </SpatialNavigationProvider>
  );
}
