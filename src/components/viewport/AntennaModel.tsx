'use client';

import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { buildAntennaModelWithProgress, getBuildParams } from '@/lib/model-builder';
import type { AntennaParams } from '@/types/antenna';

interface AntennaModelProps {
  params: AntennaParams;
  onBuildStart?: () => void;
  onBuildProgress?: (progress: number) => void;
  onBuildComplete?: (geometry: THREE.BufferGeometry) => void;
}

export function AntennaModel({ params, onBuildStart, onBuildProgress, onBuildComplete }: AntennaModelProps) {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const buildIdRef = useRef(0);

  useEffect(() => {
    const currentBuildId = ++buildIdRef.current;

    const buildModel = async () => {
      onBuildStart?.();
      onBuildProgress?.(0);

      try {
        const buildParams = getBuildParams(params);

        // Use async build with progress reporting
        const geo = await buildAntennaModelWithProgress(buildParams, (progress) => {
          // Only update if this is still the current build
          if (currentBuildId === buildIdRef.current) {
            onBuildProgress?.(progress);
          }
        });

        // Only set geometry if this is still the current build
        if (currentBuildId === buildIdRef.current) {
          setGeometry(geo);
          onBuildComplete?.(geo);
        }
      } catch (error) {
        console.error('Error building model:', error);
        if (currentBuildId === buildIdRef.current) {
          setGeometry(new THREE.BufferGeometry());
          onBuildComplete?.(new THREE.BufferGeometry());
        }
      }
    };

    buildModel();
  }, [params, onBuildStart, onBuildProgress, onBuildComplete]);

  // Wire hole markers
  const coilBottom = params.baseHeight;
  const coilTop = coilBottom + params.coilHeight;
  const coilRadius = params.coilDiameter / 2;
  const wireTopY = coilTop - 5;
  const wireBotY = coilBottom + 5;

  if (!geometry) {
    return null;
  }

  return (
    <group>
      {/* Main antenna model */}
      <mesh geometry={geometry}>
        <meshPhongMaterial
          color={0x606060}
          specular={0x333333}
          shininess={30}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Wire hole markers */}
      <mesh position={[coilRadius + 1, wireTopY, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[params.wireHoleDiameter / 2 + 0.5, 0.4, 8, 16]} />
        <meshBasicMaterial color={0x60a5fa} />
      </mesh>

      <mesh position={[coilRadius + 1, wireBotY, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[params.wireHoleDiameter / 2 + 0.5, 0.4, 8, 16]} />
        <meshBasicMaterial color={0x60a5fa} />
      </mesh>
    </group>
  );
}

