'use client';

import { Section } from './Section';
import { CalcResults } from './CalcResults';
import { RangeSlider } from '@/components/ui';
import type { AntennaParams } from '@/types/antenna';
import type { RFCalculationResult } from '@/lib/rf';

interface RFParametersSectionProps {
  params: AntennaParams;
  rfCalculations: RFCalculationResult;
  onParamChange: <K extends keyof AntennaParams>(key: K, value: AntennaParams[K]) => void;
}

export function RFParametersSection({ params, rfCalculations, onParamChange }: RFParametersSectionProps) {
  return (
    <Section title="RF Parameters">
      <RangeSlider
        label="Target Frequency"
        value={params.frequency}
        min={14000}
        max={14350}
        step={10}
        unit="MHz"
        formatValue={(v) => `${(v / 1000).toFixed(3)} MHz`}
        onChange={(v) => onParamChange('frequency', v)}
      />
      <RangeSlider
        label="Whip Length"
        value={params.whipLength}
        min={1.5}
        max={3.0}
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
      />
    </Section>
  );
}

