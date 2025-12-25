import * as THREE from 'three';

/**
 * Create a cylinder with bottom at y=0
 */
export function createCylinder(radius: number, height: number, segments: number = 32): THREE.BufferGeometry {
  const geometry = new THREE.CylinderGeometry(radius, radius, height, segments);
  geometry.translate(0, height / 2, 0);
  return geometry;
}

/**
 * Create a cylinder from point A to point B
 */
export function createCylinderBetween(
  radius: number,
  ax: number,
  ay: number,
  az: number,
  bx: number,
  by: number,
  bz: number,
  segments: number = 16
): THREE.BufferGeometry {
  const dx = bx - ax;
  const dy = by - ay;
  const dz = bz - az;
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz);

  const geometry = new THREE.CylinderGeometry(radius, radius, length, segments);
  const mid = new THREE.Vector3((ax + bx) / 2, (ay + by) / 2, (az + bz) / 2);
  const direction = new THREE.Vector3(dx, dy, dz).normalize();
  const up = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction);
  const matrix = new THREE.Matrix4().makeRotationFromQuaternion(quaternion);
  matrix.setPosition(mid);
  geometry.applyMatrix4(matrix);

  return geometry;
}

/**
 * Create a box with bottom at y=0
 */
export function createBox(width: number, height: number, depth: number): THREE.BufferGeometry {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  geometry.translate(0, height / 2, 0);
  return geometry;
}

/**
 * Create a hexagonal prism (for nut pockets)
 */
export function createHexPrism(acrossFlats: number, height: number): THREE.BufferGeometry {
  const radius = acrossFlats / 2 / Math.cos(Math.PI / 6);
  const shape = new THREE.Shape();

  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
    if (i === 0) {
      shape.moveTo(radius * Math.cos(angle), radius * Math.sin(angle));
    } else {
      shape.lineTo(radius * Math.cos(angle), radius * Math.sin(angle));
    }
  }
  shape.closePath();

  const geometry = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: false });
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

