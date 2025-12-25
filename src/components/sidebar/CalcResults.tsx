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
  isWhipTooLong?: boolean;
}

export function CalcResults({ quarterWavelength, inductance, turnsNeeded, maxTurns, isWhipTooLong }: CalcResultsProps) {
  const turnsVariant = turnsNeeded > maxTurns ? 'warning' : 'good';
  const inductanceVariant = isWhipTooLong ? 'warning' : 'good';

  return (
    <div className={styles.calcResults}>
      <CalcRow label="Quarter wavelength" value={`${quarterWavelength.toFixed(2)} m`} variant="info" />
      <CalcRow 
        label="Required inductance" 
        value={isWhipTooLong ? 'N/A (whip too long)' : `${inductance.toFixed(1)} µH`} 
        variant={inductanceVariant} 
      />
      <CalcRow
        label="Coil turns needed"
        value={isWhipTooLong ? 'N/A' : `${turnsNeeded} turns`}
        variant={isWhipTooLong ? 'warning' : turnsVariant}
      />
      {turnsNeeded > maxTurns && !isWhipTooLong && (
        <div className={styles.calcWarning}>
          ⚠ Need {turnsNeeded - maxTurns} more turns than fit. Increase coil height or reduce pitch.
        </div>
      )}
      {isWhipTooLong && (
        <div className={styles.calcWarning}>
          ⚠ Whip is already ≥ λ/4. No loading coil needed.
        </div>
      )}
      <CalcRow 
        label="Max turns (at pitch)" 
        value={`${maxTurns} turns`} 
        variant="info" 
      />
    </div>
  );
}

