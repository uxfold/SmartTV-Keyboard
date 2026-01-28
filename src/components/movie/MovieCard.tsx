'use client';

import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import Image from 'next/image';
import { Movie } from '@/types';

interface MovieCardProps {
  movie: Movie;
  onSelect?: (movie: Movie) => void;
  size?: 'small' | 'medium' | 'large';
}

const sizeClasses = {
  small: 'w-[150px] h-[225px]',
  medium: 'w-[200px] h-[300px]',
  large: 'w-[250px] h-[375px]',
};

export function MovieCard({ movie, onSelect, size = 'medium' }: MovieCardProps) {
  const { ref, focused } = useFocusable({
    onEnterPress: () => onSelect?.(movie),
  });

  const posterUrl = movie.Poster !== 'N/A'
    ? movie.Poster
    : '/placeholder-poster.png';

  return (
    <div
      ref={ref}
      onClick={() => onSelect?.(movie)}
      className={`
        relative rounded-lg overflow-hidden cursor-pointer
        transition-all duration-200 flex-shrink-0
        ${sizeClasses[size]}
        ${focused
          ? 'scale-110 z-10 ring-4 ring-white shadow-2xl shadow-white/20'
          : 'hover:scale-105'
        }
      `}
    >
      <div className="absolute inset-0 bg-gray-800">
        {posterUrl !== '/placeholder-poster.png' ? (
          <Image
            src={posterUrl}
            alt={movie.Title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 150px, 200px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-700">
            <span className="text-gray-400 text-center p-4">{movie.Title}</span>
          </div>
        )}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {/* Title and year */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className={`font-bold text-white line-clamp-2 ${size === 'small' ? 'text-sm' : 'text-base'}`}>
          {movie.Title}
        </h3>
        <p className="text-gray-300 text-sm">{movie.Year}</p>
      </div>

      {/* Focus indicator */}
      {focused && (
        <div className="absolute inset-0 ring-4 ring-white rounded-lg pointer-events-none" />
      )}
    </div>
  );
}

export default MovieCard;
