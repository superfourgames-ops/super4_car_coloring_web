import { App } from "../core/App.js";
import { RendererManager } from "../core/RenderManager.js";
import { Stroke } from "../models/Stroke.js";
import { drawSmoothPath } from "../utils/drawSmoothPath.js";
import { BaseBrush } from "./interface/BaseBrush.js";
import { IBrush } from "./interface/IBrush.js";

export class Glitter extends BaseBrush {
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
        if (stroke.points.length < 2) return;
        
        ctx.save();
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = stroke.size;
        ctx.strokeStyle = stroke.color!; 
        drawSmoothPath(ctx, stroke.points);
        ctx.restore();
    }
}