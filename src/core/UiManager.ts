import { AppState, setColor, setSticker, setTexture, setTool, subscribe, toolState, setBrushSize, getCurrentTool } from "../state.js";
import { applyTextureToElementTextureTool, textureConfettiLight, textureDiagonalPopins, textureVibrantHeart, texturePolkaDots, textureClouds, TextureFn, textures } from "../textures.js";
import { uploadImage } from "../upload.js";
import { toolsUnlocked, parental, adsFree, gameplayInterstitialInterval, isNeonMode } from "../utils/queryParamParser.js";
import { App } from "./App.js";
import { ParentalOverlayManager } from "./ParentalOverlayManager.js";
import { SoundManager } from "./SoundManager.js";

export class UiManager {
    private tools: string[] = ['marker', 'crayon', 'bucket', 'brush', 'paint', 'glitter', 'rainbow_glitter', 'spray', 'texture', 'sticker', 'soap_bubble', 'eraser'];
    private colors: Record<string, string> = {
        // Reds & Pinks
        '8B0000': '#8B0000',
        'C6121F': '#C6121F',
        'DA4527': '#DA4527',
        'BE3926': '#BE3926',
        'DC143C': '#DC143C',
        'FF0000': '#FF0000',
        'F41972': '#F41972',
        'FF69B4': '#FF69B4',
        'FFC0CB': '#FFC0CB',
        'FA8072': '#FA8072',

        // Purples & Magentas
        'FF00FF': '#FF00FF',
        '930F58': '#930F58',
        '800080': '#800080',
        '9000D3': '#9000D3',
        '4B0082': '#4B0082',
        '5435A0': '#5435A0',
        '42288C': '#42288C',
        '8E4585': '#8E4585',
        '9966CC': '#9966CC',
        'CC76FF': '#CC76FF',
        'EE82EE': '#EE82EE',
        'E0B0FF': '#E0B0FF',
        'C8A2C8': '#C8A2C8',

        // Blues & Teals
        '000080': '#000080',
        '1B35A5': '#1B35A5',
        '0000FF': '#0000FF',
        '2045BC': '#2045BC',
        '4169E1': '#4169E1',
        '085BAF': '#085BAF',
        '117DCE': '#117DCE',
        '3BC8FF': '#3BC8FF',
        '87CEEB': '#87CEEB',
        '00FFFF': '#00FFFF',
        '40E0D0': '#40E0D0',
        '00C4D3': '#00C4D3',
        '009DA5': '#009DA5',
        '008080': '#008080',

        // Greens
        '06493C': '#06493C',
        '046656': '#046656',
        '115B26': '#115B26',
        '228B22': '#228B22',
        '17C61A': '#17C61A',
        '00FF00': '#00FF00',
        '50C878': '#50C878',
        '77C117': '#77C117',
        '98FB98': '#98FB98',

        // Yellows & Oranges
        'A39F21': '#A39F21',
        'FFFF00': '#FFFF00',
        'FFD700': '#FFD700',
        'FFA500': '#FFA500',
        'FF8C00': '#FF8C00',
        'EF6D22': '#EF6D22',
        'E85E00': '#E85E00',
        'FF7F50': '#FF7F50',
        'FBCEB1': '#FBCEB1',

        // Browns & Skin Tones
        '552200': '#552200',
        '3D2314': '#3D2314',
        '704214': '#704214',
        '8B4513': '#8B4513',
        '6D4D42': '#6D4D42',
        '8D5524': '#8D5524',
        'C68642': '#C68642',
        'D2691E': '#D2691E',
        'D2B48C': '#D2B48C',
        'C2B280': '#C2B280',
        'F1C27D': '#F1C27D',
        'FFFDD0': '#FFFDD0',

        // Monochromes (Grayscale)
        'FFFFFF': '#FFFFFF',
        'F5F5DC': '#F5F5DC',
        'E6E6FA': '#E6E6FA',
        'C0C0C0': '#C0C0C0',
        '808080': '#808080',
        '708090': '#708090',
        '36454F': '#36454F',
        '000000': '#000000'
    };


    private totalStickers: number = 81;
    private totalTextures: number = 0;
    private brushSize: string = "small";
    private adTimer: number = 0;
    private adInterval: any;

    constructor() {
        if (!adsFree) {
            this.startAdTimer();
        }
        this.totalTextures = Object.keys(textures).length;
        const overlay = ParentalOverlayManager.getInstance();
        const HOLD_DURATION = 3; 

        if (isNeonMode) {
            document.body.classList.add('mode-neon');
            setTool('neon');
        } 

        // Click Listeners to Tools
        for (let i = 0; i < this.tools.length; i++) {
            const tool = this.tools[i];
            const toolElement = document.getElementById(tool) as HTMLButtonElement;

            // Variables to track movement to distinguish between a "messy click" and a "scroll"
            let startX = 0;
            let startY = 0;
            const MOVEMENT_THRESHOLD = 10; // Pixels

            // Normal click logic
            const onClick = () => {
                if (toolState[tool].locked && !toolsUnlocked) return;
                App.sound.PlaySFX(App.sound.puck, 0, false);
                setTool(tool);
            };

            toolElement.addEventListener('pointerdown', (e) => {
                // e.preventDefault();
                startX = e.clientX;
                startY = e.clientY;

                if (toolState[tool].locked && !toolsUnlocked) {
                    // Tell the manager to handle the hold
                    overlay.startHold(HOLD_DURATION, () => {
                        App.loading.show();
                        this.uploadImage().then(() => {
                            setTimeout(() => {
                                window.location.href = 'unity://purchase';
                            }, 1000);
                        });
                    });
                }
            });

            // Detect if the user moves their finger (Scrolling)
            toolElement.addEventListener('pointermove', (e) => {
                // Calculate how far the finger moved
                const diffX = Math.abs(e.clientX - startX);
                const diffY = Math.abs(e.clientY - startY);

                // If moved more than threshold, assume user is scrolling/dragging, not holding
                if (diffX > MOVEMENT_THRESHOLD || diffY > MOVEMENT_THRESHOLD) {
                    overlay.stopHold();
                }
            });

            // IMPORTANT: This event fires if the browser takes over interaction (e.g. native scroll starts)
            toolElement.addEventListener('pointercancel', () => {
                overlay.stopHold();
            });

            // Tell the manager to cancel if user lifts finger
            toolElement.addEventListener('pointerup', () => overlay.stopHold());
            toolElement.addEventListener('pointerleave', () => overlay.stopHold());
            
            toolElement.addEventListener('click', onClick);

            toolElement.addEventListener('contextmenu', (e) => {
                e.preventDefault(); // Disables the right-click menu
            });
        }

        

        const handleColorSelect = (id: string, hex: string) => {
            App.sound.PlaySFX(App.sound.buttonClick, 0, false);
            if (isNeonMode && getCurrentTool().colorId === id) {
                setColor('rainbow', 'rainbow');
            } else {
                this.onColorButtonChanged(id);
                setColor(hex, id);
            }
        };

        //Click Listeners to Colors
        (Object.entries(this.colors) as [string, string][]).forEach(
          ([id, hex]) => {
            const colorElement = document.getElementById(id) as HTMLButtonElement;
            if (colorElement) {
                colorElement.addEventListener('click', () => handleColorSelect(id, hex));
            }
          }
        );

        //Click Listeners to Stickers
        for(let i = 0; i < this.totalStickers; i++) {
            const stickerId = `sticker${i}`;

            const stickerElement = document.getElementById(stickerId) as HTMLButtonElement;
            stickerElement.addEventListener('click', () => {
                App.sound.PlaySFX(App.sound.buttonClick, 0, false);
                setSticker(stickerId);
            });
        }


        //Click Listeners to Textures
        for(let i = 0; i < this.totalTextures; i++) {
            const textureId = `texture${i}`;

            const stickerElement = document.getElementById(textureId) as HTMLButtonElement;
            stickerElement.addEventListener('click', () => {
                App.sound.PlaySFX(App.sound.buttonClick, 0, false);
                setTexture(textureId);
            });
        }


        



        subscribe(({ tool, color, colorId, stickerId, textureId }: AppState) => {
            // react to tool change
            // sound.PlaySFX(sound.buttonClick1, 0, false);

            document.querySelectorAll<HTMLButtonElement>('.tool-button').forEach(btn => {
                const isActive = btn.id === tool;
            
                btn.classList.toggle('locked', toolState[btn.id].locked === true);
                btn.classList.toggle('active', isActive);

            });

            const btn = document.getElementById(tool) as HTMLButtonElement; 

            switch(tool)
            {
                case 'crayon':
                    btn.style.setProperty('--crayon-color', color!);
                    this.showPallete('colors');
                    this.onColorButtonChanged(colorId!);
                    break;
                case 'marker':
                    btn.style.setProperty('--marker-color', color!);
                    this.showPallete('colors');
                    this.onColorButtonChanged(colorId!);
                    break;
                case 'bucket':
                    btn.style.setProperty('--bucket-color', color!);
                    this.showPallete('colors');
                    this.onColorButtonChanged(colorId!);
                    break;
                case 'brush':
                    btn.style.setProperty('--brush-color', color!);
                    this.showPallete('colors');
                    this.onColorButtonChanged(colorId!);
                    break;
                case 'paint':
                    btn.style.setProperty('--paint-color', color!);
                    this.showPallete('colors');
                    this.onColorButtonChanged(colorId!);
                    break;
                case 'rainbow_glitter':
                    this.showPallete('none');
                    break;
                case 'glitter':
                    btn.style.setProperty('--glitter-color', color!);
                    this.showPallete('colors');
                    this.onColorButtonChanged(colorId!);
                    break;
                case 'spray':
                    btn.style.setProperty('--spray-color', color!);
                    this.showPallete('colors');
                    this.onColorButtonChanged(colorId!);
                    break;
                case 'texture':
                    //btn.style.setProperty('--texture-color', color);
                    this.showPallete('textures');
                    this.onTextureButtonChanged(textureId!);
                    break;
                case 'sticker':
                    //btn.style.setProperty('--sticker-color', color);
                    this.showPallete('stickers');
                    this.onStickerButtonChanged(stickerId!);
                    break;
                case 'soap_bubble':
                    this.showPallete('none');
                break;
                case 'eraser':
                    this.showPallete('none');
                    break;
                case 'neon':
                    this.showPallete('colors');
                    this.onColorButtonChanged(colorId && colorId !== 'rainbow' ? colorId : '');
                    break;
            }
        });


        (window as any).onAndroidBack = () => {
            // alert('Back pressed in Web App');
            this.onHomeButtonClicked();
        };


        //Add Listener to home button
        const homeEl = document.getElementById('home') as HTMLButtonElement;
        homeEl.addEventListener('click', () => {
            App.sound.PlaySFX(App.sound.buttonClick, 0, false);
            this.onHomeButtonClicked();
        });

        const binEl = document.getElementById('bin') as HTMLButtonElement;
        binEl.addEventListener('click', () => {
            App.sound.PlaySFX(App.sound.buttonClick, 0, false);
            App.sound.PlaySFX(App.sound.bin, 0, false);
            App.render.clearBaseCanvas();
        });


        const sizeBtn = document.getElementById("size") as HTMLButtonElement;
        const sizes = ["small", "medium", "large"] as const;
        let index = 0;

        sizeBtn.classList.remove("xsmall", "small", "medium", "large");
        sizeBtn.classList.add(sizes[index]);
        setBrushSize(sizes[index]);

        const cycleSize = (e?: Event) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            App.sound.PlaySFX(App.sound.buttonClick, 0, false);
            sizeBtn.classList.remove("xsmall", "small", "medium", "large");
            index = (index + 1) % sizes.length;
            this.brushSize = sizes[index];
            setBrushSize(sizes[index]);
            sizeBtn.classList.add(sizes[index]);
        };

        sizeBtn.addEventListener("click", cycleSize);

        this.loadTexturePallete();


        setTool(isNeonMode ? 'neon' : 'brush');
    }


    private onHomeButtonClicked(): void {
        App.loading.show();
        this.uploadImage().then(() => {
            setTimeout(() => {
                window.location.href = 'unity://home';
            }, 1000);
        });


        //window.location.href = 'index.html';
        //window.location.href = 'unity://purchase?productId=adsFree';
        // uploadImage(new Blob(), "draw_0.png");

        // if(!adsFree) {
        //     window.location.href = 'unity://purchase?productId=adsFree';
        //     return;
        // }
        // Swal.fire({
        //     title: "Do you want to save the changes?",
        //     showDenyButton: true,
        //     showCancelButton: true,
        //     confirmButtonText: "Save",
        //     denyButtonText: `Don't save`
        // }).then((result) => {
        //     if (result.isConfirmed) {
        //         this.uploadImage().then(() => {
        //             window.location.href = 'unity://home';
        //         });
        //     } else if (result.isDenied) {
        //         window.location.href = 'unity://home';
        //     }
        // });
    }


    private onColorButtonChanged(colorId: string): void {
        // react to color change
        document.querySelectorAll<HTMLButtonElement>('.color-button').forEach(btn => {
            const isActive = btn.id === colorId;
            btn.classList.toggle('active', isActive);
        });
    }

    private onStickerButtonChanged(stickerId: string): void {
        // react to color change
        document.querySelectorAll<HTMLButtonElement>('.sticker-button').forEach(btn => {
            const isActive = btn.id === stickerId;
            btn.classList.toggle('active', isActive);
        });  
    }

    private onTextureButtonChanged(textureId: string): void {
        // react to color change
        document.querySelectorAll<HTMLButtonElement>('.texture-button').forEach(btn => {
            const isActive = btn.id === textureId;
            btn.classList.toggle('active', isActive);
        });

        const textureFn = textures[textureId];

        if (typeof textureFn !== "function") {
        console.warn(`Invalid textureId: ${textureId}`);
        return;
        }


        applyTextureToElementTextureTool("texture", textureFn, 0.68);
    }

    private showPallete(pallete: string): void {
        const palettes = ["colors", "stickers", "textures"];

        palettes.forEach(id => {
            const el = document.getElementById(id) as HTMLDivElement | null;
            if (!el) return;

            el.style.display = id === pallete ? "flex" : "none";
        });
    }

    private loadTexturePallete(): void {
        if (isNeonMode) return;
        setTool('texture');
        (Object.entries(textures) as [string, TextureFn][]).forEach(
          ([K, V]) => {
            applyTextureToElementTextureTool(K, V, 1.3);
          }
        );
    }
    
    public getBrushSize(): string {
        return this.brushSize;
    }


    public async uploadImage(): Promise<void> {
        const blob = await App.render.getBaseBlob();

        // console.log(this.renderer.currentImagePath);  //./assets/coloring_pages/age_0_5/dinosaur/dinosaur_0.png

        const filePath = App.render.currentImagePath;
        
        //replaces dinosaur_0.png -> dinosaur_draw_0.png
        const output = filePath.replace(
            /(\w+)_([0-9]+)\.png$/,
            "$1_draw_$2.png"
        );

        // console.log(output);
        uploadImage(blob, output);
    }

    private startAdTimer(): void {
        this.adTimer = 0;
        if (this.adInterval) clearInterval(this.adInterval);

        this.adInterval = setInterval(() => {
            this.adTimer++;
            if (this.adTimer >= gameplayInterstitialInterval) {
                // Show ad
                this.adTimer = 0; // reset
                window.location.href = 'unity://interstitial';
                const adLayer = document.getElementById('adCountdownLayer');
                if (adLayer) adLayer.classList.add('hidden');
            } else if (this.adTimer >= gameplayInterstitialInterval - 3) {
                // Show countdown
                const remaining = gameplayInterstitialInterval - this.adTimer;
                const adLayer = document.getElementById('adCountdownLayer');
                const adText = document.getElementById('adCountdownSeconds');
                if (adLayer && adText) {
                    adLayer.classList.remove('hidden');
                    adText.innerText = remaining.toString();
                }
            } else {
                // Hide countdown just in case
                const adLayer = document.getElementById('adCountdownLayer');
                if (adLayer && !adLayer.classList.contains('hidden')) {
                    adLayer.classList.add('hidden');
                }
            }
        }, 1000);
    }
}



