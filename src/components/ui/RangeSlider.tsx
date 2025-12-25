'use client';

import styles from './RangeSlider.module.css';

interface RangeSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  formatValue?: (value: number) => string;
  onChange: (value: number) => void;
}

export function RangeSlider({
  label,
  value,
  min,
  max,
  step,
  unit,
  formatValue,
  onChange,
}: RangeSliderProps) {
  const displayValue = formatValue ? formatValue(value) : `${value} ${unit}`;

  return (
    <div className={styles.paramGroup}>
      <div className={styles.paramLabel}>
        <span>{label}</span>
        <span className={styles.paramValue}>{displayValue}</span>
      </div>
      <input
        type="range"
        className={styles.slider}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

