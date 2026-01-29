'use client';

import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import Image from 'next/image';
import { Movie } from '@/types';

interface HeroBannerProps {
  movie: Movie | null;
  onPlay?: () => void;
  onMoreInfo?: () => void;
}

export function HeroBanner({ movie, onPlay, onMoreInfo }: HeroBannerProps) {
  const { ref: playRef, focused: playFocused } = useFocusable({
    onEnterPress: onPlay,
  });

  const { ref: infoRef, focused: infoFocused } = useFocusable({
    onEnterPress: onMoreInfo,
  });

  if (!movie) {
    return (
      <div className="relative w-full h-[600px] bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : null;

  return (
    <div className="relative w-full h-[420px] overflow-hidden">
      {/* Background Image */}
      {posterUrl && (
        <div className="absolute inset-0">
          <Image
            src={posterUrl}
            alt={movie.Title}
            fill
            className="object-cover object-top blur-sm scale-110"
            priority
          />
        </div>
      )}

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/50" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="px-12 max-w-xl">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
            {movie.Title}
          </h1>
          <p className="text-base text-gray-300 mb-1">
            {movie.Year} • {movie.Type}
          </p>
          <p className="text-sm text-gray-400 mb-5 line-clamp-2">
            Discover this amazing title and explore more content in our library.
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              ref={playRef}
              onClick={onPlay}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-md
                text-base font-semibold transition-all duration-200
                ${playFocused
                  ? 'bg-white text-black scale-105'
                  : 'bg-white/90 text-black hover:bg-white'
                }
              `}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Play
            </button>

            <button
              ref={infoRef}
              onClick={onMoreInfo}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-md
                text-base font-semibold transition-all duration-200
                ${infoFocused
                  ? 'bg-gray-300 text-black scale-105'
                  : 'bg-gray-500/70 text-white hover:bg-gray-500'
                }
              `}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
              More Info
            </button>
          </div>
        </div>
      </div>

      {/* Poster on right side - smaller */}
      {posterUrl && (
        <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:block">
          <div className="w-[180px] h-[270px] rounded-lg overflow-hidden shadow-2xl ring-2 ring-white/20">
            <Image
              src={posterUrl}
              alt={movie.Title}
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default HeroBanner;
