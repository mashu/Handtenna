/**
 * Amateur radio band definitions
 */
export interface BandDefinition {
  name: string;
  label: string;
  minFreq: number; // kHz
  maxFreq: number; // kHz
  defaultFreq: number; // kHz
}

export const BANDS: Record<string, BandDefinition> = {
  '10m': {
    name: '10m',
    label: '10m (28 MHz)',
    minFreq: 28000,
    maxFreq: 29700,
    defaultFreq: 28500,
  },
  '12m': {
    name: '12m',
    label: '12m (24 MHz)',
    minFreq: 24890,
    maxFreq: 24990,
    defaultFreq: 24940,
  },
  '15m': {
    name: '15m',
    label: '15m (21 MHz)',
    minFreq: 21000,
    maxFreq: 21450,
    defaultFreq: 21200,
  },
  '17m': {
    name: '17m',
    label: '17m (18 MHz)',
    minFreq: 18068,
    maxFreq: 18168,
    defaultFreq: 18100,
  },
  '20m': {
    name: '20m',
    label: '20m (14 MHz)',
    minFreq: 14000,
    maxFreq: 14350,
    defaultFreq: 14200,
  },
  '40m': {
    name: '40m',
    label: '40m (7 MHz)',
    minFreq: 7000,
    maxFreq: 7300,
    defaultFreq: 7100,
  },
};

export type BandName = keyof typeof BANDS;

export const BAND_OPTIONS = Object.entries(BANDS).map(([key, band]) => ({
  value: key,
  label: band.label,
}));

