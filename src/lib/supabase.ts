// Supabase client scaffolding
// Full implementation pending - this sets up the structure

import { Favorite, Device } from '@/types';

// Supabase configuration - to be used when @supabase/supabase-js is installed
// SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || ''
// SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_WJlZnGdbTHSh9t_63LrRtQ_18-pxjYz'

// Placeholder for Supabase client
// TODO: Install @supabase/supabase-js and initialize client
// import { createClient } from '@supabase/supabase-js';
// export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Device ID management for anonymous users
export function getDeviceId(): string {
  if (typeof window === 'undefined') return '';

  const DEVICE_ID_KEY = 'smart_tv_device_id';
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);

  if (!deviceId) {
    // Generate a unique device ID
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }

  return deviceId;
}

// Database schema for favorites table
/*
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL,
  movie_id TEXT NOT NULL,
  movie_title TEXT NOT NULL,
  movie_poster TEXT,
  movie_year TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(device_id, movie_id)
);

CREATE INDEX idx_favorites_device_id ON favorites(device_id);
CREATE INDEX idx_favorites_movie_id ON favorites(movie_id);
*/

// CRUD functions - scaffolding for future implementation
export async function getFavorites(deviceId: string): Promise<Favorite[]> {
  // TODO: Implement with Supabase
  // const { data, error } = await supabase
  //   .from('favorites')
  //   .select('*')
  //   .eq('device_id', deviceId)
  //   .order('created_at', { ascending: false });

  console.log('getFavorites called for device:', deviceId);
  return [];
}

export async function addFavorite(favorite: Omit<Favorite, 'id' | 'created_at'>): Promise<Favorite | null> {
  // TODO: Implement with Supabase
  // const { data, error } = await supabase
  //   .from('favorites')
  //   .insert([favorite])
  //   .select()
  //   .single();

  console.log('addFavorite called:', favorite);
  return null;
}

export async function removeFavorite(deviceId: string, movieId: string): Promise<boolean> {
  // TODO: Implement with Supabase
  // const { error } = await supabase
  //   .from('favorites')
  //   .delete()
  //   .eq('device_id', deviceId)
  //   .eq('movie_id', movieId);

  console.log('removeFavorite called:', deviceId, movieId);
  return true;
}

export async function isFavorite(deviceId: string, movieId: string): Promise<boolean> {
  // TODO: Implement with Supabase
  // const { data, error } = await supabase
  //   .from('favorites')
  //   .select('id')
  //   .eq('device_id', deviceId)
  //   .eq('movie_id', movieId)
  //   .single();

  console.log('isFavorite called:', deviceId, movieId);
  return false;
}

export async function toggleFavorite(
  deviceId: string,
  movie: { id: string; title: string; poster: string; year: string }
): Promise<boolean> {
  const isFav = await isFavorite(deviceId, movie.id);

  if (isFav) {
    await removeFavorite(deviceId, movie.id);
    return false;
  } else {
    await addFavorite({
      device_id: deviceId,
      movie_id: movie.id,
      movie_title: movie.title,
      movie_poster: movie.poster,
      movie_year: movie.year,
    });
    return true;
  }
}

// Device registration
export async function registerDevice(deviceId: string): Promise<Device | null> {
  // TODO: Implement with Supabase
  // const { data, error } = await supabase
  //   .from('devices')
  //   .upsert([{ id: deviceId, last_seen_at: new Date().toISOString() }])
  //   .select()
  //   .single();

  console.log('registerDevice called:', deviceId);
  return { id: deviceId };
}
