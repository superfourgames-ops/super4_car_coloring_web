import { App } from "../core/App.js";
import { RendererManager } from "../core/RenderManager.js";
import { Point } from "../models/Point.js";
import { Stroke } from "../models/Stroke.js";
import { drawSmoothPath } from "../utils/drawSmoothPath.js";
import { rand } from "../utils/rand.js";
import { BaseBrush } from "./interface/BaseBrush.js";
import { IBrush } from "./interface/IBrush.js";

export class Crayon extends BaseBrush {
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
        ctx.strokeStyle = stroke.color!;
        ctx.lineWidth = stroke.size * 0.5;
        ctx.globalAlpha = 0.7;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        const roughness = 0.4;  //0.4
        const layers = 4;  //2
        const jitter = roughness * stroke.size;

        // cache jitter per point per layer
        stroke._jitter ??= [];

      
        for (let j = 0; j < layers; j++) {
        const jitteredPoints: Point[] = [];

        for (let i = 0; i < stroke.points.length; i++) {
          stroke._jitter[i] ??= [];
          stroke._jitter[i][j] ??= [
            rand(-jitter, jitter),
            rand(-jitter, jitter),
          ];

          const [dx, dy] = stroke._jitter[i][j];
          const [x, y] = stroke.points[i];

          jitteredPoints.push([x + dx, y + dy]);
        }

        // draw one continuous path per layer
        drawSmoothPath(ctx, jitteredPoints);
      }

      ctx.restore();
    }
}