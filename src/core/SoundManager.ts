import { toolsUnlocked, gameMusic, gameSound, language, parental } from "../utils/queryParamParser.js";
export class SoundManager {
    // --- Configuration ---
    public sfxVolume: number = 1.0;
    public isSoundEnabled: boolean = true;

    // --- Active Sound Tracking (For StopAllSFX) ---
    private activeSounds: Set<HTMLAudioElement> = new Set();


    // --- SFX Paths ---
    public coloringBookVo: string = "assets/sfx/vo/Coloring book.mp3";
    public letsColorVo: string = "assets/sfx/vo/Lets color.mp3";
    public lovelyVo: string = "assets/sfx/vo/Lovely.mp3";
    public thatwasAwesomeVo: string = "assets/sfx/vo/That was awesome.mp3";
    public thatsGreatVo: string = "assets/sfx/vo/Thats Great.mp3";
    public thatsSuperFunVo: string = "assets/sfx/vo/Thats super fun.mp3";
    public wonderFullVo: string = "assets/sfx/vo/Wonderful.mp3";
    public woow: string = "assets/sfx/vo/Wooow.mp3";

    public effect1: string = "assets/sfx/effects1.mp3";
    public effect2: string = "assets/sfx/effects2.mp3";

    public bin: string = "assets/sfx/bin.mp3";
    public brush: string = "assets/sfx/Brushing.ogg";
    public buttonClick: string = "assets/sfx/button.ogg";
    public glitter: string = "assets/sfx/glitter.ogg";
    public bucket: string = "assets/sfx/bucket.mp3";
    public painting: string = "assets/sfx/painting.ogg";
    public spray: string = "assets/sfx/Spray.ogg";
    public pattern: string = "assets/sfx/pattern.ogg";
    public bubbles: string = "assets/sfx/Bubbling.ogg";
    public puck: string = "assets/sfx/puck.wav";


    constructor() {
        // Optional: Pre-fill paths here or load from a config
        // this.buttonClick1 = "assets/sfx/click.mp3";
        
        console.log(gameSound);
        // this.isSoundEnabled = gameSound; 
        
        this.isSoundEnabled = true; 
    }

    public UpdateSfxState(isEnabled: boolean): void {
        this.isSoundEnabled = isEnabled;
        
        // If disabled, stop currently playing loops or long sounds
        if (!this.isSoundEnabled) {
            this.StopAllSFX();
        }
    }

    public PlaySFX(clipPath: string, delay: number = 0, loop: boolean = false): void {
        // 1. Validation
        if (!this.isSoundEnabled || !clipPath || clipPath === "") {
            if (!clipPath) console.warn("SoundManager: Clip path is empty/null");
            return;
        }

        // 2. Create Audio Object
        const audio = new Audio(clipPath);
        audio.volume = this.sfxVolume;
        audio.loop = loop;

        // 3. Track logic (so we can stop it later)
        this.activeSounds.add(audio);

        // Remove from tracking when finished

        audio.onended = () => {
            this.activeSounds.delete(audio);
        };

        // 4. Play with Delay logic
        if (delay > 0) {
            setTimeout(() => {
                // Check if sound is still enabled after the delay
                if (this.isSoundEnabled) {
                    audio.play().catch(e => console.log("Audio play blocked/failed", e));
                }
            }, delay * 1000); // Convert seconds to ms
        } else {
            audio.play().catch(e => console.log("Audio play blocked/failed", e));
        }
    }


    public StopSFX(clipPath: string): void {
        this.activeSounds.forEach(audio => {
            // Check if the source URL contains the clipPath
            if (audio.src.includes(clipPath)) {
                audio.pause();
                audio.currentTime = 0;
                this.activeSounds.delete(audio);
            }
        });
    }

    public StopAllSFX(): void {
        this.activeSounds.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        this.activeSounds.clear();
    }
}