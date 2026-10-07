import { IBrush } from "../brushes/interface/IBrush.js";
import { Point } from "../models/Point.js";
import { Stroke } from "../models/Stroke.js";
import { AppState, getCurrentTool, getBrushSize as getGlobalBrushSize, subscribe } from "../state.js";
import { App } from "./App.js";
import { RendererManager } from "./RenderManager.js";
import { isNeonMode } from "../utils/queryParamParser.js";
import { Neon } from "../brushes/Neon.js";

interface Action {
    brush:  IBrush;
    stroke: Stroke;
}

export class DrawInputManager {
    private liveCanvas: HTMLCanvasElement;
    private container: HTMLElement;
    private current: Action | null = null;
    private currentBrush: IBrush;
    
    // --- New variables for Pan/Zoom ---
    private activePointers = new Map<number, PointerEvent>();
    private scale = 1;
    private panX = 0;
    private panY = 0;
    private startScale = 1;
    private startPanX = 0;
    private startPanY = 0;
    private startPinchDist = 0;
    private startMidX = 0;
    private startMidY = 0;

    constructor(liveCanvas: HTMLCanvasElement, container: HTMLElement) {
        this.liveCanvas = liveCanvas;
        this.container = container;
        this.currentBrush = App.render.getBrush(isNeonMode ? 'neon' : 'brush');

        this.liveCanvas.addEventListener('pointerdown', (e: PointerEvent) => {
            this.liveCanvas.setPointerCapture(e.pointerId);
            this.activePointers.set(e.pointerId, e);

            // 2 FINGERS: Start Zoom/Pan
            if (this.activePointers.size === 2) {
                this.current = null; // Stop drawing
                
                // --- THE FIX: Erase the accidental dot from the first finger ---
                App.sound.StopAllSFX(); 
                this.clearLiveCanvas(); 
                // ---------------------------------------------------------------

                const pts = Array.from(this.activePointers.values());
                this.startPinchDist = Math.hypot(pts[1].clientX - pts[0].clientX, pts[1].clientY - pts[0].clientY);
                this.startMidX = (pts[0].clientX + pts[1].clientX) / 2;
                this.startMidY = (pts[0].clientY + pts[1].clientY) / 2;
                this.startScale = this.scale;
                this.startPanX = this.panX;
                this.startPanY = this.panY;
                return;
            }

            // 1 FINGER: Start Drawing
            if (this.activePointers.size === 1) {
                const brush = isNeonMode ? App.render.getBrush('neon') : this.currentBrush;
                const activeColor = getCurrentTool().color;
                const isRainbow = !activeColor || activeColor === 'rainbow';
                const color = (isNeonMode && isRainbow) ? Neon.getNextColor() : (activeColor || '#FFFF00');
                this.current = {
                    brush: brush,
                    stroke: {
                        color: color,
                        size: this.getBrushSize(),
                        points: [this.getPos(e)],
                        particles: [],
                        stickerId: getCurrentTool().stickerId,
                        textureId: getCurrentTool().textureId,
                        bubbles: [],
                        addPoint: function (p: Point): void {
                            throw new Error("Function not implemented.");
                        }
                    },
                };
                this.current.stroke.points.push(this.getPos(e));
                brush.drawOnPointerDown(this.current.stroke);
            }
        });

        this.liveCanvas.addEventListener('pointermove', (e: PointerEvent) => {
            if (!this.activePointers.has(e.pointerId)) return;
            this.activePointers.set(e.pointerId, e);

            // 2 FINGERS: Update Zoom/Pan
            if (this.activePointers.size === 2) {
                const pts = Array.from(this.activePointers.values());
                const currentDist = Math.hypot(pts[1].clientX - pts[0].clientX, pts[1].clientY - pts[0].clientY);
                const currentMidX = (pts[0].clientX + pts[1].clientX) / 2;
                const currentMidY = (pts[0].clientY + pts[1].clientY) / 2;

                // Calculate Scale (Clamp between 1x and 4x)
                let newScale = this.startScale * (currentDist / this.startPinchDist);
                newScale = Math.max(1, Math.min(newScale, 4));

                // Calculate Pan
                const scaleRatio = newScale / this.startScale;
                let newPanX = currentMidX - (this.startMidX - this.startPanX) * scaleRatio;
                let newPanY = currentMidY - (this.startMidY - this.startPanY) * scaleRatio;

                // --- NEW: CLAMP PAN TO SCREEN BOUNDARIES ---
                // The container size is based on the window size.
                const minX = window.innerWidth * (1 - newScale);
                const minY = window.innerHeight * (1 - newScale);

                // Math.max/min combination forces the value to stay between min and 0.
                newPanX = Math.max(minX, Math.min(newPanX, 0));
                newPanY = Math.max(minY, Math.min(newPanY, 0));
                // -------------------------------------------

                this.scale = newScale;
                this.panX = newPanX;
                this.panY = newPanY;

                // Apply CSS Transform
                this.container.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.scale})`;
                return;
            }

            // 1 FINGER: Update Drawing
            if (this.activePointers.size === 1 && this.current) {
                this.current.stroke.points.push(this.getPos(e));
                this.current.brush.drawOnPointerMove(this.current.stroke);
            }
        });

        const onPointerUp = (e: PointerEvent) => {
            this.liveCanvas.releasePointerCapture(e.pointerId);
            this.activePointers.delete(e.pointerId);

            // If we finish drawing
            if (this.current && this.activePointers.size === 0) {
                this.current.brush.drawOnPointerUp(this.current.stroke);
                this.current = null;
            }
        };

        this.liveCanvas.addEventListener('pointerup', onPointerUp);
        this.liveCanvas.addEventListener('pointercancel', onPointerUp);

        subscribe(({ tool }: AppState) => {
            this.currentBrush = App.render.getBrush(tool);
        });
    }

    private getPos(e: PointerEvent): Point {
        const r = this.liveCanvas.getBoundingClientRect();
        return [
            (e.clientX - r.left) / this.scale, 
            (e.clientY - r.top) / this.scale
        ];
    }

    private getBrushSize(): number {
        const base = Math.min(RendererManager.cssW ?? 0, RendererManager.cssH ?? 0);
        let brushSize: string = getGlobalBrushSize();

        // Direct DOM fallback guaranteed to match whatever size class the button currently has
        const sizeEl = document.getElementById('size');
        if (sizeEl) {
            if (sizeEl.classList.contains('large')) brushSize = 'large';
            else if (sizeEl.classList.contains('medium')) brushSize = 'medium';
            else if (sizeEl.classList.contains('small')) brushSize = 'small';
        }

        if (isNeonMode) {
            switch (brushSize) {
                case 'small': return Math.max(14, base * 0.022);
                case 'medium': return Math.max(22, base * 0.034);
                case 'large': return Math.max(32, base * 0.048);
                default: return Math.max(14, base * 0.022);
            }
        }

        switch (brushSize) {
            case 'xsmall': return base * 0.006;
            case 'small': return base * 0.015;
            case 'medium': return base * 0.03;
            case 'large': return base * 0.05;
        }

        return base * 0.03;
    }

    private clearLiveCanvas() {
        const ctx = this.liveCanvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, this.liveCanvas.width, this.liveCanvas.height);
        }
    }
}