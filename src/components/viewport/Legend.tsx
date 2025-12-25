'use client';

import styles from './Legend.module.css';

const LEGEND_ITEMS = [
  { color: '#60a5fa', label: 'Wire holes' },
  { color: '#4ade80', label: 'Side connector' },
  { color: '#22d3ee', label: 'Bottom BNC (radio)' },
  { color: '#fbbf24', label: 'Counterpoise' },
  { color: '#f472b6', label: 'Nut bore' },
];

export function Legend() {
  return (
    <div className={styles.legend}>
      <div className={styles.title}>Hole Markers</div>
      {LEGEND_ITEMS.map((item) => (
        <div key={item.label} className={styles.item}>
          <span
            className={styles.marker}
            style={{ backgroundColor: item.color }}
          />
          <span className={styles.label}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

