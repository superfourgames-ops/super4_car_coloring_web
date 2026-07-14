import { App } from "../core/App.js";
import { RendererManager } from "../core/RenderManager.js";
import { Stroke } from "../models/Stroke.js";
import { BaseBrush } from "./interface/BaseBrush.js";
import { IBrush } from "./interface/IBrush.js";

export class Paint extends BaseBrush {
    public drawOnPointerDown(stroke: Stroke): void {
        this.lctx?.clearRect(0, 0, RendererManager.cssW, RendererManager.cssH);
        this.draw(this.lctx!, stroke);
        App.sound.PlaySFX(App.sound.brush, 0, true);
    }

    public drawOnPointerMove(stroke: Stroke): void {
        this.lctx?.clearRect(0, 0, RendererManager.cssW, RendererManager.cssH);
        this.draw(this.lctx!, stroke);
        this.unScratchGlitterMask(stroke);
    }

    public drawOnPointerUp(stroke: Stroke): void {
        this.draw(this.bctx!, stroke);
        this.lctx?.clearRect(0, 0, RendererManager.cssW, RendererManager.cssH);
        this.playGreetingsSound();
        App.sound.StopSFX(App.sound.brush);
    }

    private draw(ctx: CanvasRenderingContext2D, stroke: Stroke): void {
        const pts = stroke.points;
        if (pts.length < 2) return;

        ctx.save();
        ctx.fillStyle = stroke.color!;

        // 1. Calculate midpoints for the smooth path
        const midPoints: [number, number][] = [];
        for (let i = 0; i < pts.length - 1; i++) {
            midPoints.push([
                (pts[i][0] + pts[i + 1][0]) / 2,
                (pts[i][1] + pts[i + 1][1]) / 2
            ]);
        }

        // 2. Iterate through segments (each segment is a quadratic curve)
        // A segment goes from midPoints[i] to midPoints[i+1] using pts[i+1] as control
        for (let i = 0; i < midPoints.length - 1; i++) {
            const start = midPoints[i];
            const control = pts[i + 1];
            const end = midPoints[i + 1];

            // Progress tracking for tapering (i / length)
            const progress = i / midPoints.length;
            const size = Math.max(1, stroke.size * (1 - progress * 0.6));
            const alpha = 0.6 * (1 - progress);
            ctx.globalAlpha = alpha;

            // 3. Density-based sampling along the curve
            // We approximate the curve length to decide how many stamps to draw
            const steps = 10; // Increase for higher quality/density
            for (let s = 0; s <= steps; s++) {
                const t = s / steps;
                
                // Quadratic Bezier Formula
                const x = (1 - t) * (1 - t) * start[0] + 2 * (1 - t) * t * control[0] + t * t * end[0];
                const y = (1 - t) * (1 - t) * start[1] + 2 * (1 - t) * t * control[1] + t * t * end[1];

                ctx.beginPath();
                ctx.arc(x, y, size / 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.restore();
    }
}