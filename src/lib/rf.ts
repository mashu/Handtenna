const SPEED_OF_LIGHT = 299792458; // m/s

export interface RFCalculationResult {
  quarterWavelength: number; // meters
  inductance: number; // µH
  turnsNeeded: number;
  maxTurns: number;
}

/**
 * Calculate RF parameters for the antenna
 */
export function calculateRF(
  frequencyKHz: number,
  whipLengthM: number,
  coilDiameterMM: number,
  coilHeightMM: number,
  groovePitchMM: number
): RFCalculationResult {
  const frequencyMHz = frequencyKHz / 1000;
  const coilDiameterM = coilDiameterMM / 1000;
  const coilHeightM = coilHeightMM / 1000;
  const pitchM = groovePitchMM / 1000;

  // Calculate wavelength and quarter wavelength
  const wavelength = SPEED_OF_LIGHT / (frequencyMHz * 1e6);
  const quarterWavelength = wavelength / 4;

  // Calculate required reactance and inductance
  const reactance = 50 * Math.tan((2 * Math.PI * (quarterWavelength - whipLengthM)) / wavelength);
  const inductance = (reactance / (2 * Math.PI * frequencyMHz * 1e6)) * 1e6; // Convert to µH

  // Calculate turns needed using Wheeler's formula
  // L = (r² × n²) / (9r + 10l) where r is radius in inches, l is length in inches
  const radiusInches = (coilDiameterM / 2) * 39.37;
  const maxTurns = Math.floor(coilHeightM / pitchM);
  const lengthInches = maxTurns * pitchM * 39.37;

  // Solve for n: n = sqrt(L × (9r + 10l) / r²)
  const turnsNeeded = Math.round(Math.sqrt((inductance * (9 * radiusInches + 10 * lengthInches)) / (radiusInches * radiusInches)));

  return {
    quarterWavelength,
    inductance,
    turnsNeeded,
    maxTurns,
  };
}

