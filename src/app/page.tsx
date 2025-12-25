'use client';

import { useState, useCallback, useRef } from 'react';
import * as THREE from 'three';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { Viewport } from '@/components/viewport';
import { useAntennaParams } from '@/hooks/useAntennaParams';
import { downloadSTL } from '@/lib/stl-exporter';
import { calculateRF } from '@/lib/rf';
import styles from './page.module.css';

export default function Home() {
  const { params, updateParam, resetToDefaults, rfCalculations, dimensions } = useAntennaParams();
  const [status, setStatus] = useState('Building...');
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);

  const handleGeometryReady = useCallback((geometry: THREE.BufferGeometry) => {
    geometryRef.current = geometry;
    setStatus('Ready');
  }, []);

  const handleExportSTL = useCallback(() => {
    if (!geometryRef.current) {
      alert('No model available for export');
      return;
    }

    setStatus('Exporting...');
    try {
      downloadSTL(geometryRef.current, 'antenna_base_20m.stl');
      setStatus('Exported!');
      setTimeout(() => setStatus('Ready'), 2000);
    } catch (error) {
      console.error('Export error:', error);
      setStatus('Export failed');
    }
  }, []);

  const handleExportParams = useCallback(() => {
    const rf = calculateRF(
      params.frequency,
      params.whipLength,
      params.coilDiameter,
      params.coilHeight,
      params.groovePitch
    );

    const data = {
      rf: {
        freq_mhz: params.frequency / 1000,
        whip_m: params.whipLength,
        inductance_uH: rf.inductance.toFixed(1),
        turns: rf.turnsNeeded,
      },
      dims: {
        base_d: params.baseDiameter,
        base_h: params.baseHeight,
        coil_d: params.coilDiameter,
        coil_h: params.coilHeight,
        post_h: params.postHeight,
        total_h: dimensions.totalHeight,
      },
      holes: {
        radio_connector: params.radioConnector,
        counterpoise: params.counterpoiseConnector,
        wire: params.wireHoleDiameter,
        nut_type: params.threadType,
      },
      wiring: {
        top_hole: 'Radial hole 5mm from coil top - wire exits here, goes up through vertical channel to nut bore',
        bottom_hole: 'Radial hole 5mm from coil bottom - wire exits here, goes down through vertical channel',
        base_channel: 'Horizontal channel connects to solder access area at back',
      },
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'antenna_params.json';
    link.click();
    URL.revokeObjectURL(url);
  }, [params, dimensions]);

  return (
    <div className={styles.container}>
      <Sidebar
        params={params}
        rfCalculations={rfCalculations}
        onParamChange={updateParam}
        onExportSTL={handleExportSTL}
        onExportParams={handleExportParams}
        onReset={resetToDefaults}
      />
      <Viewport
        params={params}
        dimensions={dimensions}
        status={status}
        onGeometryReady={handleGeometryReady}
      />
    </div>
  );
}

