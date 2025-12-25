'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { buildAntennaModelWithProgress, getBuildParams, type ModelInputParams } from '@/lib/model-builder';
import { NUT_SPECS, CONNECTOR_SPECS } from '@/lib/constants';
import type { AntennaParams } from '@/types/antenna';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

// Marker colors
const COLORS = {
  wireHole: 0x60a5fa,      // Blue - wire holes
  radioConnector: 0x4ade80, // Green - side BNC/SMA connector
  bottomBnc: 0x22d3ee,      // Cyan - bottom BNC (radio mount)
  counterpoise: 0xfbbf24,   // Yellow - counterpoise
  nutBore: 0xf472b6,        // Pink - nut bore
};

interface AntennaModelProps {
  params: AntennaParams;
  onBuildStart?: () => void;
  onBuildProgress?: (progress: number) => void;
  onBuildComplete?: (geometry: THREE.BufferGeometry) => void;
}

export function AntennaModel({ params, onBuildStart, onBuildProgress, onBuildComplete }: AntennaModelProps) {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const buildIdRef = useRef(0);

  // Only these params affect the 3D model. (RF params like band/frequency/whip length should not trigger rebuilds.)
  const modelInputParams = useMemo<ModelInputParams>(
    () => ({
      coilDiameter: params.coilDiameter,
      coilHeight: params.coilHeight,
      showGrooves: params.showGrooves,
      groovePitch: params.groovePitch,
      wireHoleDiameter: params.wireHoleDiameter,
      baseDiameter: params.baseDiameter,
      baseHeight: params.baseHeight,
      postHeight: params.postHeight,
      threadType: params.threadType,
      radioConnector: params.radioConnector,
      counterpoiseConnector: params.counterpoiseConnector,
    }),
    [
      params.coilDiameter,
      params.coilHeight,
      params.showGrooves,
      params.groovePitch,
      params.wireHoleDiameter,
      params.baseDiameter,
      params.baseHeight,
      params.postHeight,
      params.threadType,
      params.radioConnector,
      params.counterpoiseConnector,
    ]
  );

  // Debounce rebuilds to avoid lag while dragging sliders.
  const debouncedModelParams = useDebouncedValue(modelInputParams, 250);

  useEffect(() => {
    const currentBuildId = ++buildIdRef.current;

    const buildModel = async () => {
      onBuildStart?.();
      onBuildProgress?.(0);

      try {
        const buildParams = getBuildParams(debouncedModelParams);

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
  }, [debouncedModelParams, onBuildStart, onBuildProgress, onBuildComplete]);

  // Calculate marker positions
  const baseRadius = debouncedModelParams.baseDiameter / 2;
  const coilBottom = debouncedModelParams.baseHeight;
  const coilTop = coilBottom + debouncedModelParams.coilHeight;
  const coilRadius = debouncedModelParams.coilDiameter / 2;
  const wireTopY = coilTop - 5;
  const wireBotY = coilBottom + 5;
  const baseMiddleY = debouncedModelParams.baseHeight / 2;
  const postTop = coilTop + debouncedModelParams.postHeight;

  // Get connector specs
  const radioConnector = CONNECTOR_SPECS[debouncedModelParams.radioConnector];
  const counterpoiseConnector = CONNECTOR_SPECS[debouncedModelParams.counterpoiseConnector];
  const nut = NUT_SPECS[debouncedModelParams.threadType];

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

      {/* Top wire hole marker (blue) */}
      <mesh position={[coilRadius + 1, wireTopY, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[debouncedModelParams.wireHoleDiameter / 2 + 0.5, 0.4, 8, 16]} />
        <meshBasicMaterial color={COLORS.wireHole} />
      </mesh>

      {/* Bottom wire hole marker (blue) */}
      <mesh position={[coilRadius + 1, wireBotY, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[debouncedModelParams.wireHoleDiameter / 2 + 0.5, 0.4, 8, 16]} />
        <meshBasicMaterial color={COLORS.wireHole} />
      </mesh>

      {/* Radio connector hole marker (green) - on +Z side, vertical orientation */}
      <mesh position={[0, baseMiddleY, baseRadius + 1]}>
        <torusGeometry args={[radioConnector.holeDiameter / 2 + 0.5, 0.5, 8, 16]} />
        <meshBasicMaterial color={COLORS.radioConnector} />
      </mesh>

      {/* Counterpoise hole marker (yellow) - on +X side */}
      <mesh position={[baseRadius + 1, baseMiddleY, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[counterpoiseConnector.holeDiameter / 2 + 0.5, 0.4, 8, 16]} />
        <meshBasicMaterial color={COLORS.counterpoise} />
      </mesh>

      {/* Counterpoise hole marker (yellow) - on -X side */}
      <mesh position={[-baseRadius - 1, baseMiddleY, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[counterpoiseConnector.holeDiameter / 2 + 0.5, 0.4, 8, 16]} />
        <meshBasicMaterial color={COLORS.counterpoise} />
      </mesh>

      {/* Nut bore marker (pink) - at top */}
      <mesh position={[0, postTop + 1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[nut.bore / 2 + 0.5, 0.5, 8, 16]} />
        <meshBasicMaterial color={COLORS.nutBore} />
      </mesh>

      {/* Bottom BNC hole marker (cyan) - for mounting on radio */}
      <mesh position={[0, -1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radioConnector.holeDiameter / 2 + 0.5, 0.5, 8, 16]} />
        <meshBasicMaterial color={COLORS.bottomBnc} />
      </mesh>
    </group>
  );
}

// Export colors for legend
export { COLORS as MARKER_COLORS };

