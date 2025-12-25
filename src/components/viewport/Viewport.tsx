'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import styles from './Viewport.module.css';
import { ViewportOverlay } from './ViewportOverlay';
import type { AntennaParams, ModelDimensions } from '@/types/antenna';
import type * as THREE from 'three';

// Dynamically import the Scene to avoid SSR issues with Three.js
const Scene = dynamic(() => import('./Scene').then((mod) => mod.Scene), {
  ssr: false,
  loading: () => (
    <div className={styles.loading}>
      <span>Loading 3D viewer...</span>
    </div>
  ),
});

interface ViewportProps {
  params: AntennaParams;
  dimensions: ModelDimensions;
  status: string;
  onGeometryReady?: (geometry: THREE.BufferGeometry) => void;
}

export function Viewport({ params, dimensions, status, onGeometryReady }: ViewportProps) {
  const [isBuilding, setIsBuilding] = useState(true);
  const [buildProgress, setBuildProgress] = useState(0);

  const handleBuildStart = useCallback(() => {
    setIsBuilding(true);
    setBuildProgress(0);
  }, []);

  const handleBuildProgress = useCallback((progress: number) => {
    setBuildProgress(progress);
  }, []);

  const handleBuildComplete = useCallback((geometry: THREE.BufferGeometry) => {
    setIsBuilding(false);
    setBuildProgress(100);
    onGeometryReady?.(geometry);
  }, [onGeometryReady]);

  return (
    <main className={styles.viewport}>
      <div className={styles.canvasContainer}>
        <Scene
          params={params}
          onBuildStart={handleBuildStart}
          onBuildProgress={handleBuildProgress}
          onBuildComplete={handleBuildComplete}
        />
      </div>

      {isBuilding && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner} />
          <div className={styles.loadingText}>Building model...</div>
          <div className={styles.progressContainer}>
            <div
              className={styles.progressBar}
              style={{ width: `${buildProgress}%` }}
            />
          </div>
        </div>
      )}

      <ViewportOverlay dimensions={dimensions} status={status} />
    </main>
  );
}

