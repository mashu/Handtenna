'use client';

import styles from './ViewportOverlay.module.css';
import type { ModelDimensions } from '@/types/antenna';

interface ViewportOverlayProps {
  dimensions: ModelDimensions;
  status: string;
}

export function ViewportOverlay({ dimensions, status }: ViewportOverlayProps) {
  return (
    <>
      <div className={styles.status}>{status}</div>

      <div className={styles.overlay}>
        <div className={styles.row}>
          <span className={styles.label}>Total Height</span>
          <span className={styles.value}>{dimensions.totalHeight} mm</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Max Diameter</span>
          <span className={styles.value}>{dimensions.maxDiameter} mm</span>
        </div>
      </div>

      <div className={styles.hint}>Drag to rotate • Scroll to zoom</div>
    </>
  );
}

