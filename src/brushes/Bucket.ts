import { App } from "../core/App.js";
import { RendererManager } from "../core/RenderManager.js";
import { Stroke } from "../models/Stroke.js";
import { BaseBrush } from "./interface/BaseBrush.js";
import { IBrush } from "./interface/IBrush.js";

export class Bucket extends BaseBrush {
    private isBucketAnimating: boolean = false;
    public drawOnPointerDown(stroke: Stroke): void {
        this.lctx?.clearRect(0, 0, RendererManager.cssW, RendererManager.cssH);
         App.sound.PlaySFX(App.sound.bucket, 0, false);
        //Do nothing
    }
    public drawOnPointerMove(stroke: Stroke): void {
        this.lctx?.clearRect(0, 0, RendererManager.cssW, RendererManager.cssH);
        //Do nothing
    }
    public drawOnPointerUp(stroke: Stroke): void {
        this.draw(stroke);
        this.playGreetingsSound();
    }
    private draw(stroke: Stroke): void {
        //bctx is baseCanvas
        const bctx = this.bctx!;
        const lctx = this.lctx!;

        if(this.isBucketAnimating) return; //to prevent multiple taps 
        bctx.save();

        const transform = (bctx.getTransform && bctx.getTransform()) || new DOMMatrix();
        const scale = transform.a || 1;

        const canvasW = bctx.canvas.width;
        const canvasH = bctx.canvas.height;

        if (!stroke.points || stroke.points.length === 0) {
            bctx.restore();
            return;
        }

        const seedCssX = stroke.points[stroke.points.length - 1][0];
        const seedCssY = stroke.points[stroke.points.length - 1][1];
        const seedX = Math.floor(seedCssX * scale);
        const seedY = Math.floor(seedCssY * scale);

        if (seedX < 0 || seedY < 0 || seedX >= canvasW || seedY >= canvasH) {
            bctx.restore();
            return;
        }


        //copying outline image to base canvas(where user lines are drawn)
        function copyOutlineImageToBase(): void {
            const imgRatio: number = RendererManager.outlineImage.width / RendererManager.outlineImage!.height;
            const canvasRatio: number = RendererManager.cssW / RendererManager.cssH;

            let drawW: number;
            let drawH: number;

            if (imgRatio > canvasRatio) {
                drawW = RendererManager.cssW;
                drawH = RendererManager.cssW / imgRatio;
            } else {
                drawH = RendererManager.cssH;
                drawW = RendererManager.cssH * imgRatio;
            }

            const dx: number = (RendererManager.cssW - drawW) / 2;
            const dy: number = (RendererManager.cssH - drawH) / 2;

            bctx.drawImage(RendererManager.outlineImage!, dx, dy, drawW, drawH);
        }
        copyOutlineImageToBase();


        const dstImage = lctx.getImageData(0, 0, canvasW, canvasH);
        const dstData = dstImage.data;
        const dstPixels = new Uint32Array(dstData.buffer);

        //read from base canvas and write on live canvas, after animation write on base canvas
        const image = bctx.getImageData(0, 0, canvasW, canvasH);
        const data = image.data;
        const pixels = new Uint32Array(data.buffer);

        const seedIdx = seedY * canvasW + seedX;
        const seedDataIdx = seedIdx * 4;

        // ---- TARGET COLOR CHANNELS ----
        const targetR = data[seedDataIdx];
        const targetG = data[seedDataIdx + 1];
        const targetB = data[seedDataIdx + 2];
        const targetA = data[seedDataIdx + 3];

        // ---- FILL COLOR ----
        const rgbaToUint32 = (r: number, g: number, b: number, a: number) => {
            const tmp = new Uint8ClampedArray(4);
            tmp[0] = r;
            tmp[1] = g;
            tmp[2] = b;
            tmp[3] = a;
            return new Uint32Array(tmp.buffer)[0];
        };

        const tmpCanvas = document.createElement('canvas');
        tmpCanvas.width = tmpCanvas.height = 1;
        const tctx = tmpCanvas.getContext('2d')!;
        tctx.clearRect(0, 0, 1, 1);
        tctx.fillStyle = stroke.color!;
        tctx.fillRect(0, 0, 1, 1);
        const fc = tctx.getImageData(0, 0, 1, 1).data;

        const fillColor = rgbaToUint32(fc[0], fc[1], fc[2], fc[3]);
        const blackColor = rgbaToUint32(0, 0, 0, 255);

        // ---- EARLY EXIT (exact match only here) ----
        if (pixels[seedIdx] === fillColor || pixels[seedIdx] === blackColor) {
            bctx.restore();
            return;
        }

 
        // ---- COLOR MATCH WITH TOLERANCE ----
        const TOLERANCE = 2;   //12
        //higer tolerance makes the webpage freeze on excessive use of fill bucket

        function matchesTarget(idx: number) {
            const i = idx * 4;
            return (
            Math.abs(data[i]     - targetR) <= TOLERANCE &&
            Math.abs(data[i + 1] - targetG) <= TOLERANCE &&
            Math.abs(data[i + 2] - targetB) <= TOLERANCE &&
            Math.abs(data[i + 3] - targetA) <= TOLERANCE
            );
        }

        // ---- SCANLINE FLOOD FILL ----
        const stack: { x: number; y: number }[] = [{ x: seedX, y: seedY }];

        while (stack.length) {
            const { x: sx, y: sy } = stack.pop()!;

            let x = sx;

            while (x >= 0 && matchesTarget(sy * canvasW + x)) x--;
            x++;

            let reachAbove = false;
            let reachBelow = false;

            while (x < canvasW && matchesTarget(sy * canvasW + x)) {
            pixels[sy * canvasW + x] = fillColor;
            dstPixels[sy * canvasW + x] = fillColor;

            if (sy > 0) {
                const aboveIdx = (sy - 1) * canvasW + x;
                if (matchesTarget(aboveIdx)) {
                if (!reachAbove) {
                    stack.push({ x, y: sy - 1 });
                    reachAbove = true;
                }
                } else {
                reachAbove = false;
                }
            }

            if (sy < canvasH - 1) {
                const belowIdx = (sy + 1) * canvasW + x;
                if (matchesTarget(belowIdx)) {
                if (!reachBelow) {
                    stack.push({ x, y: sy + 1 });
                    reachBelow = true;
                }
                } else {
                reachBelow = false;
                }
            }

            x++;
        }
      }


    //Expand filled area by given radius because there is a 1 pixel gap between fill and boundry 
    const expanded = new Uint32Array(pixels);
    const radius = 1;
    for (let y = 0; y < canvasH; y++) {
        for (let x = 0; x < canvasW; x++) {
            const idx = y * canvasW + x;

            if (pixels[idx] === fillColor) {
                for (let dy = -radius; dy <= radius; dy++) {
                    const ny = y + dy;
                    if (ny < 0 || ny >= canvasH) continue;

                    for (let dx = -radius; dx <= radius; dx++) {
                    const nx = x + dx;
                    if (nx < 0 || nx >= canvasW) continue;

                    expanded[ny * canvasW + nx] = fillColor;
                    dstPixels[ny * canvasW + nx] = fillColor;
                    }
                }
            }
      }
    }

    pixels.set(expanded);
    





    let startTime: number = -1;
    const duration = 600; // ms — controls animation speed

    const maxRadius = Math.hypot(
      Math.max(seedCssX, canvasW - seedCssX) * 2,
      Math.max(seedCssY, canvasH - seedCssY) * 2
    );

    function easeInCubic(t: number): number {
      return t * t;
    }

    const animate = (timestamp: number) => {
        if (startTime < 0) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeInCubic(progress);

        const radius = eased * maxRadius / 2;

        lctx.clearRect(0, 0, canvasW, canvasH);
        lctx.save();

        // 1️⃣ Draw the raw pixels
        lctx.putImageData(dstImage, 0, 0);

        // 2️⃣ Mask everything outside the circle
        lctx.globalCompositeOperation = "destination-in";
        lctx.beginPath();
        lctx.arc(seedCssX, seedCssY, radius, 0, Math.PI * 2);
        lctx.fill();

        lctx.restore();
        

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          this.isBucketAnimating = false;
          lctx.clearRect(0, 0, canvasW, canvasH);
          bctx.putImageData(image, 0, 0);
        }
      }


      setTimeout(() => {
        this.isBucketAnimating = true; 
        animate(performance.now());
      }, 0);


      // requestAnimationFrame(animate);
      bctx.restore(); 
    }
}