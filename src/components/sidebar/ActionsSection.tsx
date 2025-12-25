'use client';

import { Section } from './Section';
import { Button } from '@/components/ui';
import styles from './ActionsSection.module.css';

interface ActionsSectionProps {
  onExportSTL: () => void;
  onExportParams: () => void;
  onReset: () => void;
}

export function ActionsSection({ onExportSTL, onExportParams, onReset }: ActionsSectionProps) {
  return (
    <Section title="Actions">
      <div className={styles.grid2}>
        <Button variant="primary" onClick={onExportSTL}>
          Export STL
        </Button>
        <Button variant="secondary" onClick={onExportParams}>
          Save Params
        </Button>
      </div>
      <Button variant="secondary" onClick={onReset}>
        Reset Defaults
      </Button>
    </Section>
  );
}

