import { App } from "../core/App.js";
import { RendererManager } from "../core/RenderManager.js";
import { Bubble } from "../models/Bubble.js";
import { Stroke } from "../models/Stroke.js";
import { BaseBrush } from "./interface/BaseBrush.js";
import { IBrush } from "./interface/IBrush.js";

export class SoapBubbles extends BaseBrush {
    public drawOnPointerDown(stroke: Stroke): void {
        this.lctx?.clearRect(0, 0, RendererManager.cssW, RendererManager.cssH);
        this.draw(this.lctx!, stroke);
        App.sound.PlaySFX(App.sound.bubbles, 0, true);
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
        App.sound.StopSFX(App.sound.bubbles);
    }

    private draw(ctx: CanvasRenderingContext2D, stroke: Stroke): void {
        const pts = stroke.points;
        if (pts.length < 2) return;

        ctx.save();

        // 1. Calculate interpolation for the latest segment
        const i = pts.length - 2;
        // Midpoint logic consistent with your drawSmoothPath
        const p0 = (i === 0) ? pts[0] : [(pts[i-1][0] + pts[i][0]) / 2, (pts[i-1][1] + pts[i][1]) / 2];
        const cp = pts[i];
        const p1 = [(pts[i][0] + pts[i+1][0]) / 2, (pts[i][1] + pts[i+1][1]) / 2];

        const dist = Math.hypot(pts[i+1][0] - pts[i][0], pts[i+1][1] - pts[i][1]);
        // Create a bubble every ~15 pixels for a nice spaced-out look
        const steps = Math.max(1, Math.floor(dist / 15)); 

        for (let s = 0; s < steps; s++) {
            const t = s / steps;
            // Bezier formula to find (x, y) along the curve
            const x = (1 - t) * (1 - t) * p0[0] + 2 * (1 - t) * t * cp[0] + t * t * p1[0];
            const y = (1 - t) * (1 - t) * p0[1] + 2 * (1 - t) * t * cp[1] + t * t * p1[1];

            stroke.bubbles.push({
                x: x + (Math.random() - 0.5) * 20, // Add some jitter
                y: y + (Math.random() - 0.5) * 20,
                radius: (Math.random() * stroke.size) + 5,
                hue: Math.random() * 360,
                alpha: 0.2 + Math.random() * 0.3
            });
        }

        // 2. Render all bubbles in the stroke
        for (const b of stroke.bubbles) {
            this.renderSingleBubble(ctx, b);
        }

        ctx.restore();
    }

    private renderSingleBubble(ctx: CanvasRenderingContext2D, b: Bubble) {
        ctx.beginPath();
        
        // Create the "soap film" effect with a radial gradient
        // Offset the center of the gradient for a "shining highlight" look
        const gradient = ctx.createRadialGradient(
            b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.1,
            b.x, b.y, b.radius
        );

        gradient.addColorStop(0, `rgba(255, 255, 255, ${b.alpha + 0.4})`); // High reflection
        gradient.addColorStop(0.2, `hsla(${b.hue}, 80%, 90%, 0.1)`);   // Hollow center
        gradient.addColorStop(0.8, `hsla(${b.hue}, 100%, 70%, ${b.alpha})`); // Iridescent rim
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`); // Soft edge

        ctx.fillStyle = gradient;
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();

        // Thin white rim to define the bubble shape
        ctx.strokeStyle = `rgba(255, 255, 255, ${b.alpha * 0.4})`;
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}