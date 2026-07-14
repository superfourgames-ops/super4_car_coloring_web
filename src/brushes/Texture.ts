import { App } from "../core/App.js";
import { RendererManager } from "../core/RenderManager.js";
import { Stroke } from "../models/Stroke.js";
import { textureDiagonalPopins, textureVibrantHeart, texturePolkaDots, textures } from "../textures.js";
import { drawSmoothPath } from "../utils/drawSmoothPath.js";
import { BaseBrush } from "./interface/BaseBrush.js";
import { IBrush } from "./interface/IBrush.js";

export class Texture extends BaseBrush{
    public drawOnPointerDown(stroke: Stroke): void {
        this.lctx?.clearRect(0, 0, RendererManager.cssW, RendererManager.cssH);
        this.draw(this.lctx!, stroke);
        App.sound.PlaySFX(App.sound.pattern, 0, true);
    }
    public drawOnPointerMove(stroke: Stroke): void {
        this.lctx?.clearRect(0, 0, RendererManager.cssW, RendererManager.cssH);
        this.draw(this.lctx!, stroke);
        this.unScratchGlitterMask(stroke);
    }
    public drawOnPointerUp(stroke: Stroke): void {
        this.draw(this.bctx!, stroke);
        this.lctx?.clearRect(0, 0, RendererManager.cssW, RendererManager.cssH);
        App.sound.StopSFX(App.sound.pattern);
        this.playGreetingsSound();
    }
    private draw(ctx: CanvasRenderingContext2D, stroke: Stroke): void {
        ctx.save();
        // ctx.globalCompositeOperation = 'overlay';
        ctx.globalAlpha = 1;
        ctx.lineCap = 'round';

        ctx.strokeStyle = textures[stroke.textureId!](ctx, ctx.canvas.width * 0.05)!;

        ctx.lineWidth = stroke.size;
        drawSmoothPath(ctx, stroke.points);
        ctx.restore();
    }
}