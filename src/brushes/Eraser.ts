import { App } from "../core/App.js";
import { RendererManager } from "../core/RenderManager.js";
import { Stroke } from "../models/Stroke.js";
import { drawSmoothPath } from "../utils/drawSmoothPath.js";
import { BaseBrush } from "./interface/BaseBrush.js";
import { IBrush } from "./interface/IBrush.js";

export class Eraser extends BaseBrush {
    public drawOnPointerDown(stroke: Stroke): void {
        this.draw(this.bctx!, stroke);
        App.sound.PlaySFX(App.sound.painting, 0, true);
    }
    public drawOnPointerMove(stroke: Stroke): void {
        this.draw(this.bctx!, stroke);
        this.unScratchGlitterMask(stroke);
    }
    public drawOnPointerUp(stroke: Stroke): void {
        this.draw(this.bctx!, stroke);
        App.sound.StopSFX(App.sound.painting);
    }

    private draw(ctx: CanvasRenderingContext2D, stroke: Stroke): void {
        if (stroke.points.length < 2) return;

        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        ctx.globalAlpha = 1;

        ctx.lineWidth = stroke.size;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        drawSmoothPath(ctx, stroke.points);

        ctx.restore();
    }
}