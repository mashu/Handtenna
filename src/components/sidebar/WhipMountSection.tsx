'use client';

import { Section } from './Section';
import { RangeSlider, Select } from '@/components/ui';
import type { AntennaParams } from '@/types/antenna';
import type { NutType } from '@/lib/constants';

interface WhipMountSectionProps {
  params: AntennaParams;
  onParamChange: <K extends keyof AntennaParams>(key: K, value: AntennaParams[K]) => void;
}

const THREAD_TYPE_OPTIONS = [
  { value: 'm10', label: 'M10 Hex Nut' },
  { value: 'm8', label: 'M8 Hex Nut' },
];

export function WhipMountSection({ params, onParamChange }: WhipMountSectionProps) {
  return (
    <Section title="Whip Mount">
      <Select
        label="Nut Size"
        value={params.threadType}
        options={THREAD_TYPE_OPTIONS}
        onChange={(v) => onParamChange('threadType', v as NutType)}
      />
      <RangeSlider
        label="Post Height"
        value={params.postHeight}
        min={12}
        max={25}
        step={1}
        unit="mm"
        formatValue={(v) => `${v} mm`}
        onChange={(v) => onParamChange('postHeight', v)}
      />
    </Section>
  );
}

