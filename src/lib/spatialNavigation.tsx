'use client';

import { init, setKeyMap } from '@noriginmedia/norigin-spatial-navigation';
import { useEffect, useState } from 'react';

// Custom key map for TV remotes and gamepads
const TV_KEY_MAP = {
  left: [37, 'ArrowLeft'],
  up: [38, 'ArrowUp'],
  right: [39, 'ArrowRight'],
  down: [40, 'ArrowDown'],
  enter: [13, 'Enter', ' '],
};

export function initSpatialNavigation() {
  init({
    debug: false,
    visualDebug: false,
    distanceCalculationMethod: 'center',
  });
  setKeyMap(TV_KEY_MAP);
}

export function SpatialNavigationProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initSpatialNavigation();
    setIsInitialized(true);
  }, []);

  if (!isInitialized) {
    return null;
  }

  return <>{children}</>;
}
