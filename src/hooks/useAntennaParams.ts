'use client';

import { useState, useCallback, useMemo } from 'react';
import type { AntennaParams, ModelDimensions } from '@/types/antenna';
import { DEFAULT_PARAMS } from '@/types/antenna';
import { calculateRF, type RFCalculationResult } from '@/lib/rf';

export function useAntennaParams() {
  const [params, setParams] = useState<AntennaParams>(DEFAULT_PARAMS);

  const updateParam = useCallback(<K extends keyof AntennaParams>(key: K, value: AntennaParams[K]) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setParams(DEFAULT_PARAMS);
  }, []);

  const rfCalculations = useMemo<RFCalculationResult>(() => {
    return calculateRF(
      params.frequency,
      params.whipLength,
      params.coilDiameter,
      params.coilHeight,
      params.groovePitch
    );
  }, [params.frequency, params.whipLength, params.coilDiameter, params.coilHeight, params.groovePitch]);

  const dimensions = useMemo<ModelDimensions>(() => {
    return {
      totalHeight: params.baseHeight + params.coilHeight + params.postHeight,
      maxDiameter: params.baseDiameter,
    };
  }, [params.baseHeight, params.coilHeight, params.postHeight, params.baseDiameter]);

  return {
    params,
    updateParam,
    resetToDefaults,
    rfCalculations,
    dimensions,
  };
}

