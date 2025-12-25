import { Vertex } from './vertex';
import { Plane } from './plane';

/**
 * Polygon class representing a face in 3D space
 */
export class Polygon {
  public plane: Plane | null;

  constructor(public vertices: Vertex[]) {
    this.plane =
      vertices.length >= 3
        ? Plane.fromPoints(vertices[0].position, vertices[1].position, vertices[2].position)
        : null;
  }

  clone(): Polygon {
    return new Polygon(this.vertices.map((v) => v.clone()));
  }

  flip(): void {
    this.vertices.reverse();
    if (this.plane) this.plane.flip();
  }
}

