import { App } from "../core/App.js";
import { RendererManager } from "../core/RenderManager.js";
import { Stroke } from "../models/Stroke.js";
import { BaseBrush } from "./interface/BaseBrush.js";
import { IBrush } from "./interface/IBrush.js";

export class GlitterRainbow extends BaseBrush {
    public drawOnPointerDown(stroke: Stroke): void {
        this.lctx?.clearRect(0, 0, RendererManager.cssW, RendererManager.cssH);
        this.draw(this.lctx!, stroke);
        App.sound.PlaySFX(App.sound.glitter, 0, true);
    }

    public drawOnPointerMove(stroke: Stroke): void {
        this.lctx?.clearRect(0, 0, RendererManager.cssW, RendererManager.cssH);
        this.draw(this.lctx!, stroke);
        this.scratchGlitterMask(stroke);
    }

    public drawOnPointerUp(stroke: Stroke): void {
        this.draw(this.bctx!, stroke);
        this.lctx?.clearRect(0, 0, RendererManager.cssW, RendererManager.cssH);
        this.playGreetingsSound();
        App.sound.StopSFX(App.sound.glitter);
    }

    private draw(ctx: CanvasRenderingContext2D, stroke: Stroke): void {
        const pts = stroke.points;
        if (pts.length < 2) return;

        ctx.save();
        stroke.glitter ??= [];

        // 1. Generate new glitter ONLY for the most recent segment
        // This prevents the glitter density from exploding every frame
        const i = pts.length - 2; 
        const p0 = (i === 0) ? pts[0] : [(pts[i-1][0] + pts[i][0]) / 2, (pts[i-1][1] + pts[i][1]) / 2];
        const cp = pts[i];
        const p1 = [(pts[i][0] + pts[i+1][0]) / 2, (pts[i][1] + pts[i+1][1]) / 2];

        // Determine how many steps based on distance (fixes the "fast move" gap)
        const dist = Math.hypot(pts[i+1][0] - pts[i][0], pts[i+1][1] - pts[i][1]);
        const steps = Math.max(1, Math.floor(dist / 2)); // One check every 2 pixels

        for (let s = 0; s < steps; s++) {
            const t = s / steps;
            // Quadratic Bezier Interpolation (Matching your drawSmoothPath logic)
            const x = (1 - t) * (1 - t) * p0[0] + 2 * (1 - t) * t * cp[0] + t * t * p1[0];
            const y = (1 - t) * (1 - t) * p0[1] + 2 * (1 - t) * t * cp[1] + t * t * p1[1];

            // Only add a few glitter particles per step
            if (Math.random() > 0.5) { 
                const colorT = Math.random() * Math.PI * 2;
                stroke.glitter.push({
                    x: x + (Math.random() - 0.5) * stroke.size,
                    y: y + (Math.random() - 0.5) * stroke.size,
                    radius: Math.random() * stroke.size * 0.5,
                    r: Math.floor(128 + 127 * Math.sin(colorT)),
                    g: Math.floor(128 + 127 * Math.sin(colorT + 2.094)),
                    b: Math.floor(128 + 127 * Math.sin(colorT + 4.188)),
                    alpha: Math.random() * 0.5 + 0.3
                });
            }
        }

        // 2. Render all accumulated glitter
        for (const g0 of stroke.glitter) {
            ctx.fillStyle = `rgba(${g0.r}, ${g0.g}, ${g0.b}, ${g0.alpha})`;
            ctx.beginPath();
            ctx.arc(g0.x, g0.y, g0.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}