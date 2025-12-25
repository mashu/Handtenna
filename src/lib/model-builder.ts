import * as THREE from 'three';
import { CSG } from './csg';
import { createCylinder, createCylinderBetween, createBox, createHexPrism } from './geometry';
import { NUT_SPECS, CONNECTOR_SPECS } from './constants';
import type { AntennaParams } from '@/types/antenna';

export interface BuildParams {
  coilDiameter: number;
  coilHeight: number;
  showGrooves: boolean;
  groovePitch: number;
  wireHoleDiameter: number;
  baseDiameter: number;
  baseHeight: number;
  postHeight: number;
  nutAcrossFlats: number;
  nutThickness: number;
  nutBore: number;
  radioHoleDiameter: number;
  radioFlatWidth: number;
  radioFlatDepth: number;
  counterpoiseHoleDiameter: number;
}

export function getBuildParams(params: AntennaParams): BuildParams {
  const nut = NUT_SPECS[params.threadType];
  const radioConnector = CONNECTOR_SPECS[params.radioConnector];
  const counterpoiseConnector = CONNECTOR_SPECS[params.counterpoiseConnector];

  return {
    coilDiameter: params.coilDiameter,
    coilHeight: params.coilHeight,
    showGrooves: params.showGrooves,
    groovePitch: params.groovePitch,
    wireHoleDiameter: params.wireHoleDiameter,
    baseDiameter: params.baseDiameter,
    baseHeight: params.baseHeight,
    postHeight: params.postHeight,
    nutAcrossFlats: nut.acrossFlats + 0.5,
    nutThickness: nut.thickness + 0.5,
    nutBore: nut.bore,
    radioHoleDiameter: radioConnector.holeDiameter,
    radioFlatWidth: 'flatWidth' in radioConnector ? radioConnector.flatWidth : 14,
    radioFlatDepth: 'flatDepth' in radioConnector ? radioConnector.flatDepth : 2.5,
    counterpoiseHoleDiameter: counterpoiseConnector.holeDiameter,
  };
}

// Helper to yield to the main thread and allow UI updates
const yieldToMain = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

export function buildAntennaModel(params: BuildParams): CSG {
  const baseRadius = params.baseDiameter / 2;
  const coilRadius = params.coilDiameter / 2;
  const postRadius = params.nutAcrossFlats / 2 + 4;
  const coilBottom = params.baseHeight;
  const coilTop = coilBottom + params.coilHeight;
  const postTop = coilTop + params.postHeight;

  // Wire path positions
  const wireRadius = params.wireHoleDiameter / 2;
  const wireTopY = coilTop - 5;
  const wireBotY = coilBottom + 5;

  // 1. BASE CYLINDER
  let csg = CSG.fromGeometry(createCylinder(baseRadius, params.baseHeight, 48));

  // 2. SOLID COIL FORMER
  const coilPoints: THREE.Vector2[] = [];
  coilPoints.push(new THREE.Vector2(0.01, 0));

  if (params.showGrooves) {
    const grooveDepth = 0.8;
    const numGrooves = Math.floor(params.coilHeight / params.groovePitch);

    for (let i = 0; i < numGrooves; i++) {
      const y = i * params.groovePitch;
      coilPoints.push(new THREE.Vector2(coilRadius, y));
      coilPoints.push(new THREE.Vector2(coilRadius - grooveDepth, y + params.groovePitch * 0.3));
      coilPoints.push(new THREE.Vector2(coilRadius - grooveDepth, y + params.groovePitch * 0.7));
      coilPoints.push(new THREE.Vector2(coilRadius, y + params.groovePitch));
    }
    coilPoints.push(new THREE.Vector2(coilRadius, params.coilHeight));
  } else {
    coilPoints.push(new THREE.Vector2(coilRadius, 0));
    coilPoints.push(new THREE.Vector2(coilRadius, params.coilHeight));
  }

  coilPoints.push(new THREE.Vector2(0.01, params.coilHeight));

  const coilGeometry = new THREE.LatheGeometry(coilPoints, 48);
  coilGeometry.translate(0, coilBottom, 0);
  csg = csg.union(CSG.fromGeometry(coilGeometry));

  // 3. TOP POST
  const postGeometry = createCylinder(postRadius, params.postHeight, 48);
  postGeometry.translate(0, coilTop, 0);
  csg = csg.union(CSG.fromGeometry(postGeometry));

  // 4. HEX NUT POCKET
  const nutGeometry = createHexPrism(params.nutAcrossFlats, params.nutThickness);
  nutGeometry.translate(0, postTop - params.nutThickness, 0);
  csg = csg.subtract(CSG.fromGeometry(nutGeometry));

  // 5. NUT BORE through entire post
  const boreGeometry = createCylinder(params.nutBore / 2, params.postHeight + 10, 24);
  boreGeometry.translate(0, coilTop - 5, 0);
  csg = csg.subtract(CSG.fromGeometry(boreGeometry));

  // 6. TOP WIRE HOLE - horizontal from outside to center
  const topWireGeometry = createCylinderBetween(wireRadius, -coilRadius - 5, wireTopY, 0, coilRadius + 5, wireTopY, 0);
  csg = csg.subtract(CSG.fromGeometry(topWireGeometry));

  // 7. VERTICAL CHANNEL from top wire hole UP to nut bore
  const upChannelGeometry = createCylinderBetween(wireRadius, 0, wireTopY - 2, 0, 0, coilTop + 5, 0);
  csg = csg.subtract(CSG.fromGeometry(upChannelGeometry));

  // 8. BOTTOM WIRE HOLE - horizontal from outside to center
  const botWireGeometry = createCylinderBetween(wireRadius, -coilRadius - 5, wireBotY, 0, coilRadius + 5, wireBotY, 0);
  csg = csg.subtract(CSG.fromGeometry(botWireGeometry));

  // 9. VERTICAL CHANNEL from bottom wire hole DOWN into base
  const downChannelGeometry = createCylinderBetween(wireRadius, 0, wireBotY + 2, 0, 0, -5, 0);
  csg = csg.subtract(CSG.fromGeometry(downChannelGeometry));

  // 10. HORIZONTAL CHANNEL in base to solder area
  const solderY = params.baseHeight / 2 + 3;
  const hChannelGeometry = createCylinderBetween(wireRadius, 0, solderY, 0, 0, solderY, -baseRadius - 5);
  csg = csg.subtract(CSG.fromGeometry(hChannelGeometry));

  // 11. FRONT FLAT for connector mounting
  const flatGeometry = createBox(params.radioFlatWidth + 8, params.baseHeight + 2, params.radioFlatDepth * 2 + 4);
  flatGeometry.translate(0, -1, baseRadius - params.radioFlatDepth);
  csg = csg.subtract(CSG.fromGeometry(flatGeometry));

  // 12. RADIO CONNECTOR HOLE
  const radioHoleGeometry = createCylinderBetween(
    params.radioHoleDiameter / 2,
    0,
    params.baseHeight / 2,
    -baseRadius - 5,
    0,
    params.baseHeight / 2,
    baseRadius + 5
  );
  csg = csg.subtract(CSG.fromGeometry(radioHoleGeometry));

  // 13. BACK SOLDER ACCESS CUTOUT
  const accessGeometry = createBox(24, params.baseHeight - 6, 14);
  accessGeometry.translate(0, 3, -(baseRadius - 5));
  csg = csg.subtract(CSG.fromGeometry(accessGeometry));

  // 14. COUNTERPOISE HOLE
  const counterpoiseGeometry = createCylinderBetween(
    params.counterpoiseHoleDiameter / 2,
    -baseRadius - 5,
    params.baseHeight / 2,
    0,
    baseRadius + 5,
    params.baseHeight / 2,
    0
  );
  csg = csg.subtract(CSG.fromGeometry(counterpoiseGeometry));

  // 15. BOTTOM BNC HOLE - vertical through center for mounting on radio
  const bottomBncGeometry = createCylinder(params.radioHoleDiameter / 2, params.baseHeight + 10, 24);
  bottomBncGeometry.translate(0, -5, 0);
  csg = csg.subtract(CSG.fromGeometry(bottomBncGeometry));

  // 16. BOTTOM BNC RECESS - flat area on bottom for connector body to seat
  const bncRecessDepth = 3;
  const bncRecessDiameter = params.radioHoleDiameter + 6;
  const bncRecessGeometry = createCylinder(bncRecessDiameter / 2, bncRecessDepth + 1, 24);
  bncRecessGeometry.translate(0, -0.5, 0);
  csg = csg.subtract(CSG.fromGeometry(bncRecessGeometry));

  return csg;
}

/**
 * Build antenna model with progress reporting
 * Allows UI to update during long-running CSG operations
 */
export async function buildAntennaModelWithProgress(
  params: BuildParams,
  onProgress?: (progress: number) => void
): Promise<THREE.BufferGeometry> {
  const totalSteps = 16;
  let currentStep = 0;

  const reportProgress = async () => {
    currentStep++;
    onProgress?.(Math.round((currentStep / totalSteps) * 100));
    await yieldToMain();
  };

  const baseRadius = params.baseDiameter / 2;
  const coilRadius = params.coilDiameter / 2;
  const postRadius = params.nutAcrossFlats / 2 + 4;
  const coilBottom = params.baseHeight;
  const coilTop = coilBottom + params.coilHeight;
  const postTop = coilTop + params.postHeight;

  const wireRadius = params.wireHoleDiameter / 2;
  const wireTopY = coilTop - 5;
  const wireBotY = coilBottom + 5;

  // 1. BASE CYLINDER
  let csg = CSG.fromGeometry(createCylinder(baseRadius, params.baseHeight, 48));
  await reportProgress();

  // 2. SOLID COIL FORMER
  const coilPoints: THREE.Vector2[] = [];
  coilPoints.push(new THREE.Vector2(0.01, 0));

  if (params.showGrooves) {
    const grooveDepth = 0.8;
    const numGrooves = Math.floor(params.coilHeight / params.groovePitch);

    for (let i = 0; i < numGrooves; i++) {
      const y = i * params.groovePitch;
      coilPoints.push(new THREE.Vector2(coilRadius, y));
      coilPoints.push(new THREE.Vector2(coilRadius - grooveDepth, y + params.groovePitch * 0.3));
      coilPoints.push(new THREE.Vector2(coilRadius - grooveDepth, y + params.groovePitch * 0.7));
      coilPoints.push(new THREE.Vector2(coilRadius, y + params.groovePitch));
    }
    coilPoints.push(new THREE.Vector2(coilRadius, params.coilHeight));
  } else {
    coilPoints.push(new THREE.Vector2(coilRadius, 0));
    coilPoints.push(new THREE.Vector2(coilRadius, params.coilHeight));
  }

  coilPoints.push(new THREE.Vector2(0.01, params.coilHeight));

  const coilGeometry = new THREE.LatheGeometry(coilPoints, 48);
  coilGeometry.translate(0, coilBottom, 0);
  csg = csg.union(CSG.fromGeometry(coilGeometry));
  await reportProgress();

  // 3. TOP POST
  const postGeometry = createCylinder(postRadius, params.postHeight, 48);
  postGeometry.translate(0, coilTop, 0);
  csg = csg.union(CSG.fromGeometry(postGeometry));
  await reportProgress();

  // 4. HEX NUT POCKET
  const nutGeometry = createHexPrism(params.nutAcrossFlats, params.nutThickness);
  nutGeometry.translate(0, postTop - params.nutThickness, 0);
  csg = csg.subtract(CSG.fromGeometry(nutGeometry));
  await reportProgress();

  // 5. NUT BORE through entire post
  const boreGeometry = createCylinder(params.nutBore / 2, params.postHeight + 10, 24);
  boreGeometry.translate(0, coilTop - 5, 0);
  csg = csg.subtract(CSG.fromGeometry(boreGeometry));
  await reportProgress();

  // 6. TOP WIRE HOLE
  const topWireGeometry = createCylinderBetween(wireRadius, -coilRadius - 5, wireTopY, 0, coilRadius + 5, wireTopY, 0);
  csg = csg.subtract(CSG.fromGeometry(topWireGeometry));
  await reportProgress();

  // 7. VERTICAL CHANNEL UP
  const upChannelGeometry = createCylinderBetween(wireRadius, 0, wireTopY - 2, 0, 0, coilTop + 5, 0);
  csg = csg.subtract(CSG.fromGeometry(upChannelGeometry));
  await reportProgress();

  // 8. BOTTOM WIRE HOLE
  const botWireGeometry = createCylinderBetween(wireRadius, -coilRadius - 5, wireBotY, 0, coilRadius + 5, wireBotY, 0);
  csg = csg.subtract(CSG.fromGeometry(botWireGeometry));
  await reportProgress();

  // 9. VERTICAL CHANNEL DOWN
  const downChannelGeometry = createCylinderBetween(wireRadius, 0, wireBotY + 2, 0, 0, -5, 0);
  csg = csg.subtract(CSG.fromGeometry(downChannelGeometry));
  await reportProgress();

  // 10. HORIZONTAL CHANNEL
  const solderY = params.baseHeight / 2 + 3;
  const hChannelGeometry = createCylinderBetween(wireRadius, 0, solderY, 0, 0, solderY, -baseRadius - 5);
  csg = csg.subtract(CSG.fromGeometry(hChannelGeometry));
  await reportProgress();

  // 11. FRONT FLAT
  const flatGeometry = createBox(params.radioFlatWidth + 8, params.baseHeight + 2, params.radioFlatDepth * 2 + 4);
  flatGeometry.translate(0, -1, baseRadius - params.radioFlatDepth);
  csg = csg.subtract(CSG.fromGeometry(flatGeometry));
  await reportProgress();

  // 12. RADIO CONNECTOR HOLE
  const radioHoleGeometry = createCylinderBetween(
    params.radioHoleDiameter / 2,
    0,
    params.baseHeight / 2,
    -baseRadius - 5,
    0,
    params.baseHeight / 2,
    baseRadius + 5
  );
  csg = csg.subtract(CSG.fromGeometry(radioHoleGeometry));
  await reportProgress();

  // 13. BACK SOLDER ACCESS CUTOUT
  const accessGeometry = createBox(24, params.baseHeight - 6, 14);
  accessGeometry.translate(0, 3, -(baseRadius - 5));
  csg = csg.subtract(CSG.fromGeometry(accessGeometry));
  await reportProgress();

  // 14. COUNTERPOISE HOLE
  const counterpoiseGeometry = createCylinderBetween(
    params.counterpoiseHoleDiameter / 2,
    -baseRadius - 5,
    params.baseHeight / 2,
    0,
    baseRadius + 5,
    params.baseHeight / 2,
    0
  );
  csg = csg.subtract(CSG.fromGeometry(counterpoiseGeometry));
  await reportProgress();

  // 15. BOTTOM BNC HOLE - vertical through center for mounting on radio
  const bottomBncGeometry = createCylinder(params.radioHoleDiameter / 2, params.baseHeight + 10, 24);
  bottomBncGeometry.translate(0, -5, 0);
  csg = csg.subtract(CSG.fromGeometry(bottomBncGeometry));
  await reportProgress();

  // 16. BOTTOM BNC RECESS - flat area on bottom for connector body to seat
  const bncRecessDepth = 3;
  const bncRecessDiameter = params.radioHoleDiameter + 6;
  const bncRecessGeometry = createCylinder(bncRecessDiameter / 2, bncRecessDepth + 1, 24);
  bncRecessGeometry.translate(0, -0.5, 0);
  csg = csg.subtract(CSG.fromGeometry(bncRecessGeometry));
  await reportProgress();

  return csg.toGeometry();
}

