import { Plane } from './plane';
import { Polygon } from './polygon';

/**
 * BSP (Binary Space Partitioning) tree for CSG operations
 */
export class BSPNode {
  public plane: Plane | null = null;
  public front: BSPNode | null = null;
  public back: BSPNode | null = null;
  public polygons: Polygon[] = [];

  constructor(polygons?: Polygon[]) {
    if (polygons) this.build(polygons);
  }

  clone(): BSPNode {
    const node = new BSPNode();
    node.plane = this.plane?.clone() ?? null;
    node.front = this.front?.clone() ?? null;
    node.back = this.back?.clone() ?? null;
    node.polygons = this.polygons.map((p) => p.clone());
    return node;
  }

  invert(): void {
    for (const polygon of this.polygons) {
      polygon.flip();
    }
    if (this.plane) this.plane.flip();
    if (this.front) this.front.invert();
    if (this.back) this.back.invert();
    [this.front, this.back] = [this.back, this.front];
  }

  clipPolygons(polygons: Polygon[]): Polygon[] {
    if (!this.plane) return polygons.slice();

    let front: Polygon[] = [];
    let back: Polygon[] = [];

    for (const polygon of polygons) {
      if (polygon.plane) {
        this.plane.splitPolygon(polygon, front, back, front, back);
      }
    }

    if (this.front) front = this.front.clipPolygons(front);
    back = this.back ? this.back.clipPolygons(back) : [];

    return front.concat(back);
  }

  clipTo(bsp: BSPNode): void {
    this.polygons = bsp.clipPolygons(this.polygons);
    if (this.front) this.front.clipTo(bsp);
    if (this.back) this.back.clipTo(bsp);
  }

  allPolygons(): Polygon[] {
    let result = this.polygons.slice();
    if (this.front) result = result.concat(this.front.allPolygons());
    if (this.back) result = result.concat(this.back.allPolygons());
    return result;
  }

  build(polygons: Polygon[]): void {
    const validPolygons = polygons.filter((p) => p.plane);
    if (validPolygons.length === 0) return;

    if (!this.plane) {
      this.plane = validPolygons[0].plane!.clone();
    }

    const front: Polygon[] = [];
    const back: Polygon[] = [];

    for (const polygon of validPolygons) {
      this.plane.splitPolygon(polygon, this.polygons, this.polygons, front, back);
    }

    if (front.length > 0) {
      if (!this.front) this.front = new BSPNode();
      this.front.build(front);
    }

    if (back.length > 0) {
      if (!this.back) this.back = new BSPNode();
      this.back.build(back);
    }
  }
}

