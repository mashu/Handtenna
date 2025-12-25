'use client';

import styles from './Sidebar.module.css';
import {
  RFParametersSection,
  CoilFormerSection,
  BaseSection,
  WhipMountSection,
  WireChannelSection,
  ActionsSection,
} from './index';
import type { AntennaParams } from '@/types/antenna';
import type { RFCalculationResult } from '@/lib/rf';

interface SidebarProps {
  params: AntennaParams;
  rfCalculations: RFCalculationResult;
  onParamChange: <K extends keyof AntennaParams>(key: K, value: AntennaParams[K]) => void;
  onExportSTL: () => void;
  onExportParams: () => void;
  onReset: () => void;
}

export function Sidebar({
  params,
  rfCalculations,
  onParamChange,
  onExportSTL,
  onExportParams,
  onReset,
}: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <header className={styles.header}>
        <h1 className={styles.title}>PEDESTRIAN ANTENNA BASE</h1>
        <p className={styles.subtitle}>Complete Design - No Drilling Required</p>
      </header>

      <RFParametersSection params={params} rfCalculations={rfCalculations} onParamChange={onParamChange} />
      <CoilFormerSection params={params} onParamChange={onParamChange} />
      <BaseSection params={params} onParamChange={onParamChange} />
      <WhipMountSection params={params} onParamChange={onParamChange} />
      <WireChannelSection params={params} onParamChange={onParamChange} />
      <ActionsSection onExportSTL={onExportSTL} onExportParams={onExportParams} onReset={onReset} />
    </aside>
  );
}

