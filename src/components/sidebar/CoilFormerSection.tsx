'use client';

import { Section } from './Section';
import { RangeSlider, Checkbox } from '@/components/ui';
import type { AntennaParams } from '@/types/antenna';

interface CoilFormerSectionProps {
  params: AntennaParams;
  onParamChange: <K extends keyof AntennaParams>(key: K, value: AntennaParams[K]) => void;
}

export function CoilFormerSection({ params, onParamChange }: CoilFormerSectionProps) {
  return (
    <Section title="Coil Former">
      <RangeSlider
        label="Coil Diameter"
        value={params.coilDiameter}
        min={18}
        max={40}
        step={1}
        unit="mm"
        formatValue={(v) => `${v} mm`}
        onChange={(v) => onParamChange('coilDiameter', v)}
      />
      <RangeSlider
        label="Coil Height"
        value={params.coilHeight}
        min={30}
        max={100}
        step={5}
        unit="mm"
        formatValue={(v) => `${v} mm`}
        onChange={(v) => onParamChange('coilHeight', v)}
      />
      <Checkbox
        label="Winding grooves"
        checked={params.showGrooves}
        onChange={(v) => onParamChange('showGrooves', v)}
      />
      <RangeSlider
        label="Groove Pitch"
        value={params.groovePitch}
        min={1.0}
        max={3.0}
        step={0.1}
        unit="mm"
        formatValue={(v) => `${v.toFixed(1)} mm`}
        onChange={(v) => onParamChange('groovePitch', v)}
      />
    </Section>
  );
}

