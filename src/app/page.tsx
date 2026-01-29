'use client';

import { useState, useEffect } from 'react';
import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import { SpatialNavigationProvider } from '@/lib/spatialNavigation';
import { Movie } from '@/types';
import { searchMovies } from '@/lib/omdb';
import HeroBanner from '@/components/layout/HeroBanner';
import Navbar from '@/components/layout/Navbar';
import MovieRow from '@/components/movie/MovieRow';

interface CategoryData {
  title: string;
  query: string;
  movies: Movie[];
  isLoading: boolean;
}

export default function HomePage() {
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);
  const [categories, setCategories] = useState<CategoryData[]>([
    { title: 'Trending Now', query: 'avengers', movies: [], isLoading: true },
    { title: 'Action Movies', query: 'action', movies: [], isLoading: true },
    { title: 'Comedy', query: 'comedy', movies: [], isLoading: true },
    { title: 'Sci-Fi Adventures', query: 'star wars', movies: [], isLoading: true },
    { title: 'Classic Films', query: 'godfather', movies: [], isLoading: true },
    { title: 'Animation', query: 'pixar', movies: [], isLoading: true },
  ]);

  const { ref, focusKey } = useFocusable({
    focusable: false,
    saveLastFocusedChild: true,
    trackChildren: true,
  });

  useEffect(() => {
    async function loadCategories() {
      const updatedCategories = await Promise.all(
        categories.map(async (category) => {
          try {
            const response = await searchMovies(category.query);
            return {
              ...category,
              movies: response.Search || [],
              isLoading: false,
            };
          } catch {
            return { ...category, isLoading: false };
          }
        })
      );

      setCategories(updatedCategories);

      // Set hero movie from first category
      if (updatedCategories[0]?.movies.length > 0) {
        setHeroMovie(updatedCategories[0].movies[0]);
      }
    }

    loadCategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMovieSelect = (movie: Movie) => {
    setHeroMovie(movie);
    console.log('Selected movie:', movie.Title);
  };

  return (
    <SpatialNavigationProvider>
      <FocusContext.Provider value={focusKey}>
        <main ref={ref} className="min-h-screen bg-black">
          <Navbar />

          {/* Hero Banner */}
          <HeroBanner
            movie={heroMovie}
            onPlay={() => console.log('Play:', heroMovie?.Title)}
            onMoreInfo={() => console.log('More info:', heroMovie?.Title)}
          />

          {/* Movie Categories */}
          <div className="relative -mt-16 z-10 pb-12">
            {categories.map((category) => (
              <MovieRow
                key={category.title}
                title={category.title}
                movies={category.movies}
                onMovieSelect={handleMovieSelect}
                isLoading={category.isLoading}
              />
            ))}
          </div>
        </main>
      </FocusContext.Provider>
    </SpatialNavigationProvider>
  );
}
