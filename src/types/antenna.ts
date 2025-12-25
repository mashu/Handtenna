import type { NutType, RadioConnectorType, CounterpoiseConnectorType } from '@/lib/constants';

export interface AntennaParams {
  // RF Parameters
  frequency: number; // kHz
  whipLength: number; // meters

  // Coil Former
  coilDiameter: number; // mm
  coilHeight: number; // mm
  showGrooves: boolean;
  groovePitch: number; // mm

  // Base
  baseDiameter: number; // mm
  baseHeight: number; // mm
  radioConnector: RadioConnectorType;
  counterpoiseConnector: CounterpoiseConnectorType;

  // Whip Mount
  threadType: NutType;
  postHeight: number; // mm

  // Wire Channel
  wireHoleDiameter: number; // mm
}

export const DEFAULT_PARAMS: AntennaParams = {
  frequency: 14200,
  whipLength: 2.5,
  coilDiameter: 25,
  coilHeight: 60,
  showGrooves: true,
  groovePitch: 1.5,
  baseDiameter: 44,
  baseHeight: 30,
  radioConnector: 'bnc',
  counterpoiseConnector: 'banana',
  threadType: 'm10',
  postHeight: 16,
  wireHoleDiameter: 3.5,
};

export interface ModelDimensions {
  totalHeight: number;
  maxDiameter: number;
}

