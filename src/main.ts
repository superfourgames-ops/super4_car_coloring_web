import { App } from './core/App.js';

const wrap = document.getElementById('wrap') as HTMLElement;
const baseCanvas = document.getElementById('baseCanvas') as HTMLCanvasElement;
const liveCanvas = document.getElementById('liveCanvas') as HTMLCanvasElement;
const imageCanvas = document.getElementById('imageCanvas') as HTMLCanvasElement;
const glitterCanvas = document.getElementById('glitterCanvas') as HTMLCanvasElement;
const application = new App(wrap, baseCanvas, liveCanvas, imageCanvas, glitterCanvas);
application.start();