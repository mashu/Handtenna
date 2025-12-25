import { Vector3 } from './vector';

/**
 * Vertex class representing a point in 3D space
 */
export class Vertex {
  constructor(public position: Vector3) {}

  clone(): Vertex {
    return new Vertex(this.position.clone());
  }

  lerp(other: Vertex, t: number): Vertex {
    return new Vertex(this.position.lerp(other.position, t));
  }
}

