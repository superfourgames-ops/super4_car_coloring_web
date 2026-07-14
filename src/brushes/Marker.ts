import { App } from "../core/App.js";
import { RendererManager } from "../core/RenderManager.js";
import { Stroke } from "../models/Stroke.js";
import { drawSmoothPath } from "../utils/drawSmoothPath.js";
import { BaseBrush } from "./interface/BaseBrush.js";
import { IBrush } from "./interface/IBrush.js";

export class Marker extends BaseBrush{
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
        ctx.save();
        ctx.globalAlpha = 0.7;
        ctx.lineCap = 'square';
        ctx.strokeStyle = stroke.color!;
        ctx.lineWidth = stroke.size * 3 + 15;
        drawSmoothPath(ctx, stroke.points);
        ctx.restore();
    }
}