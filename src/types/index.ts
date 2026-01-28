// Movie types from OMDB API
export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
}

export interface MovieSearchResponse {
  Search?: Movie[];
  totalResults?: string;
  Response: string;
  Error?: string;
}

export interface MovieDetails extends Movie {
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Ratings: { Source: string; Value: string }[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
}

// Keyboard types
export interface KeyConfig {
  key: string;
  chars: string;
  label: string;
  type: 'letter' | 'special' | 'action';
}

// Favorites (Supabase)
export interface Favorite {
  id?: string;
  device_id: string;
  movie_id: string;
  movie_title: string;
  movie_poster: string;
  movie_year: string;
  created_at?: string;
}

// Device
export interface Device {
  id: string;
  created_at?: string;
  last_seen_at?: string;
}
