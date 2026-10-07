import { BoundaryBrush } from "../brushes/BoundaryBrush.js";
import { Brush } from "../brushes/Brush.js";
import { Bucket } from "../brushes/Bucket.js";
import { Crayon } from "../brushes/Crayon.js";
import { Eraser } from "../brushes/Eraser.js";
import { Glitter } from "../brushes/Glitter.js";
import { GlitterRainbow } from "../brushes/GlitterRainbow.js";
import { IBrush } from "../brushes/interface/IBrush.js";
import { Marker } from "../brushes/Marker.js";
import { Paint } from "../brushes/Paint.js";
import { SoapBubbles } from "../brushes/SoapBubble.js";
import { Spray } from "../brushes/Spray.js";
import { Sticker } from "../brushes/Sticker.js";
import { Texture } from "../brushes/Texture.js";
import { Neon } from "../brushes/Neon.js";
import { isNeonMode } from "../utils/queryParamParser.js";
interface Star {
    x: number;
    y: number;
    size: number;
    phase: number;
    speed: number;
    rotation: number;      // Current angle
    rotationSpeed: number; // Speed of spin
    type: 'flare' | 'dot' | 'diamond';
}
export class RendererManager {
    public static cssW : number = 0;
    public static cssH : number = 0;
    public static outlineImage : HTMLImageElement;

    private baseCanvasEl : HTMLCanvasElement;
    private bctx : CanvasRenderingContext2D;
    private liveCanvasEl : HTMLCanvasElement;
    private lctx : CanvasRenderingContext2D;
    private imageCanvasEl : HTMLCanvasElement;
    private ictx : CanvasRenderingContext2D;
    private glitterCanvasEl: HTMLCanvasElement;
    private glitterCtx: CanvasRenderingContext2D;

    private exportCanvas = document.createElement("canvas");
    private exportCtx = this.exportCanvas.getContext("2d")!;

    private maskBuffer: HTMLCanvasElement = document.createElement("canvas");
    private mctx: CanvasRenderingContext2D = this.maskBuffer.getContext("2d")!;
    

    private maxDevicePixels : number;
    private effectiveDPR : number = 0;

    private brushes: Record<string, IBrush>;
    public currentImagePath: string = '';
    private resizeTimeout: number | null = null;
    private starsData!: Float32Array;
    private spriteCanvas: HTMLCanvasElement | null = null;
    

    constructor(
        baseCanvasEl: HTMLCanvasElement,
        liveCanvasEl: HTMLCanvasElement,
        imageCanvasEl: HTMLCanvasElement,
        glitterCanvasEl: HTMLCanvasElement,
        maxDevicePixels = 900_000
    ) {
        const bctx = baseCanvasEl.getContext('2d');
        if (!bctx) throw new Error('Canvas 2D context not supported');

        const lctx = liveCanvasEl.getContext('2d');
        if (!lctx) throw new Error('Canvas 2D context not supported');

        const ictx = imageCanvasEl.getContext('2d');
        if (!ictx) throw new Error('Canvas 2D context not supported');

        const glitterCtx = glitterCanvasEl.getContext('2d');
        if (!glitterCtx) throw new Error('Canvas 2D context not supported');

        this.exportCanvas.width = 1600;
        this.exportCanvas.height = 900;

        this.maskBuffer.width = 1600;
        this.maskBuffer.height = 900;

        this.baseCanvasEl = baseCanvasEl;
        this.bctx = bctx;
        this.liveCanvasEl = liveCanvasEl;
        this.lctx = lctx;
        this.imageCanvasEl = imageCanvasEl;
        this.ictx = ictx;
        this.glitterCanvasEl = glitterCanvasEl;
        this.glitterCtx = glitterCtx;

        console.log(glitterCanvasEl);
        
        this.maxDevicePixels = maxDevicePixels;

        
        this.handleResize();
        this.loadOutlineImage();
        this.loadBaseImage();

        //glitter layer animation
        //2000 - POCO device(mid range) - good performance
        this.initAndAnimateGlitter(2000);


        this.brushes = {
            boundaryBrush: new BoundaryBrush(this.bctx, this.lctx, this.mctx),
            neon: new Neon(this.bctx, this.lctx, this.mctx),
            brush: new Brush(this.bctx, this.lctx, this.mctx),
            bucket: new Bucket(this.bctx, this.lctx, this.mctx),
            crayon: new Crayon(this.bctx, this.lctx, this.mctx),
            glitter: new Glitter(this.bctx, this.lctx, this.mctx),
            rainbow_glitter: new GlitterRainbow(this.bctx, this.lctx, this.mctx),
            marker: new Marker(this.bctx, this.lctx, this.mctx),
            paint: new Paint(this.bctx, this.lctx, this.mctx),
            spray: new Spray(this.bctx, this.lctx, this.mctx),
            texture: new Texture(this.bctx, this.lctx, this.mctx),
            sticker: new Sticker(this.bctx, this.lctx, this.mctx),
            soap_bubble: new SoapBubbles(this.bctx, this.lctx, this.mctx),
            eraser: new Eraser(this.bctx, this.lctx, this.mctx),
        };
    }

    private initAndAnimateGlitter = (count: number = 8000) => {
        const ctx = this.glitterCtx;
        const canvas = this.glitterCanvasEl;
        if (!ctx || !canvas) return;

        // --- STEP 1: PRE-RENDER SPRITE ATLAS ---
        if (!this.spriteCanvas) {
            this.spriteCanvas = document.createElement('canvas');
            this.spriteCanvas.width = 60;
            this.spriteCanvas.height = 20;
            const sCtx = this.spriteCanvas.getContext('2d')!;
            sCtx.fillStyle = "white";
            sCtx.strokeStyle = "white";
            sCtx.lineWidth = 2;

            // Slot 0: Dot
            sCtx.beginPath(); sCtx.arc(10, 10, 4, 0, Math.PI * 2); sCtx.fill();
            // Slot 1: Flare
            sCtx.beginPath(); sCtx.moveTo(22, 10); sCtx.lineTo(38, 10); sCtx.moveTo(30, 2); sCtx.lineTo(30, 18); sCtx.stroke();
            // Slot 2: Diamond
            sCtx.beginPath(); sCtx.moveTo(50, 4); sCtx.lineTo(56, 10); sCtx.lineTo(50, 16); sCtx.lineTo(44, 10); sCtx.closePath(); sCtx.fill();
        }

        // --- STEP 2: INIT STAR DATA (TypedArray for Performance) ---
        const STRIDE = 8; 
        if (!this.starsData || this.starsData.length !== count * STRIDE) {
            this.starsData = new Float32Array(count * STRIDE);
            const w = canvas.width || 1600;
            const h = canvas.height || 900;

            for (let i = 0; i < count; i++) {
                const idx = i * STRIDE;
                this.starsData[idx]     = Math.random() * w;           // x
                this.starsData[idx + 1] = Math.random() * h;           // y
                this.starsData[idx + 2] = Math.random() * 0.8 + 0.2;   // size
                this.starsData[idx + 3] = Math.random() * Math.PI * 2; // phase
                this.starsData[idx + 4] = 0.03 + Math.random() * 0.04; // speed
                this.starsData[idx + 5] = Math.random() * Math.PI * 2; // rotation
                this.starsData[idx + 6] = (Math.random() - 0.5) * 0.04;// rotationSpeed
                this.starsData[idx + 7] = Math.floor(Math.random() * 3); // typeIndex
            }
        }

        // --- STEP 3: THE RENDER LOOP ---
        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = 'source-over';
            
            const time = Date.now() * 0.05;
            const data = this.starsData;
            const sprite = this.spriteCanvas!;
            const total = data.length;

            for (let i = 0; i < total; i += STRIDE) {
                const pulse = Math.sin(time * data[i + 4] + data[i + 3]);
                const opacity = 0.4 + pulse * 0.6;

                if (opacity < 0.1) continue;

                const scale = data[i + 2] * (0.7 + pulse * 0.5);
                data[i + 5] += data[i + 6]; // Update rotation in the TypedArray

                ctx.globalAlpha = opacity;
                ctx.setTransform(scale, 0, 0, scale, data[i], data[i + 1]);
                ctx.rotate(data[i + 5]);

                ctx.drawImage(
                    sprite, 
                    data[i + 7] * 20, 0, 20, 20,
                    -10, -10, 20, 20
                );
            }

            // --- STEP 4: MASKING & RESET ---
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.globalCompositeOperation = 'destination-in';
            ctx.globalAlpha = 1.0;

            if (this.maskBuffer) {
                ctx.drawImage(this.maskBuffer, 0, 0);
            }

            ctx.globalCompositeOperation = 'source-over';
            requestAnimationFrame(render);
        };

        render();
    };
    
    private handleResize() {
        window.addEventListener("resize", () => {
            if (this.resizeTimeout !== null) {
                clearTimeout(this.resizeTimeout);
            }

            this.resizeTimeout = window.setTimeout(() => {
                this.resize();
                this.resizeTimeout = null;
            }, 100);
        });

        this.resize();
    }

    private resize() {
        const W = window.innerWidth;
        const H = window.innerHeight;
        const ratio = 16 / 9;

        // UI space adjustments: in neon mode, buttons on left (8.5vw) and color dock on right (11vw)
        const leftPadding = isNeonMode ? W * 0.085 : W * 0.075;
        const rightPadding = isNeonMode ? W * 0.11 : W * 0.191;
        const availableWidth = W - leftPadding - rightPadding;
        const maxH = isNeonMode ? H * 0.90 : H;

        // Fit 16:9 canvas inside remaining area
        let cssW = availableWidth;
        let cssH = cssW / ratio;

        if (cssH > maxH) {
            cssH = maxH;
            cssW = cssH * ratio;
        }

        cssW = Math.max(1, Math.floor(cssW));
        cssH = Math.max(1, Math.floor(cssH));

        // Center horizontally within available area between leftPadding and rightPadding
        const extraHorizontalSpace = Math.max(0, availableWidth - cssW);
        const finalLeft = isNeonMode
            ? Math.floor(leftPadding + (extraHorizontalSpace / 2))
            : Math.floor(leftPadding);

        // === DPR logic (UNCHANGED) ===
        const DPR = window.devicePixelRatio || 1;
        const maxDpr = Math.sqrt(this.maxDevicePixels / (cssW * cssH));
        this.effectiveDPR = Math.max(1, Math.min(DPR, maxDpr));

        const scaledW = cssW * this.effectiveDPR;
        const scaledH = cssH * this.effectiveDPR;

        // Helper: snapshot → resize → restore
        const resizeCanvas = (
            canvas: HTMLCanvasElement,
            ctx: CanvasRenderingContext2D,
            backingScale: number
        ) => {
            // Save contents
            const snapshot = document.createElement("canvas");
            snapshot.width = canvas.width;
            snapshot.height = canvas.height;
            snapshot.getContext("2d")!.drawImage(canvas, 0, 0);

            // Resize (clears canvas)
            canvas.width = scaledW * backingScale;
            canvas.height = scaledH * backingScale;
            canvas.style.width = `${cssW}px`;
            canvas.style.height = `${cssH}px`;
            canvas.style.left = `${finalLeft}px`;
            canvas.style.right = `${rightPadding}px`;
            canvas.style.top = `50%`;
            canvas.style.transform = `translateY(-50%)`;

            // Restore transform + state
            ctx.setTransform(
                this.effectiveDPR * backingScale,
                0,
                0,
                this.effectiveDPR * backingScale,
                0,
                0
            );
            ctx.lineJoin = ctx.lineCap = "round";

            // Restore contents (IMPORTANT PART)
            ctx.drawImage(
                snapshot,
                0,
                0,
                snapshot.width,
                snapshot.height,
                0,
                0,
                cssW,
                cssH
            );
        };

        // === BASE CANVAS ===
        resizeCanvas(this.baseCanvasEl, this.bctx!, 1);

        // === LIVE CANVAS ===
        resizeCanvas(this.liveCanvasEl, this.lctx!, 1);

        resizeCanvas(this.maskBuffer, this.mctx, 1);

        resizeCanvas(this.glitterCanvasEl, this.glitterCtx!, 1);

        // === IMAGE CANVAS (2× backing store) ===
        resizeCanvas(this.imageCanvasEl, this.ictx!, 2);

        // Save CSS size (used everywhere else)
        RendererManager.cssW = cssW;
        RendererManager.cssH = cssH;
    }

    private loadOutlineImage() {
        const image = new Image();

        const params = new URLSearchParams(window.location.search);
        const imagePath = params.get("imagePath");
        
        const resolvedPath = imagePath || (isNeonMode ? 'assets/coloring-pages/neon/neon_00.png' : 'assets/coloring-pages/sports/sports_00.png');
        this.currentImagePath = resolvedPath;

        image.onload = () => {
            console.log("Image loaded successfully:", resolvedPath);
            RendererManager.outlineImage = image;
            if (!this.ictx) return;
            if (RendererManager.cssW == null || RendererManager.cssH == null) return;

            const dpr = this.effectiveDPR;
            const cssW = RendererManager.cssW;
            const cssH = RendererManager.cssH;

            // IMPORTANT: imageCanvas is 2× backing store
            this.ictx.setTransform(dpr * 2, 0, 0, dpr * 2, 0, 0);
            this.ictx.clearRect(0, 0, cssW, cssH);

            const imgRatio = image.width / image.height;
            const canvasRatio = cssW / cssH;

            let drawW: number;
            let drawH: number;

            if (imgRatio > canvasRatio) {
                drawW = cssW;
                drawH = cssW / imgRatio;
            } else {
                drawH = cssH;
                drawW = cssH * imgRatio;
            }

            const dx = (cssW - drawW) / 2;
            const dy = (cssH - drawH) / 2;

            this.ictx.drawImage(image, dx, dy, drawW, drawH);
        };

        image.onerror = () => {
            console.error("Failed to load image:", resolvedPath);
        };

        image.src = resolvedPath;
        if (image.complete && image.naturalWidth > 0) {
            image.onload(new Event('load'));
        }
    }

    private loadBaseImage() {
        if (isNeonMode) return;
        const image = new Image();
        //console.log(window.location.search);
        //this will be passed by unity, that which picture is clicked in main menu.
        //image.src = 'assets/coloring_pages/halloween_0.png';

        const params = new URLSearchParams(window.location.search);
        // const imagePath = params.get("imagePath");
        
        //test, not loaded from unity
        // if(imagePath == null) {
        //     image.src = 'assets/coloring_pages/halloween_draw_0.png'
        // }

        const filePath = this.currentImagePath;
        
        //replaces dinosaur_0.png -> dinosaur_draw_0.png
        const output = filePath.replace(
            /(\w+)_([0-9]+)\.png$/,
            "$1_draw_$2.png"
        );
        
        image.src = output;

        image.onload = () => {
            if (!this.bctx) return;
            if (RendererManager.cssW == null || RendererManager.cssH == null) return;

            const cssW = RendererManager.cssW;
            const cssH = RendererManager.cssH;

            this.bctx.clearRect(0, 0, cssW, cssH);

            const imgRatio = image.width / image.height;
            const canvasRatio = cssW / cssH;

            let drawW: number;
            let drawH: number;

            if (imgRatio > canvasRatio) {
                drawW = cssW;
                drawH = cssW / imgRatio;
            } else {
                drawH = cssH;
                drawW = cssH * imgRatio;
            }

            const dx = (cssW - drawW) / 2;
            const dy = (cssH - drawH) / 2;

            this.bctx.drawImage(image, dx, dy, drawW, drawH);
        }

        image.onerror = () => {
            console.error("Failed to load image");
        };
    }

    public getBrush(brush: string): IBrush {
        return this.brushes[brush];
    };

    public getBaseBlob(): Promise<Blob> {
        return new Promise((resolve) => {
            const ctx = this.exportCtx;

            // Clear
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, 1600, 900);

            // Draw the BASE canvas into fixed 1600×900
            ctx.drawImage(
                this.baseCanvasEl,
                0,
                0,
                this.baseCanvasEl.width,
                this.baseCanvasEl.height,
                0,
                0,
                1600,
                900
            );

            this.exportCanvas.toBlob((blob) => {
                resolve(blob!);
            }, "image/png");
        });
    }

    public getBaseCanvas(): HTMLCanvasElement {
        return this.baseCanvasEl;
    }

    public clearBaseCanvas(): void {
        this.bctx?.clearRect(0, 0, RendererManager.cssW, RendererManager.cssH);
        this.mctx?.clearRect(0, 0, RendererManager.cssW, RendererManager.cssH);
    }
}