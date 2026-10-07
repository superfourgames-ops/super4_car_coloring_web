import { App } from "../core/App.js";
import { RendererManager } from "../core/RenderManager.js";
import { Stroke } from "../models/Stroke.js";
import { drawSmoothPath } from "../utils/drawSmoothPath.js";
import { BaseBrush } from "./interface/BaseBrush.js";
import { IBrush } from "./interface/IBrush.js";

export class Neon extends BaseBrush implements IBrush {
    private static hue = 0;

    /**
     * Cycles through vibrant, saturated neon hues.
     */
    public static getNextColor(): string {
        Neon.hue = (Neon.hue + 32) % 360;
        return `hsl(${Neon.hue}, 100%, 62%)`;
    }

    public drawOnPointerDown(stroke: Stroke): void {
        this.lctx?.clearRect(0, 0, RendererManager.cssW, RendererManager.cssH);
        if (!stroke.color || stroke.color === 'rainbow') {
            stroke.color = Neon.getNextColor();
        }
        this.draw(this.lctx!, stroke);
        App.sound.PlaySFX(App.sound.brush, 0, true);
    }

    public drawOnPointerMove(stroke: Stroke): void {
        this.lctx?.clearRect(0, 0, RendererManager.cssW, RendererManager.cssH);
        this.draw(this.lctx!, stroke);
    }

    public drawOnPointerUp(stroke: Stroke): void {
        this.draw(this.bctx!, stroke);
        this.lctx?.clearRect(0, 0, RendererManager.cssW, RendererManager.cssH);
        this.playGreetingsSound();
        App.sound.StopSFX(App.sound.brush);
    }

    /**
     * Renders a glowing neon tube:
     * 1. Wide outer ambient glow (saturated neon hue)
     * 2. Inner intense halo (high opacity neon)
     * 3. Core white filament (pure white light source)
     */
    private draw(ctx: CanvasRenderingContext2D, stroke: Stroke): void {
        const pts = stroke.points;
        if (!pts || pts.length === 0) return;

        const color = (!stroke.color || stroke.color === 'rainbow') ? Neon.getNextColor() : stroke.color;

        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        const isDot = pts.length === 1 || (pts.length === 2 && pts[0][0] === pts[1][0] && pts[0][1] === pts[1][1]);

        const drawGeometry = (lineWidth: number, strokeColor: string) => {
            if (isDot) {
                ctx.fillStyle = strokeColor;
                ctx.beginPath();
                ctx.arc(pts[0][0], pts[0][1], Math.max(1, lineWidth / 2), 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.strokeStyle = strokeColor;
                ctx.lineWidth = lineWidth;
                drawSmoothPath(ctx, pts);
            }
        };

        // Pass 1: Wide outer ambient glow (scales dynamically with stroke.size)
        ctx.shadowColor = color;
        ctx.shadowBlur = Math.max(6, stroke.size * 1.2);
        drawGeometry(Math.max(3, stroke.size), color);

        // Pass 2: Saturated mid-glow tube
        ctx.shadowBlur = Math.max(3, stroke.size * 0.5);
        drawGeometry(Math.max(2, stroke.size * 0.65), color);

        // Pass 3: White / glowing core filament (creates realistic neon light)
        ctx.shadowBlur = Math.max(2, stroke.size * 0.2);
        ctx.shadowColor = "#ffffff";
        drawGeometry(Math.max(2, stroke.size * 0.38), "#ffffff");

        ctx.restore();
    }
}
