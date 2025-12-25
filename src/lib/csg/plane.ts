import { Vector3, EPS } from './vector';
import { Vertex } from './vertex';
import { Polygon } from './polygon';

const COPLANAR = 0;
const FRONT = 1;
const BACK = 2;
const SPANNING = 3;

/**
 * Plane class for CSG operations
 */
export class Plane {
  constructor(
    public normal: Vector3,
    public w: number
  ) {}

  static fromPoints(a: Vector3, b: Vector3, c: Vector3): Plane | null {
    const normal = b.subtract(a).cross(c.subtract(a));
    const length = normal.length();
    if (length < EPS) return null;
    const unitNormal = normal.multiply(1 / length);
    return new Plane(unitNormal, unitNormal.dot(a));
  }

  clone(): Plane {
    return new Plane(this.normal.clone(), this.w);
  }

  flip(): void {
    this.normal = this.normal.negate();
    this.w = -this.w;
  }

  splitPolygon(
    polygon: Polygon,
    coplanarFront: Polygon[],
    coplanarBack: Polygon[],
    front: Polygon[],
    back: Polygon[]
  ): void {
    let polygonType = 0;
    const types: number[] = [];

    for (const vertex of polygon.vertices) {
      const d = this.normal.dot(vertex.position) - this.w;
      const type = d < -EPS ? BACK : d > EPS ? FRONT : COPLANAR;
      polygonType |= type;
      types.push(type);
    }

    switch (polygonType) {
      case COPLANAR:
        (this.normal.dot(polygon.plane!.normal) > 0 ? coplanarFront : coplanarBack).push(polygon);
        break;
      case FRONT:
        front.push(polygon);
        break;
      case BACK:
        back.push(polygon);
        break;
      case SPANNING: {
        const frontVertices: Vertex[] = [];
        const backVertices: Vertex[] = [];

        for (let i = 0; i < polygon.vertices.length; i++) {
          const j = (i + 1) % polygon.vertices.length;
          const ti = types[i];
          const tj = types[j];
          const vi = polygon.vertices[i];
          const vj = polygon.vertices[j];

          if (ti !== BACK) frontVertices.push(vi);
          if (ti !== FRONT) backVertices.push(ti !== BACK ? vi.clone() : vi);

          if ((ti | tj) === SPANNING) {
            const dn = this.normal.dot(vj.position.subtract(vi.position));
            if (Math.abs(dn) > EPS) {
              const t = Math.max(0, Math.min(1, (this.w - this.normal.dot(vi.position)) / dn));
              const newVertex = vi.lerp(vj, t);
              frontVertices.push(newVertex);
              backVertices.push(newVertex.clone());
            }
          }
        }

        if (frontVertices.length >= 3) front.push(new Polygon(frontVertices));
        if (backVertices.length >= 3) back.push(new Polygon(backVertices));
        break;
      }
    }
  }
}

