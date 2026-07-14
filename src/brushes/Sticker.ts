import { App } from "../core/App.js";
import { Stroke } from "../models/Stroke.js";
import { BaseBrush } from "./interface/BaseBrush.js";
import { IBrush } from "./interface/IBrush.js";

export class Sticker extends BaseBrush{
    public drawOnPointerDown(stroke: Stroke): void {
        this.draw(this.bctx!, stroke);
        this.playGreetingsSound();
        App.sound.PlaySFX(App.sound.buttonClick, 0, false);
    }
    public drawOnPointerMove(stroke: Stroke): void {
        //Do nothing
    }
    public drawOnPointerUp(stroke: Stroke): void {
        //Do nothing
    }
    private draw(ctx: CanvasRenderingContext2D, stroke: Stroke): void {
        ctx.save();

        const stickerImage = new Image();
        const path = this.getBackgroundImageUrl(
            document.getElementById(stroke.stickerId!)!
        );

        if (!path || stroke.points.length === 0) {
            ctx.restore();
            return;
        }

        stickerImage.src = path;

        stickerImage.onload = () => {
            const canvas = ctx.canvas;

            // 🔹 10% of canvas width (tweak this)
            const targetWidth = canvas.width * stroke.size * 0.00375;

            // preserve aspect ratio
            const scale = targetWidth / stickerImage.width;
            const drawWidth = stickerImage.width * scale;
            const drawHeight = stickerImage.height * scale;

            const x = stroke.points[0][0] - drawWidth / 2;
            const y = stroke.points[0][1] - drawHeight / 2;

            ctx.drawImage(stickerImage, x, y, drawWidth, drawHeight);
            ctx.restore();
        };
    }


    private getBackgroundImageUrl(el: HTMLElement): string | null {
        const bg = getComputedStyle(el).backgroundImage;
        if (!bg || bg === "none") return null;
        return bg.slice(4, -1).replace(/["']/g, "");
    }
}