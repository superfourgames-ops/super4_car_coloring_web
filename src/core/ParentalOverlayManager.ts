export class ParentalOverlayManager {
    private static instance: ParentalOverlayManager;
    private overlay: HTMLElement;
    private fillCircle: SVGCircleElement;
    private textElement: HTMLElement;
    private readonly circumference = 502;
    private holdInterval: number | null = null;

    private constructor() {
        this.overlay = document.getElementById('parentalOverlay')!;
        this.fillCircle = document.querySelector('.progress-ring__fill') as SVGCircleElement;
        this.textElement = document.getElementById('countdownText')!;
    }

    public static getInstance(): ParentalOverlayManager {
        if (!this.instance) this.instance = new ParentalOverlayManager();
        return this.instance;
    }

    public startHold(duration: number, onComplete: () => void) {
        this.stopHold(); // Reset any existing hold
        
        let elapsed = 0;
        const tickRate = 50;
        
        this.setVisible(true);
        this.update(0, duration);

        this.holdInterval = window.setInterval(() => {
            elapsed += tickRate / 1000;
            const progress = elapsed / duration;
            const secondsRemaining = Math.ceil(duration - elapsed);

            this.update(progress, secondsRemaining);

            if (elapsed >= duration) {
                this.stopHold();
                onComplete();
            }
        }, tickRate);
    }

    public stopHold() {
        if (this.holdInterval) {
            clearInterval(this.holdInterval);
            this.holdInterval = null;
        }
        this.setVisible(false);
    }

    private update(progress: number, seconds: number) {
        const offset = this.circumference - (progress * this.circumference);
        this.fillCircle.style.strokeDashoffset = offset.toString();
        this.textElement.innerText = seconds.toString();
    }

    private setVisible(visible: boolean) {
        if (visible) this.overlay.classList.remove('hidden');
        else this.overlay.classList.add('hidden');
    }
}