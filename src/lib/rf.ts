const SPEED_OF_LIGHT = 299792458; // m/s

export interface RFCalculationResult {
  quarterWavelength: number; // meters
  inductance: number; // µH
  turnsNeeded: number;
  maxTurns: number;
  isWhipTooLong: boolean;
}

/**
 * Calculate RF parameters for the antenna
 * Uses standard formulas for mobile antenna loading coil design
 */
export function calculateRF(
  frequencyKHz: number,
  whipLengthM: number,
  coilDiameterMM: number,
  coilHeightMM: number,
  groovePitchMM: number
): RFCalculationResult {
  const frequencyMHz = frequencyKHz / 1000;
  const frequencyHz = frequencyKHz * 1000;
  const coilDiameterM = coilDiameterMM / 1000;
  const coilHeightM = coilHeightMM / 1000;
  const pitchM = groovePitchMM / 1000;

  // Calculate wavelength and quarter wavelength
  const wavelength = SPEED_OF_LIGHT / frequencyHz;
  const quarterWavelength = wavelength / 4;

  // Check if whip is already long enough (no loading needed)
  const isWhipTooLong = whipLengthM >= quarterWavelength;

  // Calculate required reactance and inductance
  // For a short vertical, we need inductive loading to make it appear electrically longer
  // Xa = 50 × tan(2π × (λ/4 - L_physical) / λ)
  let inductance = 0;
  let reactance = 0;
  
  if (!isWhipTooLong && whipLengthM > 0) {
    const electricalLengthDeficit = quarterWavelength - whipLengthM;
    const phaseAngle = (2 * Math.PI * electricalLengthDeficit) / wavelength;
    
    // Limit phase angle to avoid infinity at 90°
    const limitedPhaseAngle = Math.min(phaseAngle, Math.PI / 2 - 0.01);
    reactance = 50 * Math.tan(limitedPhaseAngle);
    
    // L = Xa / (2πf) converted to µH
    inductance = (reactance / (2 * Math.PI * frequencyHz)) * 1e6;
  }

  // Ensure inductance is positive
  inductance = Math.max(0, inductance);

  // Calculate max turns that fit in coil height
  const maxTurns = Math.floor(coilHeightM / pitchM);

  // Calculate turns needed using Wheeler's formula for single-layer coil
  // L (µH) = (r² × n²) / (9r + 10l) where r is radius in inches, l is coil length in inches
  // Solving for n: n = sqrt(L × (9r + 10l) / r²)
  const radiusInches = (coilDiameterM / 2) * 39.37;
  const coilLengthInches = coilHeightM * 39.37;

  let turnsNeeded = 0;
  if (inductance > 0 && radiusInches > 0) {
    const wheelersConstant = (9 * radiusInches + 10 * coilLengthInches);
    const turnsSquared = (inductance * wheelersConstant) / (radiusInches * radiusInches);
    turnsNeeded = Math.round(Math.sqrt(Math.max(0, turnsSquared)));
  }

  return {
    quarterWavelength,
    inductance,
    turnsNeeded,
    maxTurns,
    isWhipTooLong,
  };
}

