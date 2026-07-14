class Marker {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hue: number;
  radius: number;
  angle: number;
  angleSpeed: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    // Start at a random position
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    
    // Pick a vibrant starting color
    this.hue = Math.random() * 360;
    
    // Thick strokes to look like markers or paint brushes
    this.radius = Math.random() * 15 + 10; 
    
    // Movement angles
    this.angle = Math.random() * Math.PI * 2;
    this.angleSpeed = (Math.random() - 0.5) * 0.1;
    
    this.vx = Math.cos(this.angle) * 4;
    this.vy = Math.sin(this.angle) * 4;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // Use slightly lowered lightness (55%) for richer marker colors
    ctx.fillStyle = `hsl(${this.hue}, 90%, 55%)`;
    ctx.fill();
  }

  update(canvasWidth: number, canvasHeight: number) {
    // Wandering effect: gently change direction over time
    this.angle += this.angleSpeed;
    
    // Occasionally change the turning direction to keep it erratic but smooth
    if (Math.random() < 0.05) {
        this.angleSpeed = (Math.random() - 0.5) * 0.15;
    }

    this.vx = Math.cos(this.angle) * 5;
    this.vy = Math.sin(this.angle) * 5;

    this.x += this.vx;
    this.y += this.vy;

    // Bounce smoothly off the edges
    if (this.x < this.radius || this.x > canvasWidth - this.radius) {
      this.angle = Math.PI - this.angle;
      this.x = Math.max(this.radius, Math.min(this.x, canvasWidth - this.radius));
    }
    if (this.y < this.radius || this.y > canvasHeight - this.radius) {
      this.angle = -this.angle;
      this.y = Math.max(this.radius, Math.min(this.y, canvasHeight - this.radius));
    }

    // Slowly shift through the rainbow as it draws
    this.hue += 0.5;
    if (this.hue > 360) this.hue -= 360;
  }
}

export class SplatterLoader {
  private container: HTMLElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private markers: Marker[] = [];
  private animationId: number | null = null;

  constructor(containerId: string, canvasId: string) {
    this.container = document.getElementById(containerId) as HTMLElement;
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;

    this.resize();
    window.addEventListener('resize', this.resize);
    
    this.show(); 
  }

  private resize = () => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    // Fill with solid white on resize to clear the board
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  };

  private initMarkers() {
    this.markers = [];
    const markerCount = 8; // Number of simultaneous drawing lines
    for (let i = 0; i < markerCount; i++) {
      this.markers.push(new Marker(this.canvas.width, this.canvas.height));
    }
  }

  private animate = () => {
    // The "fade trail" effect. 
    // A very low alpha (0.02) means the trails stay visible for a long time,
    // making it look like the screen is gradually being colored in.
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.markers.forEach((marker) => {
      marker.update(this.canvas.width, this.canvas.height);
      marker.draw(this.ctx);
    });

    this.animationId = requestAnimationFrame(this.animate);
  };

  public show() {
    this.container.style.display = 'flex';
    this.initMarkers();
    
    // Fill starting canvas
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (!this.animationId) this.animate();
  }

  public hide() {
    this.container.style.display = 'none';
    
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    this.markers = [];
  }
}