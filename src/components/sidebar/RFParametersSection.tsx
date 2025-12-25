'use client';

import { useCallback } from 'react';
import { Section } from './Section';
import { CalcResults } from './CalcResults';
import { RangeSlider, Select } from '@/components/ui';
import { BANDS, BAND_OPTIONS, type BandName } from '@/lib/bands';
import type { AntennaParams } from '@/types/antenna';
import { estimateInductanceFromTurns, type RFCalculationResult } from '@/lib/rf';
import styles from './RFParametersSection.module.css';

interface RFParametersSectionProps {
  params: AntennaParams;
  rfCalculations: RFCalculationResult;
  onParamChange: <K extends keyof AntennaParams>(key: K, value: AntennaParams[K]) => void;
}

export function RFParametersSection({ params, rfCalculations, onParamChange }: RFParametersSectionProps) {
  const currentBand = BANDS[params.band];
  const whipLengthCm = Math.round(params.whipLength * 100);
  const turnsToWind = Math.max(0, Math.round(params.turnsToWind));
  const effectiveTurns = turnsToWind > 0 ? turnsToWind : rfCalculations.turnsNeeded;
  const inductanceAtTurns = estimateInductanceFromTurns(effectiveTurns, params.coilDiameter, params.coilHeight);
  const inductanceError = inductanceAtTurns - rfCalculations.inductance;

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
        value={whipLengthCm}
        min={12}
        max={600}
        step={1}
        unit="cm"
        formatValue={(v) => `${(v / 100).toFixed(2)} m (${v} cm)`}
        onChange={(v) => onParamChange('whipLength', v / 100)}
      />
      <input
        className={styles.inlineNumber}
        type="number"
        min={12}
        max={600}
        step={1}
        value={whipLengthCm}
        onChange={(e) => onParamChange('whipLength', Number(e.target.value) / 100)}
      />
      <div className={styles.helperText}>
        This is the physical whip length. RF values update immediately; the 3D model rebuild is debounced to avoid lag.
      </div>
      <RangeSlider
        label="Turns to wind (0 = auto)"
        value={turnsToWind}
        min={0}
        max={150}
        step={1}
        unit="turns"
        formatValue={(v) => (v === 0 ? 'Auto' : `${v} turns`)}
        onChange={(v) => onParamChange('turnsToWind', Math.round(v))}
      />
      <div className={styles.helperText}>
        Inductance at {effectiveTurns} turns (Wheeler): <strong>{inductanceAtTurns.toFixed(2)} µH</strong>
        {' '}({inductanceError >= 0 ? '+' : ''}{inductanceError.toFixed(2)} µH vs required).
      </div>
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

