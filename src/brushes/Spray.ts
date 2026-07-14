import { App } from "../core/App.js";
import { RendererManager } from "../core/RenderManager.js";
import { Stroke } from "../models/Stroke.js";
import { BaseBrush } from "./interface/BaseBrush.js";
import { IBrush } from "./interface/IBrush.js";

export class Spray extends BaseBrush {
    public drawOnPointerDown(stroke: Stroke): void {
        this.lctx?.clearRect(0, 0, RendererManager.cssW, RendererManager.cssH);
        this.draw(this.lctx!, stroke);
        App.sound.PlaySFX(App.sound.spray, 0, true);
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
        App.sound.StopSFX(App.sound.spray);
    }

    private draw(ctx: CanvasRenderingContext2D, stroke: Stroke): void {
        const pts = stroke.points;
        if (pts.length < 2) return;

        ctx.save();
        stroke.particles ??= [];

        // 1. Calculate the current segment (using smoothing logic)
        const i = pts.length - 2;
        const p0 = (i === 0) ? pts[0] : [(pts[i - 1][0] + pts[i][0]) / 2, (pts[i - 1][1] + pts[i][1]) / 2];
        const cp = pts[i];
        const p1 = [(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2];

        // 2. Calculate density & tapering
        const minPoints = 200;
        const maxPoints = 8000;
        const t_fade = Math.min(1, Math.max(0, (pts.length - minPoints) / (maxPoints - minPoints)));
        const smooth = t_fade * t_fade * (3 - 2 * t_fade);
        const particlesPerStep = Math.round(5 * (1 - smooth)); // Fewer particles per step because we have many steps

        // 3. Interpolation steps based on distance
        const dist = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
        const steps = Math.max(1, Math.floor(dist / 2)); // Calculate spray points every 2 pixels

        for (let s = 0; s < steps; s++) {
            const t = s / steps;
            
            // Quadratic Bezier Formula for smooth path coordinates
            const x = (1 - t) * (1 - t) * p0[0] + 2 * (1 - t) * t * cp[0] + t * t * p1[0];
            const y = (1 - t) * (1 - t) * p0[1] + 2 * (1 - t) * t * cp[1] + t * t * p1[1];

            for (let j = 0; j < particlesPerStep; j++) {
                const angle = Math.random() * Math.PI * 2;
                const r = Math.random() * stroke.size;
                
                stroke.particles.push({
                    x: x + Math.cos(angle) * r,
                    y: y + Math.sin(angle) * r,
                    size: Math.random() * 1 + 0.5
                });
            }
        }

        // 4. Render the entire particle history
        ctx.fillStyle = stroke.color!;
        ctx.globalAlpha = 0.9;
        
        for (const p of stroke.particles) {
            ctx.fillRect(p.x, p.y, p.size, p.size);
        }

        ctx.restore();
    }
}