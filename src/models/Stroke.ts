import { Bubble } from "./Bubble.js";
import { Particle } from "./Particle.js";
import { Point } from "./Point.js";

export class Stroke {
  constructor(
    public size: number,
    public points: Point[] = [],
    public color?: string,
    public _jitter?: number[][][],
    public particles?: Particle[],
    public glitter?: GlitterParticle[],
    public stickerId?: string,
    public textureId?: string,
    public bubbles: Bubble[] = []
  ) {}

  addPoint(p: Point) {
    this.points.push(p);
  }
}