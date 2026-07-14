import { Point } from "../models/Point.js";

export function drawSmoothPath(
  ctx: CanvasRenderingContext2D,
  pts: Point[]
): void {
  if (pts.length < 2) return;

  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);

  for (let i = 1; i < pts.length - 1; i++) {
    const xc = (pts[i][0] + pts[i + 1][0]) / 2;
    const yc = (pts[i][1] + pts[i + 1][1]) / 2;
    ctx.quadraticCurveTo(pts[i][0], pts[i][1], xc, yc);
  }

  const last = pts[pts.length - 1];
  ctx.lineTo(last[0], last[1]);
  ctx.stroke();
}