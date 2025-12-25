'use client';

import { Section } from './Section';
import { Note } from './Note';
import { RangeSlider } from '@/components/ui';
import type { AntennaParams } from '@/types/antenna';

interface WireChannelSectionProps {
  params: AntennaParams;
  onParamChange: <K extends keyof AntennaParams>(key: K, value: AntennaParams[K]) => void;
}

export function WireChannelSection({ params, onParamChange }: WireChannelSectionProps) {
  return (
    <Section title="Wire Channel">
      <RangeSlider
        label="Wire Hole Diameter"
        value={params.wireHoleDiameter}
        min={2.5}
        max={5}
        step={0.5}
        unit="mm"
        formatValue={(v) => `${v.toFixed(1)} mm`}
        onChange={(v) => onParamChange('wireHoleDiameter', v)}
      />
      <Note>
        <strong>All features pre-cut:</strong><br />
        • Top wire hole → vertical channel → nut bore<br />
        • Bottom wire hole → vertical channel → solder area<br />
        • BNC hole + mounting flat<br />
        • Counterpoise hole<br />
        • Hex nut pocket
      </Note>
    </Section>
  );
}

