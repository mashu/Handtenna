'use client';

import styles from './CalcResults.module.css';

interface CalcRowProps {
  label: string;
  value: string;
  variant?: 'info' | 'good' | 'warning';
}

function CalcRow({ label, value, variant = 'info' }: CalcRowProps) {
  return (
    <div className={styles.calcRow}>
      <span className={styles.calcLabel}>{label}</span>
      <span className={`${styles.calcValue} ${styles[variant]}`}>{value}</span>
    </div>
  );
}

interface CalcResultsProps {
  quarterWavelength: number;
  inductance: number;
  turnsNeeded: number;
  maxTurns: number;
}

export function CalcResults({ quarterWavelength, inductance, turnsNeeded, maxTurns }: CalcResultsProps) {
  const turnsVariant = turnsNeeded > maxTurns ? 'warning' : 'good';

  return (
    <div className={styles.calcResults}>
      <CalcRow label="Quarter wavelength" value={`${quarterWavelength.toFixed(2)} m`} variant="info" />
      <CalcRow label="Required inductance" value={`${inductance.toFixed(1)} µH`} variant="good" />
      <CalcRow
        label="Coil turns needed"
        value={`${turnsNeeded} turns`}
        variant={turnsVariant}
      />
    </div>
  );
}

