'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { AntennaModel } from './AntennaModel';
import type { AntennaParams } from '@/types/antenna';

interface SceneContentProps {
  params: AntennaParams;
  onBuildStart?: () => void;
  onBuildProgress?: (progress: number) => void;
  onBuildComplete?: (geometry: THREE.BufferGeometry) => void;
}

function SceneContent({ params, onBuildStart, onBuildProgress, onBuildComplete }: SceneContentProps) {
  const { camera } = useThree();

  // Set initial camera position
  useFrame(() => {
    // Camera looks at center of model
    const centerY = (params.baseHeight + params.coilHeight + params.postHeight) / 2;
    camera.lookAt(0, centerY, 0);
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[50, 100, 50]} intensity={0.6} />
      <directionalLight position={[-50, 50, -50]} intensity={0.2} color={0xff6b35} />

      {/* Grid */}
      <Grid
        position={[0, -5, 0]}
        args={[200, 200]}
        cellSize={10}
        cellThickness={0.5}
        cellColor="#2a2a2a"
        sectionSize={50}
        sectionThickness={1}
        sectionColor="#1a1a1a"
        fadeDistance={400}
        fadeStrength={1}
        followCamera={false}
      />

      {/* Antenna Model */}
      <AntennaModel
        params={params}
        onBuildStart={onBuildStart}
        onBuildProgress={onBuildProgress}
        onBuildComplete={onBuildComplete}
      />

      {/* Controls */}
      <OrbitControls
        target={[0, 50, 0]}
        enablePan={false}
        minDistance={60}
        maxDistance={400}
        maxPolarAngle={Math.PI * 0.85}
        minPolarAngle={Math.PI * 0.1}
      />
    </>
  );
}

interface SceneProps {
  params: AntennaParams;
  onBuildStart?: () => void;
  onBuildProgress?: (progress: number) => void;
  onBuildComplete?: (geometry: THREE.BufferGeometry) => void;
}

export function Scene({ params, onBuildStart, onBuildProgress, onBuildComplete }: SceneProps) {
  return (
    <Canvas
      camera={{
        fov: 45,
        near: 0.1,
        far: 1000,
        position: [100, 80, 100],
      }}
      gl={{ antialias: true }}
      style={{ background: '#050505' }}
    >
      <SceneContent
        params={params}
        onBuildStart={onBuildStart}
        onBuildProgress={onBuildProgress}
        onBuildComplete={onBuildComplete}
      />
    </Canvas>
  );
}

