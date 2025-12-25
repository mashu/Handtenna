import * as THREE from 'three';
import { Vector3 } from './vector';
import { Vertex } from './vertex';
import { Polygon } from './polygon';
import { BSPNode } from './bsp';

/**
 * CSG (Constructive Solid Geometry) class for boolean operations
 */
export class CSG {
  public polygons: Polygon[] = [];

  clone(): CSG {
    const csg = new CSG();
    csg.polygons = this.polygons.map((p) => p.clone());
    return csg;
  }

  union(other: CSG): CSG {
    const a = new BSPNode(this.clone().polygons);
    const b = new BSPNode(other.clone().polygons);

    a.clipTo(b);
    b.clipTo(a);
    b.invert();
    b.clipTo(a);
    b.invert();
    a.build(b.allPolygons());

    const result = new CSG();
    result.polygons = a.allPolygons();
    return result;
  }

  subtract(other: CSG): CSG {
    const a = new BSPNode(this.clone().polygons);
    const b = new BSPNode(other.clone().polygons);

    a.invert();
    a.clipTo(b);
    b.clipTo(a);
    b.invert();
    b.clipTo(a);
    b.invert();
    a.build(b.allPolygons());
    a.invert();

    const result = new CSG();
    result.polygons = a.allPolygons();
    return result;
  }

  static fromGeometry(geometry: THREE.BufferGeometry): CSG {
    const csg = new CSG();
    const position = geometry.attributes.position.array;
    const index = geometry.index?.array;

    if (index) {
      for (let i = 0; i < index.length; i += 3) {
        const a = index[i];
        const b = index[i + 1];
        const c = index[i + 2];

        const polygon = new Polygon([
          new Vertex(new Vector3(position[a * 3], position[a * 3 + 1], position[a * 3 + 2])),
          new Vertex(new Vector3(position[b * 3], position[b * 3 + 1], position[b * 3 + 2])),
          new Vertex(new Vector3(position[c * 3], position[c * 3 + 1], position[c * 3 + 2])),
        ]);

        if (polygon.plane) csg.polygons.push(polygon);
      }
    } else {
      for (let i = 0; i < position.length; i += 9) {
        const polygon = new Polygon([
          new Vertex(new Vector3(position[i], position[i + 1], position[i + 2])),
          new Vertex(new Vector3(position[i + 3], position[i + 4], position[i + 5])),
          new Vertex(new Vector3(position[i + 6], position[i + 7], position[i + 8])),
        ]);

        if (polygon.plane) csg.polygons.push(polygon);
      }
    }

    return csg;
  }

  toGeometry(): THREE.BufferGeometry {
    const positions: number[] = [];

    for (const polygon of this.polygons) {
      if (!polygon.plane) continue;

      for (let i = 1; i < polygon.vertices.length - 1; i++) {
        const v0 = polygon.vertices[0].position;
        const v1 = polygon.vertices[i].position;
        const v2 = polygon.vertices[i + 1].position;

        positions.push(v0.x, v0.y, v0.z);
        positions.push(v1.x, v1.y, v1.z);
        positions.push(v2.x, v2.y, v2.z);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.computeVertexNormals();
    return geometry;
  }
}

