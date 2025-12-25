import * as THREE from 'three';

/**
 * Export mesh to STL format
 */
export function exportToSTL(geometry: THREE.BufferGeometry): Blob {
  const mesh = new THREE.Mesh(geometry);
  
  // Get triangles from geometry
  const positionAttribute = geometry.getAttribute('position');
  const positions = positionAttribute.array;
  const triangleCount = positions.length / 9;
  
  // Calculate buffer size: 80 byte header + 4 byte triangle count + (50 bytes per triangle)
  const bufferSize = 80 + 4 + triangleCount * 50;
  const buffer = new ArrayBuffer(bufferSize);
  const view = new DataView(buffer);
  
  // Write 80-byte header
  const header = 'Antenna Base Designer - STL Export';
  for (let i = 0; i < 80; i++) {
    view.setUint8(i, i < header.length ? header.charCodeAt(i) : 0);
  }
  
  // Write triangle count
  view.setUint32(80, triangleCount, true);
  
  let offset = 84;
  
  // Write triangles
  for (let i = 0; i < positions.length; i += 9) {
    // Calculate face normal
    const v0 = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
    const v1 = new THREE.Vector3(positions[i + 3], positions[i + 4], positions[i + 5]);
    const v2 = new THREE.Vector3(positions[i + 6], positions[i + 7], positions[i + 8]);
    
    const edge1 = v1.clone().sub(v0);
    const edge2 = v2.clone().sub(v0);
    const normal = edge1.cross(edge2).normalize();
    
    // Write normal
    view.setFloat32(offset, normal.x, true); offset += 4;
    view.setFloat32(offset, normal.y, true); offset += 4;
    view.setFloat32(offset, normal.z, true); offset += 4;
    
    // Write vertices
    view.setFloat32(offset, positions[i], true); offset += 4;
    view.setFloat32(offset, positions[i + 1], true); offset += 4;
    view.setFloat32(offset, positions[i + 2], true); offset += 4;
    
    view.setFloat32(offset, positions[i + 3], true); offset += 4;
    view.setFloat32(offset, positions[i + 4], true); offset += 4;
    view.setFloat32(offset, positions[i + 5], true); offset += 4;
    
    view.setFloat32(offset, positions[i + 6], true); offset += 4;
    view.setFloat32(offset, positions[i + 7], true); offset += 4;
    view.setFloat32(offset, positions[i + 8], true); offset += 4;
    
    // Attribute byte count (unused)
    view.setUint16(offset, 0, true); offset += 2;
  }
  
  return new Blob([buffer], { type: 'application/octet-stream' });
}

/**
 * Trigger download of STL file
 */
export function downloadSTL(geometry: THREE.BufferGeometry, filename: string = 'antenna_base.stl'): void {
  const blob = exportToSTL(geometry);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

