import { setLockStatus, toolState } from "../state.js";
import { toolsUnlocked, gameMusic, gameSound, language, parental } from "../utils/queryParamParser.js";
import { DrawInputManager } from "./DrawInputManager.js";
import { RendererManager as RenderManager } from "./RenderManager.js";
import { SoundManager } from "./SoundManager.js";
import { UiManager } from "./UiManager.js";
import { SplatterLoader } from "./LoadingOverlay.js";

export class App {
    public static render: RenderManager;
    public static drawInput: DrawInputManager;
    public static ui: UiManager;
    public static sound: SoundManager;
    public static loading: SplatterLoader;

    private baseCanvas: HTMLCanvasElement;
    private liveCanvas: HTMLCanvasElement;
    private imageCanvas: HTMLCanvasElement;
    private glitterCanvas: HTMLCanvasElement;

    private TIME_TO_LOCK_MS = 22000;    //20,000

    constructor(
        wrap: HTMLElement,
        baseCanvas: HTMLCanvasElement,
        liveCanvas: HTMLCanvasElement,
        imageCanvas: HTMLCanvasElement,
        glitterCanvas: HTMLCanvasElement
    ) {
        this.baseCanvas = baseCanvas;
        this.liveCanvas = liveCanvas;
        this.imageCanvas = imageCanvas;
        this.glitterCanvas = glitterCanvas;
    }

    public start() {
        this.initRenderManager();
        this.initInputManager();
        this.initSoundManager();
        this.initUiManager();

        this.lockContentAfterSomeTime();
        this.playInitialVoiceOver();


        // console.log("toolsUnlocked: " + toolsUnlocked);
        // console.log("gameSound: " + gameSound);
        // console.log("gameMusic: " + gameMusic);
        // console.log("parental: " + parental);
        // console.log("language: " + language);

        App.loading = new SplatterLoader('loading', 'loadingCanvas');
        App.loading.show();

        setTimeout(() => {
            App.loading.hide();
        }, 2500);
    }


    private initRenderManager() {
        App.render = new RenderManager(
            this.baseCanvas,
            this.liveCanvas,
            this.imageCanvas,
            this.glitterCanvas
        );
    }

    private initInputManager() {
        // 1. Grab the container
        const container = document.getElementById('canvas-container') as HTMLElement;
        
        // 2. Pass it as the second argument
        App.drawInput = new DrawInputManager(this.liveCanvas, container);
    }

    private initUiManager() {
        App.ui = new UiManager();
    }

    private initSoundManager() {
        App.sound = new SoundManager();
    }

    private lockContentAfterSomeTime(){
        setTimeout(() => {
            if(!toolsUnlocked){
                setLockStatus('paint', true);
                setLockStatus('glitter', true);
                setLockStatus('rainbow_glitter', true);
                setLockStatus('spray', true);
                setLockStatus('texture', true);
                setLockStatus('sticker', true);
            }    
        }, this.TIME_TO_LOCK_MS); 
    }

    private playInitialVoiceOver()
    {
        if(!parental){
            return;
        }

        setTimeout(() => {
            const voiceLines: string[] = [
                App.sound.coloringBookVo,
                App.sound.letsColorVo
            ];

            const randomIndex = Math.floor(Math.random() * voiceLines.length);
            const selectedSound = voiceLines[randomIndex];

            App.sound.PlaySFX(selectedSound, 0, false);
        }, 1000);
    }
}