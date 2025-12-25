'use client';

import { Section } from './Section';
import { RangeSlider, Select } from '@/components/ui';
import type { AntennaParams } from '@/types/antenna';
import type { RadioConnectorType, CounterpoiseConnectorType } from '@/lib/constants';

interface BaseSectionProps {
  params: AntennaParams;
  onParamChange: <K extends keyof AntennaParams>(key: K, value: AntennaParams[K]) => void;
}

const RADIO_CONNECTOR_OPTIONS = [
  { value: 'bnc', label: 'BNC (9.5mm)' },
  { value: 'sma', label: 'SMA (6.5mm)' },
];

const COUNTERPOISE_OPTIONS = [
  { value: 'banana', label: '4mm Banana' },
  { value: 'binding', label: 'Binding Post (8mm)' },
];

export function BaseSection({ params, onParamChange }: BaseSectionProps) {
  return (
    <Section title="Base">
      <RangeSlider
        label="Base Diameter"
        value={params.baseDiameter}
        min={38}
        max={60}
        step={1}
        unit="mm"
        formatValue={(v) => `${v} mm`}
        onChange={(v) => onParamChange('baseDiameter', v)}
      />
      <RangeSlider
        label="Base Height"
        value={params.baseHeight}
        min={22}
        max={45}
        step={1}
        unit="mm"
        formatValue={(v) => `${v} mm`}
        onChange={(v) => onParamChange('baseHeight', v)}
      />
      <Select
        label="Radio Connector"
        value={params.radioConnector}
        options={RADIO_CONNECTOR_OPTIONS}
        onChange={(v) => onParamChange('radioConnector', v as RadioConnectorType)}
      />
      <Select
        label="Counterpoise"
        value={params.counterpoiseConnector}
        options={COUNTERPOISE_OPTIONS}
        onChange={(v) => onParamChange('counterpoiseConnector', v as CounterpoiseConnectorType)}
      />
    </Section>
  );
}

