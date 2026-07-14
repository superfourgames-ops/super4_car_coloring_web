import { App } from "../../core/App.js";
import { Stroke } from "../../models/Stroke";
import { drawSmoothPath } from "../../utils/drawSmoothPath.js";
import { parental } from "../../utils/queryParamParser.js";
import { IBrush } from "./IBrush";

export abstract class BaseBrush implements IBrush {
    protected bctx: CanvasRenderingContext2D;
    protected lctx: CanvasRenderingContext2D;
    protected mctx: CanvasRenderingContext2D; // The Mask Buffer Context

    constructor(bctx: CanvasRenderingContext2D, lctx: CanvasRenderingContext2D, mctx: CanvasRenderingContext2D) {
        this.bctx = bctx;
        this.lctx = lctx;
        this.mctx = mctx;
    }

    // Abstract methods that children must implement
    abstract drawOnPointerDown(stroke: Stroke): void;
    abstract drawOnPointerMove(stroke: Stroke): void;
    abstract drawOnPointerUp(stroke: Stroke): void;

    protected scratchGlitterMask(stroke: Stroke): void {
        this.mctx!.save();
        this.mctx!.lineJoin = 'round';
        this.mctx!.lineCap = 'round';
        this.mctx!.lineWidth = stroke.size;
        this.mctx!.strokeStyle = stroke.color!; 
        drawSmoothPath(this.mctx!, stroke.points);
        this.mctx!.restore();
    }

    protected unScratchGlitterMask(stroke: Stroke): void {
        this.mctx!.save();
        this.mctx!.globalCompositeOperation = 'destination-out';
        this.mctx!.lineJoin = 'round';
        this.mctx!.lineCap = 'round';
        this.mctx!.lineWidth = stroke.size;
        this.mctx!.strokeStyle = stroke.color!; 
        drawSmoothPath(this.mctx!, stroke.points);
        this.mctx!.restore();
    }

    protected playGreetingsSound(): void {
        if(!parental) {
            return;
        }

        setTimeout(() => {
            const shouldPlay = Math.floor(Math.random() * 18) === 0;

            if (shouldPlay) {
                const voiceLines: string[] = [
                    App.sound.lovelyVo,
                    App.sound.thatwasAwesomeVo,
                    App.sound.thatsGreatVo,
                    App.sound.thatsSuperFunVo,
                    App.sound.wonderFullVo,
                    App.sound.woow
                ];

                const randomIndex = Math.floor(Math.random() * voiceLines.length);
                const selectedSound = voiceLines[randomIndex];

                App.sound.PlaySFX(selectedSound, 0, false);
            }
        }, 1000);
    }
}

