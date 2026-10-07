import { isNeonMode } from "./utils/queryParamParser.js";

export interface AppState {
  tool: string;
  color?: string;
  colorId?: string;
  stickerId?: string;
  textureId?: string;
  locked?: boolean;
}

/* ============================= State ============================= */

export const toolState: Record<string, AppState> = {
  neon: { tool: 'neon', color: 'rainbow', colorId: 'rainbow', locked: false },
  marker: { tool: 'marker', color: '#DA4527', colorId: 'DA4527', locked: false },
  crayon: { tool: 'crayon', color: '#9000D3', colorId: '9000D3', locked: false },
  bucket: { tool: 'bucket', color: '#FFA500', colorId: '#FFA500', locked: false },
  brush: { tool: 'brush', color: '#FFFF00', colorId: 'FFFF00', locked: false },
  paint: { tool: 'paint', color: '#00FF00', colorId: '00FF00', locked: false },
  glitter: { tool: 'glitter', color: '#008080', colorId: '008080', locked: false },
  rainbow_glitter: { tool: 'rainbow_glitter', locked: false },
  spray: { tool: 'spray', color: '#3BC8FF', colorId: '3BC8FF', locked: false },
  texture: { tool: 'texture', textureId: 'texture0', locked: false },
  sticker: { tool: 'sticker', stickerId: 'sticker80', locked: false },
  soap_bubble: { tool: 'soap_bubble', locked: false },
  eraser: { tool: 'eraser', locked: false },
};

let currentTool: AppState = isNeonMode ? toolState.neon : toolState.marker;

export const listeners: Set<(state: AppState) => void> = new Set();

export type BrushSize = 'small' | 'medium' | 'large';
let currentBrushSize: BrushSize = 'small';

export function getBrushSize(): BrushSize {
  return currentBrushSize;
}

export function setBrushSize(size: BrushSize): void {
  currentBrushSize = size;
}

/* ============================= Actions ============================= */


export function setTool(tool: string): void {
  currentTool = toolState[tool];
  notify();
}

export function setColor(color: string, colorId: string): void {
  currentTool.color = color;
  currentTool.colorId = colorId;
  notify();
}

export function setSticker(sticker: string): void {
  currentTool.stickerId = sticker;
  notify();
}

export function setTexture(texture: string): void {
  currentTool.textureId = texture;
  notify();
}

export function setLockStatus(tool: string, locked: boolean): void {
  toolState[tool].locked = locked;

  if(tool === currentTool.tool) {
      
  }
  
  notify();
}

export function getCurrentTool(): AppState {
  return currentTool;
}
/* ============================= Internal ============================= */


function notify(): void {
  listeners.forEach(fn => fn(currentTool));
}

/* ============================= Subscription ============================= */

export function subscribe(fn: (state: AppState) => void): () => void {
  listeners.add(fn);
  fn(currentTool); // initial sync

  // optional unsubscribe (good practice)
  return () => {
    listeners.delete(fn);
  };
}

/* TODO:
   make state of color for each tool
*/
