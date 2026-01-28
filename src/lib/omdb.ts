import { Movie, MovieSearchResponse, MovieDetails } from '@/types';

const API_KEY = '74a114b5';
const BASE_URL = 'https://www.omdbapi.com';

export async function searchMovies(query: string, page: number = 1): Promise<MovieSearchResponse> {
  if (!query.trim()) {
    return { Response: 'False', Error: 'Empty query' };
  }

  try {
    const response = await fetch(
      `${BASE_URL}/?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}&type=movie`
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data: MovieSearchResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching movies:', error);
    return { Response: 'False', Error: 'Failed to fetch movies' };
  }
}

export async function getMovieDetails(imdbId: string): Promise<MovieDetails | null> {
  try {
    const response = await fetch(
      `${BASE_URL}/?apikey=${API_KEY}&i=${imdbId}&plot=full`
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    if (data.Response === 'False') {
      return null;
    }

    return data as MovieDetails;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
}

export async function getPopularMovies(): Promise<Movie[]> {
  // OMDB doesn't have a popular movies endpoint, so we search for common terms
  const searches = ['marvel', 'star wars', 'batman', 'disney', 'pixar'];
  const results: Movie[] = [];

  for (const term of searches) {
    const response = await searchMovies(term);
    if (response.Search) {
      results.push(...response.Search.slice(0, 4));
    }
  }

  // Remove duplicates based on imdbID
  const unique = results.filter((movie, index, self) =>
    index === self.findIndex(m => m.imdbID === movie.imdbID)
  );

  return unique;
}

export async function getMoviesByCategory(category: string): Promise<Movie[]> {
  const response = await searchMovies(category);
  return response.Search || [];
}
