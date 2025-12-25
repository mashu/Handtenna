/**
 * Nut specifications (dimensions in mm)
 */
export const NUT_SPECS = {
  m10: { acrossFlats: 17, thickness: 8, bore: 10.5 },
  m8: { acrossFlats: 13, thickness: 6.5, bore: 8.5 },
} as const;

/**
 * Connector specifications (dimensions in mm)
 */
export const CONNECTOR_SPECS = {
  bnc: { holeDiameter: 9.5, flatWidth: 16, flatDepth: 3 },
  sma: { holeDiameter: 6.5, flatWidth: 12, flatDepth: 2 },
  banana: { holeDiameter: 4.2 },
  binding: { holeDiameter: 8 },
} as const;

export type NutType = keyof typeof NUT_SPECS;
export type RadioConnectorType = 'bnc' | 'sma';
export type CounterpoiseConnectorType = 'banana' | 'binding';

