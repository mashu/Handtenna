'use client';

import { useCallback } from 'react';
import { Section } from './Section';
import { CalcResults } from './CalcResults';
import { RangeSlider, Select } from '@/components/ui';
import { BANDS, BAND_OPTIONS, type BandName } from '@/lib/bands';
import type { AntennaParams } from '@/types/antenna';
import type { RFCalculationResult } from '@/lib/rf';

interface RFParametersSectionProps {
  params: AntennaParams;
  rfCalculations: RFCalculationResult;
  onParamChange: <K extends keyof AntennaParams>(key: K, value: AntennaParams[K]) => void;
}

export function RFParametersSection({ params, rfCalculations, onParamChange }: RFParametersSectionProps) {
  const currentBand = BANDS[params.band];

  const handleBandChange = useCallback((newBand: string) => {
    const band = BANDS[newBand as BandName];
    if (band) {
      onParamChange('band', newBand as BandName);
      onParamChange('frequency', band.defaultFreq);
    }
  }, [onParamChange]);

  return (
    <Section title="RF Parameters">
      <Select
        label="Band"
        value={params.band}
        options={BAND_OPTIONS}
        onChange={handleBandChange}
      />
      <RangeSlider
        label="Target Frequency"
        value={params.frequency}
        min={currentBand.minFreq}
        max={currentBand.maxFreq}
        step={10}
        unit="MHz"
        formatValue={(v) => `${(v / 1000).toFixed(3)} MHz`}
        onChange={(v) => onParamChange('frequency', v)}
      />
      <RangeSlider
        label="Whip Length"
        value={params.whipLength}
        min={0.5}
        max={5.0}
        step={0.1}
        unit="m"
        formatValue={(v) => `${v.toFixed(2)} m`}
        onChange={(v) => onParamChange('whipLength', v)}
      />
      <CalcResults
        quarterWavelength={rfCalculations.quarterWavelength}
        inductance={rfCalculations.inductance}
        turnsNeeded={rfCalculations.turnsNeeded}
        maxTurns={rfCalculations.maxTurns}
        isWhipTooLong={rfCalculations.isWhipTooLong}
      />
    </Section>
  );
}

