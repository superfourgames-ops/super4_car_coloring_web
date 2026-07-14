export type TextureFn = (ctx: CanvasRenderingContext2D, size: number) => CanvasPattern | null;
export const textures: Record<string, TextureFn> = {
    texture0: textureConfettiLight,
    texture1: textureConfettiDark,
    texture2: textureDiagonalPopins,
    texture3: textureDotsColorful,
    texture4: textureDotsColorful1,
    texture5: textureVibrantHeart,
    texture6: textureVibrantHeart1,
    texture7: textureVibrantHeart2,
    texture8: texturePolkaDots,
    texture9: texturePolkaDots1,
    texture10: textureClouds,
    texture11: textureCheckBoard,
    texture12: textureCheckBoard1,
    texture13: textureGingham,
    texture14: textureGingham1,
    texture15: textureConfetti,
    texture16: textureConfett1,
    texture17: textureDiagonalStripes,
    texture18: textureDiagonalStripes1,
    texture19: textureDiagonalStripes2,
    texture20: textureDiagonalStripesReverse,
    texture21: textureDiagonalStripesReverse1,
    texture22: textureCrosshatch,
    texture23: textureCrosshatch1,
    texture24: textureChevron,
    texture25: textureChevron1,
    texture26: textureChevron2,
    texture27: textureHexagon,
    texture28: textureSteps,
    texture29: textureSteps1,
    texture30: textureWaves,
    texture31: textureWavesHorizontal,
    texture32: textureWaves1,
    texture33: textureWavesHorizontal1,
    texture34: textureWavesCross,
    texture35: textureSquiggles,
    texture36: textureNoise,
    texture37: textureNoise1,
    texture38: textureRipples,
    texture39: textureRipples1,
    texture40: textureTopography,
    texture41: textureTopography1,
    texture42: textureTopography2,
    texture43: textureHearts,
    texture44: texturePixelHearts,
    texture45: textureGeoHearts,
    texture46: textureStars,
    texture47: textureConfettiStars,
    texture48: textureRainbows,
    texture49: textureRetroRainbows,
    texture50: textureRainbowRibbons,
    texture51: textureRainbowFlag,
    texture52: textureSmileys,
    texture53: textureBubbles,
    texture54: textureDoodles,
    texture55: textureMixedSmileys,
    texture56: textureCuteBlush,
    texture57: textureLoveSmileys,
    texture58: textureAngrySmiley,
    texture59: textureDisgustingPoop,
    texture60: textureHappyPoop,
    texture61: textureUnicornLaughingPoop,
    texture62: textureLeaves,
    texture63: textureAutumnLeaves,
    texture64: textureBambooLeaves,
    texture65: textureFlowers,
    texture66: textureClover,
    texture67: textureSnowflakes,
    texture68: textureSnowflakeConfetti,
    texture69: textureFrozenMist,
    texture70: textureRaindrops,
    texture71: textureRainStreaks,
    texture72: textureRainRipples,
    texture73: textureWood,
    texture74: textureKnottedWood,
    texture75: textureMahogany,
    texture76: textureStone,
    texture77: textureSunburst,
    texture78: textureVines,
    texture79: textureAnimals,
    texture80: textureSkyFun,
    texture81: textureSunsetSky,
    texture82: textureOnlyCat,
    texture83: textureAggressiveFire,
    texture84: textureFire,
    texture85: textureOnlyDog,
    texture86: textureOnlyBear,
    texture87: textureOnlyCow,
    texture88: textureOnlyLion,
    texture89: textureOnlyGiraffe,
    texture90: textureOnlyGoat,
    texture91: textureElephantFull,
    texture92: textureMemphisStyle,
    texture93: textureMemphisVariety,
    texture94: textureBauhaus,
    texture95: textureCyberGrid,
    texture96: textureDeterministicGrain,
    texture97: textureSeigaiha,
    texture98: textureFilmGrain,
    texture99: textureConcrete,
    texture100: textureFineSand,
    texture101: textureRandomDigits,  
    texture102: textureHackerDigits,
    texture103: textureRandomAlphabets,
    texture104: textureCandies,
    texture105: textureGifts,
    texture106: textureCakeSlices,
    texture107: textureChristmas,
    texture108: textureFlowerGarden,
    texture109: textureFlowersDarkBg,
    texture110: textureMidnightNeon,
    texture111: textureMidnightBerries,
    texture112: textureCherryBlossom,
    texture113: textureMidnightRose,
    texture114: textureCyberFlora,
    texture115: textureDarkSunflowers,
    texture116: textureApplesDark,
    texture117: textureRefinedApples,
    texture118: textureRefinedBananas,
    texture119: textureAnatomicalBananas,
    texture120: textureGrassLight,
    texture121: textureGhosts,
    texture122: textureScatteredGhosts,
    texture123: textureNeonCircuit,
    texture124: textureNeonHex,
    texture125: textureNeonHUD,
    texture126: textureNeonCircuit1,
    texture127: textureNeonTriangles,
    texture128: textureNeonGrid
  };


//NOTE: Adding dpr to applyTextureToElementTextureTool and the texture (each) solves blurry problem in lower resolution
export function applyTextureToElementTextureTool(
  elementId: string,
  textureFn: TextureFn,
  size: number
): void {
  const div = document.getElementById(elementId) as HTMLDivElement | null;
  if (!div) return;

  const dpr = window.devicePixelRatio || 1;
  const rect = div.getBoundingClientRect();

  const canvas = document.createElement("canvas");
  
  // 1. Physical resolution (Size x DPR)
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // 2. Normalize the coordinate system
  // This allows textureFn to draw using CSS units while hitting physical pixels
  ctx.scale(dpr, dpr);

  // Pass the rect width to the pattern function
  const pattern = textureFn(ctx, rect.width * size);
  if (!pattern) return;

  ctx.fillStyle = pattern;
  
  // 3. Draw using CSS units
  ctx.fillRect(0, 0, rect.width, rect.height);

  // 4. Export and Scale Back
  div.style.backgroundImage = `url(${canvas.toDataURL()})`;
  div.style.backgroundRepeat = "no-repeat";
  
  // CRITICAL: This tells the browser to squash the high-res image 
  // into the original CSS box size.
  div.style.backgroundSize = `${rect.width}px ${rect.height}px`;
}
export function textureConfettiLight(
  ctx: CanvasRenderingContext2D,
  size: number
) {
  const dpr = window.devicePixelRatio || 1;
  const pCanvas = document.createElement("canvas");

  // 1. Scale physical canvas resolution by DPR
  pCanvas.width = size * dpr;
  pCanvas.height = size * dpr;

  const pCtx = pCanvas.getContext("2d")!;
  
  // 2. Scale the context so your drawing math (0 to size) remains the same
  pCtx.scale(dpr, dpr);

  // background
  pCtx.fillStyle = "#fff7d6";
  pCtx.fillRect(0, 0, size, size);

  const colors = ["#ff6b6b", "#4ecdc4", "#8338ec", "#ffbe0b"];
  const cols = 5;
  const rows = 5;

  // deterministic hash → [0, 1)
  const pseudoRandom = (x: number, y: number) => {
    const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return s - Math.floor(s);
  };

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = (i + 0.5) * (size / cols);
      const y = (j + 0.5) * (size / rows);

      const angle = pseudoRandom(i, j) * Math.PI;
      const color = colors[(i + j) % colors.length];

      // tile-safe wrapping
      [
        [0, 0], [size, 0], [-size, 0],
        [0, size], [0, -size],
        [size, size], [-size, -size],
        [size, -size], [-size, size],
      ].forEach(([dx, dy]) => {
        pCtx.save();
        pCtx.translate(x + dx, y + dy);
        pCtx.rotate(angle);
        pCtx.fillStyle = color;

        const width = size * 0.05;
        const height = size * 0.1;

        // Drawing in high-res thanks to pCtx.scale(dpr, dpr)
        pCtx.fillRect(-width / 2, -height / 2, width, height);
        pCtx.restore();
      });
    }
  }

  const pattern = ctx.createPattern(pCanvas, "repeat");

  // 3. Transform the pattern back to CSS scale
  if (pattern) {
    const matrix = new DOMMatrix();
    pattern.setTransform(matrix.scale(1 / dpr, 1 / dpr));
  }

  return pattern;
}

export function textureConfettiDark(
  ctx: CanvasRenderingContext2D,
  size: number
) {
  const dpr = window.devicePixelRatio || 1;
  const pCanvas = document.createElement("canvas");

  // 1. Scale physical canvas resolution by DPR
  pCanvas.width = size * dpr;
  pCanvas.height = size * dpr;

  const pCtx = pCanvas.getContext("2d")!;
  
  // 2. Scale the context so your drawing math (0 to size) remains the same
  pCtx.scale(dpr, dpr);

  // background
  pCtx.fillStyle = "#2B2D42";
  pCtx.fillRect(0, 0, size, size);

  const colors = ["#EF233C", "#D90429", "#8D99AE", "#EDF2F4"];
  const cols = 5;
  const rows = 5;

  // deterministic hash → [0, 1)
  const pseudoRandom = (x: number, y: number) => {
    const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return s - Math.floor(s);
  };

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = (i + 0.5) * (size / cols);
      const y = (j + 0.5) * (size / rows);

      const angle = pseudoRandom(i, j) * Math.PI;
      const color = colors[(i + j) % colors.length];

      // tile-safe wrapping
      [
        [0, 0], [size, 0], [-size, 0],
        [0, size], [0, -size],
        [size, size], [-size, -size],
        [size, -size], [-size, size],
      ].forEach(([dx, dy]) => {
        pCtx.save();
        pCtx.translate(x + dx, y + dy);
        pCtx.rotate(angle);
        pCtx.fillStyle = color;

        const width = size * 0.05;
        const height = size * 0.1;

        // Drawing in high-res thanks to pCtx.scale(dpr, dpr)
        pCtx.fillRect(-width / 2, -height / 2, width, height);
        pCtx.restore();
      });
    }
  }

  const pattern = ctx.createPattern(pCanvas, "repeat");

  // 3. Transform the pattern back to CSS scale
  if (pattern) {
    const matrix = new DOMMatrix();
    pattern.setTransform(matrix.scale(1 / dpr, 1 / dpr));
  }

  return pattern;
}

export function textureDiagonalPopins(
  ctx: CanvasRenderingContext2D,
  size: number
) {
  const dpr = window.devicePixelRatio || 1;
  const pCanvas = document.createElement("canvas");

  // 1. Scale physical canvas resolution by DPR
  pCanvas.width = size * dpr;
  pCanvas.height = size * dpr;
  
  const pCtx = pCanvas.getContext("2d")!;
  
  // 2. Scale the context so your layout math (cols/rows/size) stays the same
  pCtx.scale(dpr, dpr);

  // Background
  pCtx.fillStyle = "#2ec4ff";
  pCtx.fillRect(0, 0, size, size);

  const colors = [
    "#ffffff", "#fff1b8", "#ffd166", "#ffb3c6",
    "#ff8fab", "#cdb4ff", "#bde0fe", "#caf0f8",
  ];

  const cols = 10;
  const rows = 10;
  const radius = size * 0.08;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = (i + 0.5) * (size / cols);
      const y = (j + 0.5) * (size / rows);
      const color = colors[(i + j) % colors.length];

      // tile-safe wrapping
      [
        [0, 0], [size, 0], [-size, 0],
        [0, size], [0, -size],
        [size, size], [-size, -size],
        [size, -size], [-size, size],
      ].forEach(([dx, dy]) => {
        pCtx.fillStyle = color;
        pCtx.beginPath();
        // The arc will now draw with high-density precision
        pCtx.arc(x + dx, y + dy, radius, 0, Math.PI * 2);
        pCtx.fill();
      });
    }
  }

  const pattern = ctx.createPattern(pCanvas, "repeat");

  // 3. Scale the pattern back down to maintain correct visual tiling size
  if (pattern) {
    const matrix = new DOMMatrix();
    pattern.setTransform(matrix.scale(1 / dpr, 1 / dpr));
  }

  return pattern;
}

export function textureDotsColorful(
  ctx: CanvasRenderingContext2D,
  size: number
) {
  const dpr = window.devicePixelRatio || 1;
  const pCanvas = document.createElement("canvas");

  // 1. Scale physical canvas resolution by DPR
  pCanvas.width = size * dpr;
  pCanvas.height = size * dpr;
  
  const pCtx = pCanvas.getContext("2d")!;
  
  // 2. Scale the context so your layout math (cols/rows/size) stays the same
  pCtx.scale(dpr, dpr);

// Background
  pCtx.fillStyle = "#0b0116";
  pCtx.fillRect(0, 0, size, size);

  const colors = [
    "#ff006e", "#8338ec", "#3a86ff", "#00f5d4",
    "#00bbf9", "#fee440", "#f15bb5", "#5bf163",
  ];
  const cols = 6;
  const rows = 6;
  const radius = size * 0.07;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = (i + 0.5) * (size / cols);
      const y = (j + 0.5) * (size / rows);
      const color = colors[(i + j) % colors.length];

      // tile-safe wrapping
      [
        [0, 0], [size, 0], [-size, 0],
        [0, size], [0, -size],
        [size, size], [-size, -size],
        [size, -size], [-size, size],
      ].forEach(([dx, dy]) => {
        pCtx.fillStyle = color;
        pCtx.beginPath();
        // The arc will now draw with high-density precision
        pCtx.arc(x + dx, y + dy, radius, 0, Math.PI * 2);
        pCtx.fill();
      });
    }
  }

  const pattern = ctx.createPattern(pCanvas, "repeat");

  // 3. Scale the pattern back down to maintain correct visual tiling size
  if (pattern) {
    const matrix = new DOMMatrix();
    pattern.setTransform(matrix.scale(1 / dpr, 1 / dpr));
  }

  return pattern;
}

export function textureDotsColorful1(
  ctx: CanvasRenderingContext2D,
  size: number
) {
  const dpr = window.devicePixelRatio || 1;
  const pCanvas = document.createElement("canvas");

  // 1. Scale physical canvas resolution by DPR
  pCanvas.width = size * dpr;
  pCanvas.height = size * dpr;
  
  const pCtx = pCanvas.getContext("2d")!;
  
  // 2. Scale the context so your layout math (cols/rows/size) stays the same
  pCtx.scale(dpr, dpr);

// Background
  pCtx.fillStyle = "#f3f0ff";
  pCtx.fillRect(0, 0, size, size);

  const colors = [
    "#b79ced", "#947bd3", "#ffc8dd", "#ffafcc",
    "#bde0fe", "#a2d2ff", "#ffffff", "#cdb4ff",
  ];
  const cols = 3;
  const rows = 3;
  const radius = size * 0.1;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = (i + 0.5) * (size / cols);
      const y = (j + 0.5) * (size / rows);
      const color = colors[(i + j) % colors.length];

      // tile-safe wrapping
      [
        [0, 0], [size, 0], [-size, 0],
        [0, size], [0, -size],
        [size, size], [-size, -size],
        [size, -size], [-size, size],
      ].forEach(([dx, dy]) => {
        pCtx.fillStyle = color;
        pCtx.beginPath();
        // The arc will now draw with high-density precision
        pCtx.arc(x + dx, y + dy, radius, 0, Math.PI * 2);
        pCtx.fill();
      });
    }
  }

  const pattern = ctx.createPattern(pCanvas, "repeat");

  // 3. Scale the pattern back down to maintain correct visual tiling size
  if (pattern) {
    const matrix = new DOMMatrix();
    pattern.setTransform(matrix.scale(1 / dpr, 1 / dpr));
  }

  return pattern;
}

export function textureVibrantHeart(
  ctx: CanvasRenderingContext2D,
  size: number
) {
  const dpr = window.devicePixelRatio || 1;
  const pCanvas = document.createElement("canvas");

  // 1. Scale physical canvas resolution by DPR
  pCanvas.width = size * dpr;
  pCanvas.height = size * dpr;

  const pCtx = pCanvas.getContext("2d")!;
  
  // 2. Scale the context so your drawing math (0 to size) remains the same
  pCtx.scale(dpr, dpr);

// Background: Deepest Magma Red
  pCtx.fillStyle = "#4a0000ff";
  pCtx.fillRect(0, 0, size, size);

  /* Foreground: Increasing Heat */
  const colors = [
    "#ff0000ff", // Pure Red
    "#ff4800ff", // Red-Orange
    "#ff8c00ff", // Pure Orange
    "#ffd500ff", // Golden Yellow
    "#ffff00ff", // Blinding White-Yellow
  ];

  const cols = 4;
  const rows = 4;
  const heartSize = size * 0.1;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const cx = (i + 0.5) * (size / cols);
      const cy = (j + 0.5) * (size / rows);

      pCtx.fillStyle = colors[(i + j) % colors.length];

      [
        [0, 0], [size, 0], [-size, 0],
        [0, size], [0, -size],
        [size, size], [-size, -size],
        [size, -size], [-size, size],
      ].forEach(([dx, dy]) => {
        const x = cx + dx;
        const y = cy + dy;
        const s = heartSize;

        pCtx.beginPath();
        pCtx.moveTo(x, y + s * 0.9);

        // Left side
        pCtx.bezierCurveTo(
          x - s * 0.3, y + s * 0.6,
          x - s * 1.0, y + s * 0.3,
          x - s * 1.0, y - s * 0.1
        );

        // Left lobe
        pCtx.bezierCurveTo(
          x - s * 1.0, y - s * 0.6,
          x - s * 0.5, y - s * 0.7,
          x, y - s * 0.3
        );

        // Right lobe
        pCtx.bezierCurveTo(
          x + s * 0.5, y - s * 0.7,
          x + s * 1.0, y - s * 0.6,
          x + s * 1.0, y - s * 0.1
        );

        // Right side
        pCtx.bezierCurveTo(
          x + s * 1.0, y + s * 0.3,
          x + s * 0.3, y + s * 0.6,
          x, y + s * 0.9
        );

        pCtx.closePath();
        pCtx.fill();
      });
    }
  }

  const pattern = ctx.createPattern(pCanvas, "repeat");

  // 3. Transform the pattern back to CSS scale
  if (pattern) {
    const matrix = new DOMMatrix();
    pattern.setTransform(matrix.scale(1 / dpr, 1 / dpr));
  }

  return pattern;
}

export function textureVibrantHeart1(
  ctx: CanvasRenderingContext2D,
  size: number
) {
  const dpr = window.devicePixelRatio || 1;
  const pCanvas = document.createElement("canvas");

  // 1. Scale physical canvas resolution by DPR
  pCanvas.width = size * dpr;
  pCanvas.height = size * dpr;

  const pCtx = pCanvas.getContext("2d")!;
  
  // 2. Scale the context so your drawing math (0 to size) remains the same
  pCtx.scale(dpr, dpr);

// Background: Deep Ultra-Violet
  pCtx.fillStyle = "#0a001aff";
  pCtx.fillRect(0, 0, size, size);

  /* Foreground: Pure Neon Light */
  const colors = [
    "#ff00ffff", // Electric Magenta
    "#00ffffff", // Cyber Cyan
    "#ffea00ff", // High-Vis Yellow
    "#39ff14ff", // Neon Lime
    "#ff3300ff", // Laser Red
  ];

  const cols = 4;
  const rows = 4;
  const heartSize = size * 0.1;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const cx = (i + 0.5) * (size / cols);
      const cy = (j + 0.5) * (size / rows);

      pCtx.fillStyle = colors[(i + j) % colors.length];

      [
        [0, 0], [size, 0], [-size, 0],
        [0, size], [0, -size],
        [size, size], [-size, -size],
        [size, -size], [-size, size],
      ].forEach(([dx, dy]) => {
        const x = cx + dx;
        const y = cy + dy;
        const s = heartSize;

        pCtx.beginPath();
        pCtx.moveTo(x, y + s * 0.9);

        // Left side
        pCtx.bezierCurveTo(
          x - s * 0.3, y + s * 0.6,
          x - s * 1.0, y + s * 0.3,
          x - s * 1.0, y - s * 0.1
        );

        // Left lobe
        pCtx.bezierCurveTo(
          x - s * 1.0, y - s * 0.6,
          x - s * 0.5, y - s * 0.7,
          x, y - s * 0.3
        );

        // Right lobe
        pCtx.bezierCurveTo(
          x + s * 0.5, y - s * 0.7,
          x + s * 1.0, y - s * 0.6,
          x + s * 1.0, y - s * 0.1
        );

        // Right side
        pCtx.bezierCurveTo(
          x + s * 1.0, y + s * 0.3,
          x + s * 0.3, y + s * 0.6,
          x, y + s * 0.9
        );

        pCtx.closePath();
        pCtx.fill();
      });
    }
  }

  const pattern = ctx.createPattern(pCanvas, "repeat");

  // 3. Transform the pattern back to CSS scale
  if (pattern) {
    const matrix = new DOMMatrix();
    pattern.setTransform(matrix.scale(1 / dpr, 1 / dpr));
  }

  return pattern;
}

export function textureVibrantHeart2(
  ctx: CanvasRenderingContext2D,
  size: number
) {
  const dpr = window.devicePixelRatio || 1;
  const pCanvas = document.createElement("canvas");

  // 1. Scale physical canvas resolution by DPR
  pCanvas.width = size * dpr;
  pCanvas.height = size * dpr;

  const pCtx = pCanvas.getContext("2d")!;
  
  // 2. Scale the context so your drawing math (0 to size) remains the same
  pCtx.scale(dpr, dpr);

// Background: Soft Sand
  pCtx.fillStyle = "#f4f1deff";
  pCtx.fillRect(0, 0, size, size);

  /* Foreground: Sun-bleached Tones */
  const colors = [
    "#e07a5fff", // Soft Terracotta
    "#f2cc8fff", // Peach Sand
    "#81b29aff", // Muted Seafoam
    "#f3b5bcff", // Cotton Candy Pink
    "#dfd3c3ff", // Mushroom
  ];
  const cols = 4;
  const rows = 4;
  const heartSize = size * 0.1;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const cx = (i + 0.5) * (size / cols);
      const cy = (j + 0.5) * (size / rows);

      pCtx.fillStyle = colors[(i + j) % colors.length];

      [
        [0, 0], [size, 0], [-size, 0],
        [0, size], [0, -size],
        [size, size], [-size, -size],
        [size, -size], [-size, size],
      ].forEach(([dx, dy]) => {
        const x = cx + dx;
        const y = cy + dy;
        const s = heartSize;

        pCtx.beginPath();
        pCtx.moveTo(x, y + s * 0.9);

        // Left side
        pCtx.bezierCurveTo(
          x - s * 0.3, y + s * 0.6,
          x - s * 1.0, y + s * 0.3,
          x - s * 1.0, y - s * 0.1
        );

        // Left lobe
        pCtx.bezierCurveTo(
          x - s * 1.0, y - s * 0.6,
          x - s * 0.5, y - s * 0.7,
          x, y - s * 0.3
        );

        // Right lobe
        pCtx.bezierCurveTo(
          x + s * 0.5, y - s * 0.7,
          x + s * 1.0, y - s * 0.6,
          x + s * 1.0, y - s * 0.1
        );

        // Right side
        pCtx.bezierCurveTo(
          x + s * 1.0, y + s * 0.3,
          x + s * 0.3, y + s * 0.6,
          x, y + s * 0.9
        );

        pCtx.closePath();
        pCtx.fill();
      });
    }
  }

  const pattern = ctx.createPattern(pCanvas, "repeat");

  // 3. Transform the pattern back to CSS scale
  if (pattern) {
    const matrix = new DOMMatrix();
    pattern.setTransform(matrix.scale(1 / dpr, 1 / dpr));
  }

  return pattern;
}
export function texturePolkaDots(
  ctx: CanvasRenderingContext2D,
  size: number
) {
  /* ===============================
     🔧 TWEAKABLE VARIABLES
     =============================== */
  const bgColor = "#ffd500";      // background color
  const dotColor = "#e63946";     // dot color

  const dotsPerRow = 4;           // number of dots horizontally/vertically
  const dotRadiusRatio = 0.25;    // radius relative to spacing
  const marginRatio = 0.5;        // 0.5 = centered
  /* =============================== */

  const dpr = window.devicePixelRatio || 1;
  const pCanvas = document.createElement("canvas");

  // 1. Scale physical canvas resolution by DPR
  pCanvas.width = size * dpr;
  pCanvas.height = size * dpr;

  const pCtx = pCanvas.getContext("2d")!;
  
  // 2. Scale the context so your "size" math remains consistent
  pCtx.scale(dpr, dpr);
  
  // Optional: Keep this false if you want perfectly "hard" pixel circles, 
  // but usually true is better for smooth high-res dots.
  pCtx.imageSmoothingEnabled = true;

  /* Background */
  pCtx.fillStyle = bgColor;
  pCtx.fillRect(0, 0, size, size);

  /* Dot layout math (Calculated in CSS units) */
  const spacing = size / dotsPerRow;
  const radius = spacing * dotRadiusRatio;
  const offset = spacing * marginRatio;

  /* Draw dots */
  pCtx.fillStyle = dotColor;

  for (let y = 0; y < dotsPerRow; y++) {
    for (let x = 0; x < dotsPerRow; x++) {
      pCtx.beginPath();
      pCtx.arc(
        offset + x * spacing,
        offset + y * spacing,
        radius,
        0,
        Math.PI * 2
      );
      pCtx.fill();
    }
  }

  const pattern = ctx.createPattern(pCanvas, "repeat");

  // 3. Scale the pattern back down so it doesn't appear 2x/3x too large
  if (pattern) {
    const matrix = new DOMMatrix();
    pattern.setTransform(matrix.scale(1 / dpr, 1 / dpr));
  }

  return pattern;
}

export function texturePolkaDots1(
  ctx: CanvasRenderingContext2D,
  size: number
) {
  /* ===============================
     🔧 TWEAKABLE VARIABLES
     =============================== */
  const bgColor = "#1a1a1a";      // Charcoal Black
  const dotColor = "#00f5d4";     // Electric Teal/Cyan

  const dotsPerRow = 4;           // number of dots horizontally/vertically
  const dotRadiusRatio = 0.25;    // radius relative to spacing
  const marginRatio = 0.5;        // 0.5 = centered
  /* =============================== */

  const dpr = window.devicePixelRatio || 1;
  const pCanvas = document.createElement("canvas");

  // 1. Scale physical canvas resolution by DPR
  pCanvas.width = size * dpr;
  pCanvas.height = size * dpr;

  const pCtx = pCanvas.getContext("2d")!;
  
  // 2. Scale the context so your "size" math remains consistent
  pCtx.scale(dpr, dpr);
  
  // Optional: Keep this false if you want perfectly "hard" pixel circles, 
  // but usually true is better for smooth high-res dots.
  pCtx.imageSmoothingEnabled = true;

  /* Background */
  pCtx.fillStyle = bgColor;
  pCtx.fillRect(0, 0, size, size);

  /* Dot layout math (Calculated in CSS units) */
  const spacing = size / dotsPerRow;
  const radius = spacing * dotRadiusRatio;
  const offset = spacing * marginRatio;

  /* Draw dots */
  pCtx.fillStyle = dotColor;

  for (let y = 0; y < dotsPerRow; y++) {
    for (let x = 0; x < dotsPerRow; x++) {
      pCtx.beginPath();
      pCtx.arc(
        offset + x * spacing,
        offset + y * spacing,
        radius,
        0,
        Math.PI * 2
      );
      pCtx.fill();
    }
  }

  const pattern = ctx.createPattern(pCanvas, "repeat");

  // 3. Scale the pattern back down so it doesn't appear 2x/3x too large
  if (pattern) {
    const matrix = new DOMMatrix();
    pattern.setTransform(matrix.scale(1 / dpr, 1 / dpr));
  }

  return pattern;
}

export function textureClouds(
  ctx: CanvasRenderingContext2D,
  size: number
) {
  const dpr = window.devicePixelRatio || 1;
  const pCanvas = document.createElement("canvas");

  // 1. Scale physical canvas resolution by DPR
  pCanvas.width = size * dpr;
  pCanvas.height = size * dpr;
  
  const pCtx = pCanvas.getContext("2d")!;
  
  // 2. Scale the context so drawing math (0 to size) stays the same
  pCtx.scale(dpr, dpr);

  // richer sky blue
  pCtx.fillStyle = "#bfe7ff";
  pCtx.fillRect(0, 0, size, size);

  function drawCloud(x: number, y: number, scale: number, color: string | CanvasGradient | CanvasPattern) {
    pCtx.save();
    pCtx.translate(x, y);
    pCtx.scale(scale, scale);

    // outline
    pCtx.lineWidth = 3;
    pCtx.strokeStyle = "#7bbce6";

    pCtx.fillStyle = color;
    pCtx.beginPath();
    pCtx.arc(0, 16, 16, Math.PI * 0.5, Math.PI * 1.5);
    pCtx.arc(24, 0, 22, Math.PI, Math.PI * 2);
    pCtx.arc(52, 16, 16, Math.PI * 1.5, Math.PI * 0.5);
    pCtx.closePath();
    pCtx.fill();
    pCtx.stroke();

    // blush accents
    pCtx.fillStyle = "#ff8fb1";
    pCtx.beginPath();
    pCtx.arc(18, 22, 3, 0, Math.PI * 2);
    pCtx.arc(34, 22, 3, 0, Math.PI * 2);
    pCtx.fill();

    pCtx.restore();
  }

  const cloudColors = ["#ffffff", "#fff0a8", "#ffd1e8", "#e3f6ff"];

  const cols = 3;
  const rows = 4;
  const cellW = size / cols;
  const cellH = size / rows;

  let index = 0;

  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const x = col * cellW + cellW / 2;
      const y = row * cellH + cellH / 2;

      const color = cloudColors[index++ % cloudColors.length];
      const scale = size * 0.003;

      [
        [0, 0], [size, 0], [-size, 0],
        [0, size], [0, -size],
        [size, size], [-size, -size],
        [size, -size], [-size, size]
      ].forEach(([dx, dy]) => {
        // We draw in CSS units (x, y, size) because pCtx.scale(dpr, dpr) handles the conversion
        drawCloud(x + dx, y + dy, scale, color);
      });
    }
  }

  const pattern = ctx.createPattern(pCanvas, "repeat");

  // 3. Scale the pattern back down for the main canvas
  if (pattern) {
    const matrix = new DOMMatrix();
    pattern.setTransform(matrix.scale(1 / dpr, 1 / dpr));
  }

  return pattern;
}

export function textureCheckBoard(
  ctx: CanvasRenderingContext2D,
  size: number
) {
  size = size * 0.2;
  const dpr = window.devicePixelRatio || 1;
  const pCanvas = document.createElement("canvas");

  // 1. Scale the pattern canvas by DPR
  pCanvas.width = size * dpr;
  pCanvas.height = size * dpr;
  
  const pCtx = pCanvas.getContext("2d")!;
  
  // 2. Scale the context
  pCtx.scale(dpr, dpr);

  // Draw a 2x2 Checkerboard
  const half = size / 2;

  // Top Left - White
  pCtx.fillStyle = "#ffffff";
  pCtx.fillRect(0, 0, half, half);

  // Top Right - Black
  pCtx.fillStyle = "#000000";
  pCtx.fillRect(half, 0, half, half);

  // Bottom Left - Black
  pCtx.fillStyle = "#000000";
  pCtx.fillRect(0, half, half, half);

  // Bottom Right - White
  pCtx.fillStyle = "#ffffff";
  pCtx.fillRect(half, half, half, half);

  const pattern = ctx.createPattern(pCanvas, "repeat");

  // 3. The "Magic" fix for project-level blurriness
  if (pattern) {
    const matrix = new DOMMatrix();
    // This tells the browser: "The image is high-res (DPR), 
    // but draw it at the CSS 'size' units."
    pattern.setTransform(matrix.scale(1 / dpr, 1 / dpr));
  }

  return pattern;
}

export function textureCheckBoard1(
  ctx: CanvasRenderingContext2D,
  size: number
) {
  size = size * 0.2;
  const dpr = window.devicePixelRatio || 1;
  const pCanvas = document.createElement("canvas");

  // 1. Scale the pattern canvas by DPR
  pCanvas.width = size * dpr;
  pCanvas.height = size * dpr;
  
  const pCtx = pCanvas.getContext("2d")!;
  
  // 2. Scale the context
  pCtx.scale(dpr, dpr);

// Draw a 2x2 Checkerboard
  const half = size / 2;

  // Top Left - White
  pCtx.fillStyle = "#95d5b2ff";
  pCtx.fillRect(0, 0, half, half);

  // Top Right - Black
  pCtx.fillStyle = "#1b4332ff";
  pCtx.fillRect(half, 0, half, half);

  // Bottom Left - Black
  pCtx.fillStyle = "#1b4332ff";
  pCtx.fillRect(0, half, half, half);

  // Bottom Right - White
  pCtx.fillStyle = "#95d5b2ff";
  pCtx.fillRect(half, half, half, half);

  const pattern = ctx.createPattern(pCanvas, "repeat");

  // 3. The "Magic" fix for project-level blurriness
  if (pattern) {
    const matrix = new DOMMatrix();
    // This tells the browser: "The image is high-res (DPR), 
    // but draw it at the CSS 'size' units."
    pattern.setTransform(matrix.scale(1 / dpr, 1 / dpr));
  }

  return pattern;
}

export function textureGingham(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const density = 0.2; // Scaled down to 40%
  const s = size * density;

  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  pCtx.fillStyle = "#fff";
  pCtx.fillRect(0, 0, s, s);
  
  // Use the scaled 's' for the overlaps
  pCtx.fillStyle = "rgba(255, 100, 100, 0.3)";
  pCtx.fillRect(0, 0, s, s / 2);
  pCtx.fillRect(0, 0, s / 2, s);

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureGingham1(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const density = 0.2; // Scaled down to 40%
  const s = size * density;

  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  pCtx.fillStyle = "#f3f0ff";
  pCtx.fillRect(0, 0, s, s);
  
  // Use the scaled 's' for the overlaps
  pCtx.fillStyle = "rgba(123, 31, 162, 0.25)";
  pCtx.fillRect(0, 0, s, s / 2);
  pCtx.fillRect(0, 0, s / 2, s);

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}



export function textureConfetti(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const density = 0.6; // Scaled down to 40%
  const s = size * density;

  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  pCtx.fillStyle = "#1e293b"; 
  pCtx.fillRect(0, 0, s, s);

  // Points now calculated based on the smaller 's'
  const points = [
    [0.2, 0.2, 0.08, "#f43f5e"], 
    [0.7, 0.3, 0.04, "#3b82f6"], 
    [0.4, 0.8, 0.06, "#10b981"]
  ];

  points.forEach(([px, py, pr, color]) => {
    pCtx.fillStyle = color as string;
    pCtx.beginPath();
    pCtx.arc(
      (px as number) * s, 
      (py as number) * s, 
      (pr as number) * s * 1.5, 
      0, 
      Math.PI * 2
    );
    pCtx.fill();
  });

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}


export function textureConfett1(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const density = 0.8; // Scaled down to 40%
  const s = size * density;

  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  pCtx.fillStyle = "#450a0a"; 
  pCtx.fillRect(0, 0, s, s);

  // Points now calculated based on the smaller 's'
  const points = [
    [0.2, 0.2, 0.08, "#facc15"], // Yellow Gold
    [0.7, 0.3, 0.04, "#fb923c"], // Orange
    [0.4, 0.8, 0.06, "#f87171"], // Coral Red
    [0.9, 0.9, 0.05, "#fdba74"], // Light Peach
    [0.1, 0.6, 0.07, "#fbbf24"], // Amber
    [0.5, 0.5, 0.09, "#fcd34d"], // Warm Yellow
    [0.8, 0.1, 0.03, "#f43f5e"], // Rose Accent
    [0.3, 0.4, 0.05, "#fb7185"]  // Soft Pink
  ];

  points.forEach(([px, py, pr, color]) => {
    pCtx.fillStyle = color as string;
    pCtx.beginPath();
    pCtx.arc(
      (px as number) * s, 
      (py as number) * s, 
      (pr as number) * s * 1.2, 
      0, 
      Math.PI * 2
    );
    pCtx.fill();
  });

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureDiagonalStripes(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const density = 0.2; // Reduce scale to 40%
  const s = size * density;
  
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  pCtx.fillStyle = "#fbbf24";
  pCtx.fillRect(0, 0, s, s);

  pCtx.strokeStyle = "#d97706";
  pCtx.lineWidth = s / 4;
  pCtx.beginPath();
  pCtx.moveTo(0, 0); pCtx.lineTo(s, s);
  pCtx.moveTo(-s/2, s/2); pCtx.lineTo(s/2, s * 1.5);
  pCtx.moveTo(s/2, -s/2); pCtx.lineTo(s * 1.5, s/2);
  pCtx.stroke();

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureDiagonalStripes1(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const density = 0.2; // Reduce scale to 40%
  const s = size * density;
  
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  pCtx.fillStyle = "#0f172a"; // Deep Navy
  pCtx.fillRect(0, 0, s, s);

  pCtx.strokeStyle = "#38bdf8"; // Bright Cyan
  pCtx.lineWidth = s / 4;
  pCtx.beginPath();
  pCtx.moveTo(0, 0); pCtx.lineTo(s, s);
  pCtx.moveTo(-s/2, s/2); pCtx.lineTo(s/2, s * 1.5);
  pCtx.moveTo(s/2, -s/2); pCtx.lineTo(s * 1.5, s/2);
  pCtx.stroke();

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureDiagonalStripes2(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const density = 0.2; // Reduce scale to 40%
  const s = size * density;
  
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  pCtx.fillStyle = "#fff1f2"; // Very Pale Pink
  pCtx.fillRect(0, 0, s, s);

  pCtx.strokeStyle = "#fb7185"; // Rose Pink  
  pCtx.lineWidth = s / 4;
  pCtx.beginPath();
  pCtx.moveTo(0, 0); pCtx.lineTo(s, s);
  pCtx.moveTo(-s/2, s/2); pCtx.lineTo(s/2, s * 1.5);
  pCtx.moveTo(s/2, -s/2); pCtx.lineTo(s * 1.5, s/2);
  pCtx.stroke();

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureDiagonalStripesReverse(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const density = 0.2; 
  const s = size * density;
  
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background
  pCtx.fillStyle = "#064e3b"; // Deep Emerald
  pCtx.fillRect(0, 0, s, s);

  pCtx.strokeStyle = "#10b981"; // Vibrant Mint
  pCtx.lineWidth = s / 4;
  pCtx.beginPath();
  
  // Main diagonal: Top-Right to Bottom-Left
  pCtx.moveTo(s, 0); 
  pCtx.lineTo(0, s);

  // Corner 1: Offset to fill the top-left gap
  pCtx.moveTo(s / 2, -s / 2); 
  pCtx.lineTo(-s / 2, s / 2);

  // Corner 2: Offset to fill the bottom-right gap
  pCtx.moveTo(s * 1.5, s / 2); 
  pCtx.lineTo(s / 2, s * 1.5);
  
  pCtx.stroke();

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}


export function textureDiagonalStripesReverse1(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const density = 0.2; 
  const s = size * density;
  
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background
  pCtx.fillStyle = "#2e1065"; // Midnight Purple
  pCtx.fillRect(0, 0, s, s);

  pCtx.strokeStyle = "#a855f7"; // Neon Purple
  pCtx.lineWidth = s / 4;
  pCtx.beginPath();
  
  // Main diagonal: Top-Right to Bottom-Left
  pCtx.moveTo(s, 0); 
  pCtx.lineTo(0, s);

  // Corner 1: Offset to fill the top-left gap
  pCtx.moveTo(s / 2, -s / 2); 
  pCtx.lineTo(-s / 2, s / 2);

  // Corner 2: Offset to fill the bottom-right gap
  pCtx.moveTo(s * 1.5, s / 2); 
  pCtx.lineTo(s / 2, s * 1.5);
  
  pCtx.stroke();

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}


export function textureCrosshatch(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const density = 0.2; 
  const s = size * density;
  
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background
  pCtx.fillStyle = "#fbbf24";
  pCtx.fillRect(0, 0, s, s);

  // Stroke Style
  pCtx.strokeStyle = "#d97706";
  pCtx.lineWidth = s / 8; // Thinner lines look better for crosshatching
  pCtx.beginPath();

  /* --- Direction 1: Top-Left to Bottom-Right --- */
  pCtx.moveTo(0, 0); pCtx.lineTo(s, s);
  pCtx.moveTo(-s/2, s/2); pCtx.lineTo(s/2, s * 1.5);
  pCtx.moveTo(s/2, -s/2); pCtx.lineTo(s * 1.5, s/2);

  /* --- Direction 2: Top-Right to Bottom-Left --- */
  pCtx.moveTo(s, 0); pCtx.lineTo(0, s);
  pCtx.moveTo(s / 2, -s / 2); pCtx.lineTo(-s / 2, s / 2);
  pCtx.moveTo(s * 1.5, s / 2); pCtx.lineTo(s / 2, s * 1.5);
  
  pCtx.stroke();

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  
  // High-DPI Fix
  if (pattern) {
    const matrix = new DOMMatrix();
    pattern.setTransform(matrix.scale(1 / dpr, 1 / dpr));
  }
  
  return pattern;
}

export function textureCrosshatch1(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const density = 0.2; 
  const s = size * density;
  
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

// Background
  pCtx.fillStyle = "#020617";
  pCtx.fillRect(0, 0, s, s);

  // Stroke Style
  pCtx.strokeStyle = "#22d3ee";
  pCtx.lineWidth = s / 8; // Thinner lines look better for crosshatching
  pCtx.beginPath();

  /* --- Direction 1: Top-Left to Bottom-Right --- */
  pCtx.moveTo(0, 0); pCtx.lineTo(s, s);
  pCtx.moveTo(-s/2, s/2); pCtx.lineTo(s/2, s * 1.5);
  pCtx.moveTo(s/2, -s/2); pCtx.lineTo(s * 1.5, s/2);

  /* --- Direction 2: Top-Right to Bottom-Left --- */
  pCtx.moveTo(s, 0); pCtx.lineTo(0, s);
  pCtx.moveTo(s / 2, -s / 2); pCtx.lineTo(-s / 2, s / 2);
  pCtx.moveTo(s * 1.5, s / 2); pCtx.lineTo(s / 2, s * 1.5);
  
  pCtx.stroke();

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  
  // High-DPI Fix
  if (pattern) {
    const matrix = new DOMMatrix();
    pattern.setTransform(matrix.scale(1 / dpr, 1 / dpr));
  }
  
  return pattern;
}

export function textureChevron(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const density = 0.2; 
  const s = size * density;

  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  pCtx.fillStyle = "#ec4899";
  pCtx.fillRect(0, 0, s, s);

  pCtx.strokeStyle = "#ffffff";
  pCtx.lineWidth = s * 0.15;
  pCtx.lineJoin = "round";
  
  const mid = s / 2;
  pCtx.beginPath();
  pCtx.moveTo(0, mid); pCtx.lineTo(mid, 0); pCtx.lineTo(s, mid);
  pCtx.moveTo(0, s + mid); pCtx.lineTo(mid, s); pCtx.lineTo(s, s + mid);
  pCtx.stroke();

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureChevron1(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const density = 0.2; 
  const s = size * density;

  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

// Background
  pCtx.fillStyle = "#6366f1";
  pCtx.fillRect(0, 0, s, s);

  // Stroke Style
  pCtx.strokeStyle = "#22d3ee";
  pCtx.lineWidth = s * 0.15;
  pCtx.lineJoin = "round";
  
  const mid = s / 2;
  pCtx.beginPath();
  pCtx.moveTo(0, mid); pCtx.lineTo(mid, 0); pCtx.lineTo(s, mid);
  pCtx.moveTo(0, s + mid); pCtx.lineTo(mid, s); pCtx.lineTo(s, s + mid);
  pCtx.stroke();

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureChevron2(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const density = 0.2; 
  const s = size * density;

  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background
  pCtx.fillStyle = "#f97316";
  pCtx.fillRect(0, 0, s, s);

  // Stroke Style
  pCtx.strokeStyle = "#fff7ed";
  pCtx.lineWidth = s * 0.15;
  pCtx.lineJoin = "round";
  
  const mid = s / 2;
  pCtx.beginPath();
  
  // Vertical Chevron Logic: Points left/right and repeats
  // Main Chevron
  pCtx.moveTo(mid, 0); 
  pCtx.lineTo(0, mid); 
  pCtx.lineTo(mid, s);

  // Offset Chevron for seamless tiling
  pCtx.moveTo(s + mid, 0); 
  pCtx.lineTo(s, mid); 
  pCtx.lineTo(s + mid, s);
  
  pCtx.stroke();

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}
export function textureHexagon(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const density = 0.2;
  const s = size * density;
  const h = s * Math.sqrt(3);

  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * 2 * dpr; pCanvas.height = h * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  pCtx.fillStyle = "#22c55e";
  pCtx.fillRect(0, 0, s * 2, h);

  const drawHex = (x: number, y: number, r: number) => {
    pCtx.beginPath();
    for (let i = 0; i < 6; i++) {
      pCtx.lineTo(x + r * Math.cos(i * Math.PI / 3), y + r * Math.sin(i * Math.PI / 3));
    }
    pCtx.closePath();
    pCtx.stroke();
  };

  pCtx.strokeStyle = "#ffffff";
  pCtx.lineWidth = 1.5;
  drawHex(0, 0, s);
  drawHex(s * 1.5, h / 2, s);
  drawHex(0, h, s);

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureSteps(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const density = 0.3;
  const s = size * density;

  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  pCtx.fillStyle = "#f8fafc";
  pCtx.fillRect(0, 0, s, s);
  
  pCtx.fillStyle = "#cbd5e1";
  const step = s / 4;
  for (let i = 0; i < 4; i++) {
    pCtx.fillRect(i * step, (3 - i) * step, step, s);
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureSteps1(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const density = 0.2;
  const s = size * density;

  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background: Deep Charcoal
  pCtx.fillStyle = "#111827";
  pCtx.fillRect(0, 0, s, s);
  
  // Step Color: Toxic Lime
  pCtx.fillStyle = "#bef264";
  const step = s / 4;
  for (let i = 0; i < 4; i++) {
    // Reversed logic: i * step for vertical instead of (3 - i)
    pCtx.fillRect(i * step, i * step, step, s);
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureWaves(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.4);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  pCtx.fillStyle = "#111827"; // Near Black
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  pCtx.strokeStyle = "#bef264"; // Lime
  pCtx.lineWidth = 2.0;
  
  const cycles = 1.5; // Lazy, rolling waves
  const frequency = (Math.PI * 2 * cycles) / s; 
  const amplitude = s * 0.12;
  const step = s / 3; // Wider gaps

  pCtx.beginPath();
  for (let i = 0; i < s; i += step) {
    [0, s, -s].forEach(offset => {
      pCtx.moveTo(i + offset + Math.sin(0) * amplitude, 0);
      for (let y = 1; y <= s; y++) {
        const xOffset = Math.sin(y * frequency) * amplitude;
        pCtx.lineTo(i + offset + xOffset, y);
      }
    });
  }
  pCtx.stroke();

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureWavesHorizontal(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.4);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  pCtx.fillStyle = "#f0fdf4";
  pCtx.fillRect(-1, -1, s + 2, s + 2); // Background bleed

  pCtx.strokeStyle = "#16a34a";
  pCtx.lineWidth = 1.5;
  
  const frequency = (Math.PI * 4) / s; 
  const amplitude = s * 0.08;
  const step = s / 4;

  pCtx.beginPath();
  for (let j = 0; j < s; j += step) {
    [0, s, -s].forEach(offset => {
      pCtx.moveTo(0, j + offset + Math.sin(0) * amplitude);
      for (let x = 1; x <= s; x++) {
        const yOffset = Math.sin(x * frequency) * amplitude;
        pCtx.lineTo(x, j + offset + yOffset);
      }
    });
  }
  pCtx.stroke();

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureWaves1(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.4);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  pCtx.fillStyle = "#0f172a"; // Deep Charcoal
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  pCtx.strokeStyle = "#22d3ee"; // Electric Cyan
  pCtx.lineWidth = 1.5;
  
  const cycles = 2;
  const frequency = (Math.PI * 2 * cycles) / s; 
  const amplitude = s * 0.08;
  const step = s / 4;

  pCtx.beginPath();
  for (let i = 0; i < s; i += step) {
    [0, s, -s].forEach(offset => {
      pCtx.moveTo(i + offset + Math.sin(0) * amplitude, 0);
      for (let y = 1; y <= s; y++) {
        const xOffset = Math.sin(y * frequency) * amplitude;
        pCtx.lineTo(i + offset + xOffset, y);
      }
    });
  }
  pCtx.stroke();

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureWavesHorizontal1(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.4);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  pCtx.fillStyle = "#e0f2fe";
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  pCtx.strokeStyle = "#0ea5e9";
  pCtx.lineWidth = 1.2;
  
  const frequency = (Math.PI * 6) / s; 
  const amplitude = s * 0.05;
  const step = s / 4;

  pCtx.beginPath();
  for (let j = 0; j < s; j += step) {
    [0, s, -s].forEach(offset => {
      pCtx.moveTo(0, j + offset + Math.sin(0) * amplitude);
      for (let x = 1; x <= s; x++) {
        const yOffset = Math.sin(x * frequency) * amplitude;
        pCtx.lineTo(x, j + offset + yOffset);
      }
    });
  }
  pCtx.stroke();

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureWavesCross(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.4);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background: Deep Slate
  pCtx.fillStyle = "#0f172a";
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const frequency = (Math.PI * 4) / s; 
  const amplitude = s * 0.08;
  const step = s / 4;
  pCtx.lineWidth = 1.5;

  // --- Vertical Waves (Cyan) ---
  pCtx.strokeStyle = "#22d3ee";
  pCtx.beginPath();
  for (let i = 0; i < s; i += step) {
    [0, s, -s].forEach(offset => {
      pCtx.moveTo(i + offset + Math.sin(0) * amplitude, 0);
      for (let y = 1; y <= s; y++) {
        const xOffset = Math.sin(y * frequency) * amplitude;
        pCtx.lineTo(i + offset + xOffset, y);
      }
    });
  }
  pCtx.stroke();

  // --- Horizontal Waves (Pink) ---
  pCtx.strokeStyle = "#f472b6";
  pCtx.beginPath();
  for (let j = 0; j < s; j += step) {
    [0, s, -s].forEach(offset => {
      pCtx.moveTo(0, j + offset + Math.sin(0) * amplitude);
      for (let x = 1; x <= s; x++) {
        const yOffset = Math.sin(x * frequency) * amplitude;
        pCtx.lineTo(x, j + offset + yOffset);
      }
    });
  }
  pCtx.stroke();

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureSquiggles(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = size * 0.4;
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  const pseudoRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  pCtx.fillStyle = "#fff1f2";
  pCtx.fillRect(0, 0, s, s);
  pCtx.strokeStyle = "#e11d48";
  pCtx.lineWidth = 2;
  pCtx.lineCap = "round";

  for (let i = 0; i < 3; i++) {
    // Deterministic anchors based on index i
    const xStart = pseudoRandom(i + 1) * s;
    const cp1x = pseudoRandom(i + 2) * s;
    const cp2x = pseudoRandom(i + 3) * s;
    const xEnd = xStart; // Start and end at same X for seamless vertical tile

    pCtx.beginPath();
    pCtx.moveTo(xStart, 0);
    pCtx.bezierCurveTo(cp1x, s * 0.3, cp2x, s * 0.6, xEnd, s);
    pCtx.stroke();
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureNoise(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = 40; 
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  const pseudoRandom = (x: number, y: number) => {
    const val = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123;
    return val - Math.floor(val);
  };

  for (let x = 0; x < s; x++) {
    for (let y = 0; y < s; y++) {
      const val = pseudoRandom(x, y) * 255;
      pCtx.fillStyle = `rgba(${val}, ${val}, ${val}, 0.15)`;
      pCtx.fillRect(x, y, 1, 1);
    }
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureNoise1(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = 40; 
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  const pseudoRandom = (x: number, y: number, seed: number) => {
    const val = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453123;
    return val - Math.floor(val);
  };

  // Using a step of 2 or 4 makes it look like "Big" pixels
  const step = 2; 

  for (let x = 0; x < s; x += step) {
    for (let y = 0; y < s; y += step) {
      // Different seeds for R, G, and B create vibrant colored noise
      const r = pseudoRandom(x, y, 1) * 255;
      const g = pseudoRandom(x, y, 2) * 255;
      const b = pseudoRandom(x, y, 3) * 255;
      
      pCtx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.3)`;
      pCtx.fillRect(x, y, step, step);
    }
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureRipples(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = size * 0.4;
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  pCtx.fillStyle = "#e0f2fe";
  pCtx.fillRect(0, 0, s, s);
  pCtx.strokeStyle = "#0ea5e9";
  pCtx.lineWidth = 1.2;

  const drawRipple = (cx: number, cy: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        for (let r = 3; r < 15; r += 5) {
          pCtx.beginPath();
          pCtx.arc(cx + dx, cy + dy, r, Math.PI * 0.1, Math.PI * 1.7);
          pCtx.stroke();
        }
      });
    });
  };

  drawRipple(s * 0.25, s * 0.25);
  drawRipple(s * 0.75, s * 0.75);

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureRipples1(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = size * 0.4;
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  pCtx.fillStyle = "#e0f2fe";
  pCtx.fillRect(0, 0, s, s);
  pCtx.strokeStyle = "#0ee92b";
  pCtx.lineWidth = 1.2;

  const drawRipple = (cx: number, cy: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        for (let r = 3; r < 60; r += 20) {
          pCtx.beginPath();
          pCtx.arc(cx + dx, cy + dy, r, Math.PI * 0.1, Math.PI * 1.7);
          pCtx.stroke();
        }
      });
    });
  };

  drawRipple(s * 0.25, s * 0.25);
  drawRipple(s * 0.75, s * 0.75);

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureTopography(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = size * 0.6;
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  pCtx.fillStyle = "#fefce8";
  pCtx.fillRect(0, 0, s, s);
  pCtx.strokeStyle = "#ca8a04";
  pCtx.lineWidth = 1;

  const cx = s / 2, cy = s / 2;
  for (let r = s * 0.1; r < s * 0.9; r += s * 0.15) {
    pCtx.beginPath();
    for (let a = 0; a <= Math.PI * 2.1; a += 0.2) {
      const drift = Math.sin(a * 3) * (s * 0.05); // Wavy contour
      pCtx.lineTo(cx + (r + drift) * Math.cos(a), cy + (r + drift) * Math.sin(a));
    }
    pCtx.stroke();
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureTopography1(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = size * 0.8;
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background: Parchment/Cream
  pCtx.fillStyle = "#fffbeb";
  pCtx.fillRect(0, 0, s, s);

  // Stroke: Deep Forest Green
  pCtx.strokeStyle = "#166534";
  pCtx.lineWidth = 1;

  for (let r = s * 0.1; r < s * 1.2; r += s * 0.12) {
    // The "center" drifts as the radius increases
    const offsetX = (r / s) * (s * 0.3);
    const offsetY = (r / s) * (s * 0.2);
    const cx = s * 0.4 + offsetX;
    const cy = s * 0.4 + offsetY;

    pCtx.beginPath();
    for (let a = 0; a <= Math.PI * 2.1; a += 0.1) {
      const noise = Math.sin(a * 4) * (s * 0.04) + Math.cos(a * 2) * (s * 0.02);
      pCtx.lineTo(cx + (r + noise) * Math.cos(a), cy + (r + noise) * Math.sin(a));
    }
    pCtx.stroke();
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureTopography2(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = size * 0.8;
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background: Charcoal
  pCtx.fillStyle = "#18181b";
  pCtx.fillRect(0, 0, s, s);

  // Stroke: Vivid Orange
  pCtx.strokeStyle = "#f97316";
  pCtx.lineWidth = 1.5;

  const cx = s / 2, cy = s / 2;
  for (let r = s * 0.05; r < s * 0.8; r += s * 0.15) {
    pCtx.beginPath();
    for (let a = 0; a <= Math.PI * 2.2; a += 0.15) {
      // Complex drift using two sine waves for more "rugged" edges
      const drift = Math.sin(a * 5) * (s * 0.03) + Math.sin(a * 10) * (s * 0.01);
      pCtx.lineTo(cx + (r + drift) * Math.cos(a), cy + (r + drift) * Math.sin(a));
    }
    pCtx.stroke();
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureHearts(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.4);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  pCtx.fillStyle = "#fff0f3"; // Soft pink bg
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawHeart = (cx: number, cy: number, r: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        pCtx.beginPath();
        pCtx.moveTo(x, y + r);
        pCtx.bezierCurveTo(x - r, y - r/2, x - r, y - r*1.5, x, y - r/2);
        pCtx.bezierCurveTo(x + r, y - r*1.5, x + r, y - r/2, x, y + r);
        pCtx.fill();
      });
    });
  };

  pCtx.fillStyle = "#ff85a1";
  drawHeart(s * 0.5, s * 0.5, s * 0.2);
  
  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}


export function texturePixelHearts(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  // Use a slightly larger tile size for pixel grids so they don't feel too cramped
  const s = Math.round(size * 0.5); 
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background: Pale Cream Pink
  pCtx.fillStyle = "#fff5f5"; 
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  // The pixel unit size
  const p = s / 12; 

  // Helper to draw a pixel rect that handles wrapping
  const drawPixel = (rx: number, ry: number) => {
      // Base coordinates centered in the tile
      const bx = s/2 - (3.5 * p);
      const by = s/2 - (3 * p);
      
      [0, s, -s].forEach(dx => {
         [0, s, -s].forEach(dy => {
             pCtx.fillRect(bx + rx * p + dx, by + ry * p + dy, p, p);
         });
      });
  }

  // Heart Color: Deep Red
  pCtx.fillStyle = "#e0245e";
  
  // Drawing the 7x6 pixel heart pattern row by row
  // Row 1 (Top peaks)
  drawPixel(1, 0); drawPixel(2, 0); drawPixel(4, 0); drawPixel(5, 0);
  // Row 2
  drawPixel(0, 1); drawPixel(3, 1); drawPixel(6, 1);
  // Row 3
  drawPixel(0, 2); drawPixel(6, 2);
  // Row 4
  drawPixel(1, 3); drawPixel(5, 3);
  // Row 5
  drawPixel(2, 4); drawPixel(4, 4);
  // Row 6 (Bottom tip)
  drawPixel(3, 5);

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureGeoHearts(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.5);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background: Soft Lavender
  pCtx.fillStyle = "#f3e8ff";
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawGeoHeart = (cx: number, cy: number, r: number, color: string) => {
    pCtx.fillStyle = color;
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        pCtx.beginPath();
        // Bottom tip
        pCtx.moveTo(x, y + r);
        // Right side -> Top Right Peak -> Top Center Dip -> Top Left Peak -> Left Side -> close
        pCtx.lineTo(x + r, y - r * 0.5);
        pCtx.lineTo(x + r * 0.5, y - r);
        pCtx.lineTo(x, y - r * 0.5);
        pCtx.lineTo(x - r * 0.5, y - r);
        pCtx.lineTo(x - r, y - r * 0.5);
        pCtx.closePath();
        pCtx.fill();
      });
    });
  };

  // Draw two hearts in an offset pattern
  // 1. Center Heart (Darker Purple)
  drawGeoHeart(s * 0.5, s * 0.5, s * 0.2, "#9333ea");
  
  // 2. Corner Heart (Lighter Purple) - draws at 0,0 which wraps to all corners
  drawGeoHeart(0, 0, s * 0.15, "#c084fc");

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureStars(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.4);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  pCtx.fillStyle = "#0f172a"; // Night sky
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawStar = (cx: number, cy: number, r: number, points: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        pCtx.beginPath();
        for (let i = 0; i < points * 2; i++) {
          const angle = (i * Math.PI) / points;
          const dist = i % 2 === 0 ? r : r / 2.5;
          pCtx.lineTo(cx + dx + Math.cos(angle) * dist, cy + dy + Math.sin(angle) * dist);
        }
        pCtx.closePath();
        pCtx.fill();
      });
    });
  };

  pCtx.fillStyle = "#fde047";
  drawStar(s * 0.5, s * 0.5, s * 0.2, 5);
  
  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureConfettiStars(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  // Slightly larger tile size than before to allow more space for scattering
  const s = Math.round(size * 0.5);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background: Deep Night Sky
  pCtx.fillStyle = "#0f172a";
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  // Updated helper: Added 'rotationOffset' parameter
  const drawRotatedStar = (cx: number, cy: number, r: number, points: number, rotationOffset: number) => {
    // The nested forEach loops ensure seamless tiling if a star crosses the edge
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        pCtx.beginPath();
        for (let i = 0; i < points * 2; i++) {
          // Add the rotation offset to the angle calculation
          const angle = (i * Math.PI) / points + rotationOffset;
          // Inner radius varies based on points for better shape aesthetics
          const innerRDivider = points === 4 ? 2.8 : 2.4; 
          const dist = i % 2 === 0 ? r : r / innerRDivider;
          pCtx.lineTo(cx + dx + Math.cos(angle) * dist, cy + dy + Math.sin(angle) * dist);
        }
        pCtx.closePath();
        pCtx.fill();
      });
    });
  };

  // Define the confetti data manually to ensure a balanced, non-clumping scatter.
  // Positions (x, y) and radii (r) are relative to the tile size 's' (0.0 to 1.0).
  const confettiData = [
    // Main Yellow 5-point
    { x: 0.5, y: 0.4, r: 0.12, pts: 5, rot: 0.2, color: "#fde047" },
    // Cyan 4-point (sharp)
    { x: 0.2, y: 0.8, r: 0.09, pts: 4, rot: 0.8, color: "#22d3ee" },
    // Magenta 5-point tumbling
    { x: 0.8, y: 0.2, r: 0.1, pts: 5, rot: -0.4, color: "#e879f9" },
    // Tiny white/blue 6-point near edge
    { x: 0.1, y: 0.15, r: 0.06, pts: 6, rot: 0.1, color: "#a5b4fc" },
    // Another yellow near bottom right
    { x: 0.75, y: 0.75, r: 0.08, pts: 5, rot: 1.2, color: "#fde047" },
    // Small cyan near center
    { x: 0.35, y: 0.55, r: 0.07, pts: 5, rot: -0.9, color: "#22d3ee" },
  ];

  // Draw all the stars in the data array
  confettiData.forEach(data => {
      pCtx.fillStyle = data.color;
      drawRotatedStar(s * data.x, s * data.y, s * data.r, data.pts, data.rot);
  });
  
  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureRainbows(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.5);
  
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; 
  pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  const pseudoRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Background
  pCtx.fillStyle = "#f3e8ff"; 
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const colors = ["#ff0054", "#ffbd00", "#70e000", "#00b4d8", "#9d4edd"];
  
  const drawRainbowWrap = (cx: number, cy: number, r: number) => {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const x = cx + dx * s;
        const y = cy + dy * s;
        const thickness = r * 0.2; 

        colors.forEach((color, i) => {
          pCtx.strokeStyle = color;
          pCtx.lineWidth = thickness;
          pCtx.lineCap = "round";
          pCtx.beginPath();
          const bandRadius = r - (i * (thickness * 0.85));
          if (bandRadius > 0) {
            pCtx.arc(x, y, bandRadius, Math.PI, 0);
            pCtx.stroke();
          }
        });
      }
    }
  };

  // Use a 2x2 grid to prevent overlaps
  const gridDivisions = 2;
  const cellSize = (s / gridDivisions);

  for (let row = 0; row < gridDivisions; row++) {
    for (let col = 0; col < gridDivisions; col++) {
      const seed = row * gridDivisions + col;
      
      // Calculate center of the grid cell
      const cellCenterX = (col + 0.5) * cellSize;
      const cellCenterY = (row + 0.5) * cellSize;

      // Jitter (offset) position within the cell (max 30% of cell size)
      const jx = (pseudoRandom(seed + 1) - 0.5) * (cellSize * 0.4);
      const jy = (pseudoRandom(seed + 2) - 0.5) * (cellSize * 0.4);
      
      // Dramatic size variation (between 15% and 35% of tile size)
      const rr = s * 0.12 + pseudoRandom(seed + 3) * (s * 0.18);
      
      drawRainbowWrap(cellCenterX + jx, cellCenterY + jy, rr);
    }
  }
  
  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  const matrix = new DOMMatrix();
  pattern.setTransform(matrix.scale(1 / dpr, 1 / dpr));
  
  return pattern;
}

export function textureRetroRainbows(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.6);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background: Soft Sky Blue
  pCtx.fillStyle = "#e0f2fe"; 
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const colors = ["#ef4444", "#fb923c", "#facc15", "#4ade80", "#3b82f6"];
  
  const drawRainbowLine = (cx: number, cy: number, r: number) => {
    const thickness = r * 0.15;
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        colors.forEach((color, i) => {
          pCtx.strokeStyle = color;
          pCtx.lineWidth = thickness;
          pCtx.beginPath();
          pCtx.arc(cx + dx, cy + dy, r - (i * thickness), Math.PI, 0);
          pCtx.stroke();
        });
      });
    });
  };

  // Fixed positions for a clean, interlocking look
  drawRainbowLine(s * 0.5, s * 0.6, s * 0.4);
  drawRainbowLine(0, s * 0.1, s * 0.3);
  drawRainbowLine(s, s * 0.1, s * 0.3);

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureRainbowRibbons(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 1.5);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background
  pCtx.fillStyle = "#0f172a";
  pCtx.fillRect(0, 0, s, s);

  const colors = ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93"];
  const thickness = 6;
  const amplitude = 20;
  const frequency = (Math.PI * 2) / s;

  // Draw 3 distinct ribbon groups
  for (let group = 0; group < 3; group++) {
    const yBase = (s / 3) * group;
    const phaseShift = group * 2; // Different start points for each ribbon

    colors.forEach((color, i) => {
      pCtx.strokeStyle = color;
      pCtx.lineWidth = thickness;
      pCtx.lineCap = "round";
      pCtx.lineJoin = "round";

      // The key to seamlessness: draw the ribbon at multiple vertical offsets
      const verticalOffsets = [0, s, -s];

      verticalOffsets.forEach(vOffset => {
        pCtx.beginPath();
        for (let x = 0; x <= s; x++) {
          // Vertical offset (i * thickness) stacks the colors
          const y = yBase + vOffset + Math.sin(x * frequency + phaseShift) * amplitude + (i * thickness);
          
          if (x === 0) pCtx.moveTo(x, y);
          else pCtx.lineTo(x, y);
        }
        pCtx.stroke();
      });
    });
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureRainbowFlag(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.5);
  
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; 
  pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // The 6 standard Pride colors
  const colors = [
    "#E40303", // Red
    "#FF8C00", // Orange
    "#FFED00", // Yellow
    "#008026", // Green
    "#004DFF", // Blue
    "#732982"  // Violet
  ];

  const stripeHeight = s / colors.length;

  // Draw stripes
  colors.forEach((color, i) => {
    pCtx.fillStyle = color;
    pCtx.fillRect(0, i * stripeHeight, s, stripeHeight);
  });

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  
  return pattern;
}

export function textureSmileys(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.4);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  pCtx.fillStyle = "#ffefcd";
  pCtx.fillRect(-1, -1, s + 1, s + 1);

  const drawSmiley = (cx: number, cy: number, r: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        // Face
        pCtx.fillStyle = "#ffcc33";
        pCtx.beginPath(); pCtx.arc(x, y, r, 0, Math.PI * 2); pCtx.fill();
        // Eyes
        pCtx.fillStyle = "#333";
        pCtx.beginPath(); pCtx.arc(x - r/3, y - r/4, r/6, 0, Math.PI * 2); pCtx.fill();
        pCtx.beginPath(); pCtx.arc(x + r/3, y - r/4, r/6, 0, Math.PI * 2); pCtx.fill();
        // Smile
        pCtx.strokeStyle = "#333"; pCtx.lineWidth = 1.2; pCtx.lineCap = "round";
        pCtx.beginPath(); pCtx.arc(x, y + r/8, r/2, 0.2 * Math.PI, 0.8 * Math.PI); pCtx.stroke();
      });
    });
  };

  drawSmiley(s * 0.5, s * 0.5, s * 0.25);
  
  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureBubbles(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.5);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  pCtx.fillStyle = "#74c0fc"; // Sky blue
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawBubble = (cx: number, cy: number, r: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        // Outer rim
        pCtx.strokeStyle = "rgba(255,255,255,0.7)";
        pCtx.lineWidth = 0.9;
        pCtx.beginPath(); pCtx.arc(x, y, r, 0, Math.PI * 2); pCtx.stroke();
        // Shine
        pCtx.fillStyle = "rgba(255,255,255,0.5)";
        pCtx.beginPath(); pCtx.arc(x - r/3, y - r/3, r/4, 0, Math.PI * 2); pCtx.fill();
      });
    });
  };

  drawBubble(s * 0.3, s * 0.4, s * 0.15);
  drawBubble(s * 0.7, s * 0.8, s * 0.1);
  
  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureDoodles(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.4);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  pCtx.fillStyle = "#2de9c9";
  pCtx.fillRect(-1, -1, s + 3, s + 3);
  pCtx.strokeStyle = "#4dabf7";
  pCtx.lineWidth = 1.8;
  pCtx.lineCap = "round";

  const drawX = (cx: number, cy: number, r: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        pCtx.beginPath();
        pCtx.moveTo(x - r, y - r); pCtx.lineTo(x + r, y + r);
        pCtx.moveTo(x + r, y - r); pCtx.lineTo(x - r, y + r);
        pCtx.stroke();
      });
    });
  };

  drawX(s * 0.25, s * 0.25, s * 0.05);
  drawX(s * 0.75, s * 0.75, s * 0.05);
  
  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureMixedSmileys(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.8); // Larger tile to fit multiple faces
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  const pseudoRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  pCtx.fillStyle = "#fff9db"; // Soft yellow bg
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawFace = (cx: number, cy: number, r: number, type: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        // Head
        pCtx.fillStyle = "#ffcc33";
        pCtx.beginPath(); pCtx.arc(x, y, r, 0, Math.PI * 2); pCtx.fill();
        
        pCtx.fillStyle = "#333";
        pCtx.strokeStyle = "#333";
        pCtx.lineWidth = 1.5;
        pCtx.lineCap = "round";

        if (type < 0.3) { // Surprise Face
          pCtx.beginPath(); pCtx.arc(x - r/3, y - r/4, r/8, 0, Math.PI * 2); pCtx.fill();
          pCtx.beginPath(); pCtx.arc(x + r/3, y - r/4, r/8, 0, Math.PI * 2); pCtx.fill();
          pCtx.beginPath(); pCtx.arc(x, y + r/3, r/4, 0, Math.PI * 2); pCtx.stroke();
        } else if (type < 0.6) { // Winking Face
          // Left Eye (Wink)
          pCtx.beginPath(); pCtx.moveTo(x - r/2, y - r/4); pCtx.lineTo(x - r/6, y - r/4); pCtx.stroke();
          // Right Eye
          pCtx.beginPath(); pCtx.arc(x + r/3, y - r/4, r/8, 0, Math.PI * 2); pCtx.fill();
          // Smile
          pCtx.beginPath(); pCtx.arc(x, y + r/8, r/2, 0.2 * Math.PI, 0.8 * Math.PI); pCtx.stroke();
        } else { // Cool/Chill Face
          pCtx.fillRect(x - r/2, y - r/3, r/3, r/6); // Shades
          pCtx.fillRect(x + r/6, y - r/3, r/3, r/6);
          pCtx.beginPath(); pCtx.moveTo(x - r/3, y + r/2); pCtx.lineTo(x + r/3, y + r/2); pCtx.stroke();
        }
      });
    });
  };

  const grid = 2;
  for (let i = 0; i < grid; i++) {
    for (let j = 0; j < grid; j++) {
      const seed = i * grid + j;
      const x = (i + 0.5) * (s / grid) + (pseudoRandom(seed) - 0.5) * (s/6);
      const y = (j + 0.5) * (s / grid) + (pseudoRandom(seed + 1) - 0.5) * (s/6);
      const radius = s * 0.12 + pseudoRandom(seed + 2) * (s * 0.05);
      drawFace(x, y, radius, pseudoRandom(seed + 3));
    }
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureCuteBlush(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.5);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  pCtx.fillStyle = "#fff0f6";
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawFace = (cx: number, cy: number, r: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        pCtx.fillStyle = "#ffcc33";
        pCtx.beginPath(); pCtx.arc(x, y, r, 0, Math.PI * 2); pCtx.fill();

        // Cheeks
        pCtx.fillStyle = "rgba(255, 100, 100, 0.4)";
        pCtx.beginPath(); pCtx.arc(x - r/1.8, y + r/6, r/4, 0, Math.PI * 2); pCtx.fill();
        pCtx.beginPath(); pCtx.arc(x + r/1.8, y + r/6, r/4, 0, Math.PI * 2); pCtx.fill();

        // Eyes (Happy arcs)
        pCtx.strokeStyle = "#333"; pCtx.lineWidth = 1.2;
        pCtx.beginPath(); pCtx.arc(x - r/3, y - r/6, r/6, Math.PI, 0); pCtx.stroke();
        pCtx.beginPath(); pCtx.arc(x + r/3, y - r/6, r/6, Math.PI, 0); pCtx.stroke();
        
        // Smile
        pCtx.beginPath(); pCtx.arc(x, y + r/4, r/3, 0, Math.PI); pCtx.stroke();
      });
    });
  };

  drawFace(s * 0.5, s * 0.5, s * 0.22);
  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureLoveSmileys(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.6);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  pCtx.fillStyle = "#fff5f5";
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawLoveFace = (cx: number, cy: number, r: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        pCtx.fillStyle = "#ffd43b";
        pCtx.beginPath(); pCtx.arc(x, y, r, 0, Math.PI * 2); pCtx.fill();

        // Heart Eyes
        pCtx.fillStyle = "#fa4242";
        const drawHeart = (hx: number, hy: number, hr: number) => {
           pCtx.beginPath();
           pCtx.moveTo(hx, hy + hr);
           pCtx.bezierCurveTo(hx-hr, hy-hr/2, hx-hr, hy-hr*1.5, hx, hy-hr/2);
           pCtx.bezierCurveTo(hx+hr, hy-hr*1.5, hx+hr, hy-hr/2, hx, hy+hr);
           pCtx.fill();
        };
        drawHeart(x - r/2.5, y - r/4, r/4);
        drawHeart(x + r/2.5, y - r/4, r/4);

        // Smile
        pCtx.strokeStyle = "#333"; pCtx.lineWidth = 1.2;
        pCtx.beginPath(); pCtx.arc(x, y + r/8, r/2, 0.1 * Math.PI, 0.9 * Math.PI); pCtx.stroke();
      });
    });
  };

  drawLoveFace(s * 0.5, s * 0.5, s * 0.25);
  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureAngrySmiley(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.6); // Medium tile size
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background: A slightly tense greyish-white
  pCtx.fillStyle = "#ffc0c0";
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawAngryFace = (cx: number, cy: number, r: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        
        // Base Face Circle
        pCtx.fillStyle = "#ff3b3b";
        pCtx.beginPath(); pCtx.arc(x, y, r, 0, Math.PI * 2); pCtx.fill();

        // "Rage" Blush (Reddish cheeks)
        pCtx.fillStyle = "rgba(200, 50, 50, 0.3)";
        pCtx.beginPath(); pCtx.arc(x - r/1.8, y + r/5, r/5, 0, Math.PI * 2); pCtx.fill();
        pCtx.beginPath(); pCtx.arc(x + r/1.8, y + r/5, r/5, 0, Math.PI * 2); pCtx.fill();

        // Common stroke style for features
        pCtx.strokeStyle = "#333";
        pCtx.fillStyle = "#333";
        pCtx.lineWidth = r * 0.11; // Thicker lines for anger
        pCtx.lineCap = "round";

        // Eyebrows (Angled down towards center)
        pCtx.beginPath();
        // Left brow
        pCtx.moveTo(x - r/1.4, y - r/3.5);
        pCtx.lineTo(x - r/8, y - r/10);
        // Right brow
        pCtx.moveTo(x + r/1.4, y - r/3.5);
        pCtx.lineTo(x + r/8, y - r/10);
        pCtx.stroke();

        // Eyes (Small dots under the brows)
        const eyeR = r * 0.1;
        pCtx.beginPath(); pCtx.arc(x - r/3, y + r/20, eyeR, 0, Math.PI * 2); pCtx.fill();
        pCtx.beginPath(); pCtx.arc(x + r/3, y + r/20, eyeR, 0, Math.PI * 2); pCtx.fill();

        // Mouth (Frown - downward arc)
        pCtx.lineWidth = r * 0.09;
        pCtx.beginPath();
        // Draw an arc centered lower down, using angles that create the top half of a circle
        pCtx.arc(x, y + r/1.5, r/2.2, Math.PI * 1.15, Math.PI * 1.85);
        pCtx.stroke();
      });
    });
  };

  drawAngryFace(s * 0.5, s * 0.5, s * 0.25);
  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureDisgustingPoop(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.5); // Slightly larger tile for detail
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background: "Dirty" muddy beige
  pCtx.fillStyle = "#d7ccc8";
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawGrossPoop = (cx: number, cy: number, r: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;

        // 1. 3D Body with Gradient
        const gradient = pCtx.createRadialGradient(x, y - r/2, r/4, x, y, r * 1.2);
        gradient.addColorStop(0, "#a1887f"); // Lighter top
        gradient.addColorStop(0.6, "#5d4037"); // Mid brown
        gradient.addColorStop(1, "#3e2723"); // Dark base shadows

        pCtx.fillStyle = gradient;
        pCtx.beginPath();
        pCtx.moveTo(x - r, y + r * 0.6);
        pCtx.bezierCurveTo(x - r * 1.2, y + r * 1.2, x + r * 1.2, y + r * 1.2, x + r, y + r * 0.6);
        pCtx.bezierCurveTo(x + r * 1.1, y + r * 0.1, x + r * 0.8, y - r * 0.2, x + r * 0.6, y - r * 0.2);
        pCtx.bezierCurveTo(x + r * 0.4, y - r * 0.6, x - r * 0.4, y - r * 0.6, x - r * 0.6, y - r * 0.2);
        pCtx.bezierCurveTo(x - r * 0.8, y - r * 0.2, x - r * 1.1, y + r * 0.1, x - r, y + r * 0.6);
        pCtx.fill();

        // 2. Pointy Top (Separate Gradient for depth)
        pCtx.beginPath();
        pCtx.moveTo(x - r * 0.4, y - r * 0.3);
        pCtx.bezierCurveTo(x - r * 0.3, y - r * 0.8, x + r * 0.3, y - r * 0.8, x, y - r * 1.1);
        pCtx.bezierCurveTo(x + r * 0.2, y - r * 0.8, x + r * 0.4, y - r * 0.3, x + r * 0.4, y - r * 0.3);
        pCtx.fill();

        // 3. Slime/Wet Highlights (The "Disgusting" part)
        pCtx.strokeStyle = "rgba(255, 255, 255, 0.25)";
        pCtx.lineWidth = r * 0.08;
        pCtx.lineCap = "round";
        
        pCtx.beginPath(); // Top sheen
        pCtx.arc(x + r*0.1, y - r*0.8, r*0.15, -Math.PI/2, 0);
        pCtx.stroke();
        
        pCtx.beginPath(); // Middle roll sheen
        pCtx.arc(x - r*0.5, y - r*0.1, r*0.2, Math.PI, 1.5 * Math.PI);
        pCtx.stroke();

        // 4. Tiny Flies
        pCtx.fillStyle = "#212121";
        const drawFly = (fx: number, fy: number) => {
            pCtx.beginPath();
            pCtx.arc(fx, fy, 1.5, 0, Math.PI * 2); // Body
            pCtx.fill();
            pCtx.fillStyle = "rgba(255,255,255,0.4)";
            pCtx.fillRect(fx - 2, fy - 2, 1, 1); // Wing left
            pCtx.fillRect(fx + 1, fy - 2, 1, 1); // Wing right
            pCtx.fillStyle = "#212121";
        };
        drawFly(x - r * 1.2, y - r * 0.5);
        drawFly(x + r * 1.1, y - r * 0.8);

        // 5. Classic Emoji Eyes (to keep it a "smiley")
        pCtx.fillStyle = "#fff";
        pCtx.beginPath(); pCtx.arc(x - r*0.35, y + r*0.1, r*0.2, 0, Math.PI*2); pCtx.fill();
        pCtx.beginPath(); pCtx.arc(x + r*0.35, y + r*0.1, r*0.2, 0, Math.PI*2); pCtx.fill();
        pCtx.fillStyle = "#000";
        pCtx.beginPath(); pCtx.arc(x - r*0.35, y + r*0.05, r*0.1, 0, Math.PI*2); pCtx.fill();
        pCtx.beginPath(); pCtx.arc(x + r*0.35, y + r*0.05, r*0.1, 0, Math.PI*2); pCtx.fill();
      });
    });
  };

  drawGrossPoop(s * 0.5, s * 0.5, s * 0.3);

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureHappyPoop(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.5);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background: Soft, happy pastel yellow
  pCtx.fillStyle = "#fff9db";
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawHappyPoop = (cx: number, cy: number, r: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;

        // 1. Warm Chocolate Gradient
        const gradient = pCtx.createRadialGradient(x, y - r/2, r/10, x, y, r * 1.5);
        gradient.addColorStop(0, "#a67c52"); // Light chocolate
        gradient.addColorStop(1, "#5c3d2e"); // Rich cocoa
        pCtx.fillStyle = gradient;

        // Swirl Shape (Bezier path)
        pCtx.beginPath();
        pCtx.moveTo(x - r, y + r * 0.6);
        pCtx.bezierCurveTo(x - r * 1.2, y + r * 1.2, x + r * 1.2, y + r * 1.2, x + r, y + r * 0.6);
        pCtx.bezierCurveTo(x + r * 1.1, y + r * 0.1, x + r * 0.8, y - r * 0.2, x + r * 0.6, y - r * 0.2);
        pCtx.bezierCurveTo(x + r * 0.4, y - r * 0.6, x - r * 0.4, y - r * 0.6, x - r * 0.6, y - r * 0.2);
        pCtx.bezierCurveTo(x - r * 0.8, y - r * 0.2, x - r * 1.1, y + r * 0.1, x - r, y + r * 0.6);
        pCtx.fill();

        // Top Point
        pCtx.beginPath();
        pCtx.moveTo(x - r * 0.4, y - r * 0.3);
        pCtx.bezierCurveTo(x - r * 0.3, y - r * 0.8, x + r * 0.3, y - r * 0.8, x, y - r * 1.1);
        pCtx.bezierCurveTo(x + r * 0.2, y - r * 0.8, x + r * 0.4, y - r * 0.3, x + r * 0.4, y - r * 0.3);
        pCtx.fill();

        // 2. Large Sparkle Eyes
        const drawEye = (ex: number, ey: number) => {
          pCtx.fillStyle = "#fff";
          pCtx.beginPath(); pCtx.arc(ex, ey, r * 0.22, 0, Math.PI * 2); pCtx.fill();
          pCtx.fillStyle = "#000";
          pCtx.beginPath(); pCtx.arc(ex, ey, r * 0.12, 0, Math.PI * 2); pCtx.fill();
          // Tiny white reflection sparkle
          pCtx.fillStyle = "#fff";
          pCtx.beginPath(); pCtx.arc(ex + r*0.04, ey - r*0.04, r * 0.05, 0, Math.PI * 2); pCtx.fill();
        };
        drawEye(x - r * 0.35, y + r * 0.1);
        drawEye(x + r * 0.35, y + r * 0.1);

        // 3. Big Open Smile
        pCtx.fillStyle = "#3e2723";
        pCtx.beginPath();
        pCtx.arc(x, y + r * 0.4, r * 0.35, 0, Math.PI); // Mouth semi-circle
        pCtx.fill();

        // 4. Magical Sparkles (instead of flies)
        const drawSparkle = (sx: number, sy: number, size: number) => {
          pCtx.fillStyle = "#fff";
          for (let i = 0; i < 4; i++) {
            pCtx.beginPath();
            pCtx.ellipse(sx, sy, size, size/4, (i * Math.PI)/2, 0, Math.PI * 2);
            pCtx.fill();
          }
        };
        drawSparkle(x - r * 1.1, y - r * 0.5, 3);
        drawSparkle(x + r * 0.9, y - r * 0.9, 2);
      });
    });
  };

  drawHappyPoop(s * 0.5, s * 0.5, s * 0.3);

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureUnicornLaughingPoop(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.6);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background: Soft magical lavender
  pCtx.fillStyle = "#fdf2ff";
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawUnicornPoop = (cx: number, cy: number, r: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;

        // 1. Pink-to-Purple "Magic" Gradient
        const gradient = pCtx.createLinearGradient(x, y - r, x, y + r);
        gradient.addColorStop(0, "#ff99c8"); // Sweet Pink
        gradient.addColorStop(1, "#a393eb"); // Soft Purple
        pCtx.fillStyle = gradient;

        // Swirl Shape
        pCtx.beginPath();
        pCtx.moveTo(x - r, y + r * 0.6);
        pCtx.bezierCurveTo(x - r * 1.2, y + r * 1.2, x + r * 1.2, y + r * 1.2, x + r, y + r * 0.6);
        pCtx.bezierCurveTo(x + r * 1.1, y + r * 0.1, x + r * 0.8, y - r * 0.2, x + r * 0.6, y - r * 0.2);
        pCtx.bezierCurveTo(x + r * 0.4, y - r * 0.6, x - r * 0.4, y - r * 0.6, x - r * 0.6, y - r * 0.2);
        pCtx.bezierCurveTo(x - r * 0.8, y - r * 0.2, x - r * 1.1, y + r * 0.1, x - r, y + r * 0.6);
        pCtx.fill();

        // Top Point
        pCtx.beginPath();
        pCtx.moveTo(x - r * 0.4, y - r * 0.3);
        pCtx.bezierCurveTo(x - r * 0.3, y - r * 0.8, x + r * 0.3, y - r * 0.8, x, y - r * 1.1);
        pCtx.bezierCurveTo(x + r * 0.2, y - r * 0.8, x + r * 0.4, y - r * 0.3, x + r * 0.4, y - r * 0.3);
        pCtx.fill();

        // 2. The Unicorn Horn
        // pCtx.fillStyle = "#fde047"; // Golden Yellow
        // pCtx.beginPath();
        // pCtx.moveTo(x, y - r * 1.6); // Top point of horn
        // pCtx.lineTo(x - r * 0.2, y - r * 0.9);
        // pCtx.lineTo(x + r * 0.2, y - r * 0.9);
        // pCtx.closePath();
        // pCtx.fill();
        
        // Horn Stripes
        // pCtx.strokeStyle = "#ca8a04";
        // pCtx.lineWidth = 1;
        // pCtx.beginPath();
        // pCtx.moveTo(x - r*0.1, y - r*1.3); pCtx.lineTo(x + r*0.1, y - r*1.3);
        // pCtx.moveTo(x - r*0.15, y - r*1.1); pCtx.lineTo(x + r*0.15, y - r*1.1);
        // pCtx.stroke();

        // 3. Laughing Eyes (^ ^)
        pCtx.strokeStyle = "#4b2c20"; // Dark cocoa brown for features
        pCtx.lineWidth = r * 0.1;
        pCtx.lineCap = "round";
        const eyeOffset = r * 0.35;
        const eyeY = y + r * 0.1;
        pCtx.beginPath(); pCtx.arc(x - eyeOffset, eyeY, r * 0.15, Math.PI, 0); pCtx.stroke();
        pCtx.beginPath(); pCtx.arc(x + eyeOffset, eyeY, r * 0.15, Math.PI, 0); pCtx.stroke();

        // 4. Laughing Mouth (Open with Tongue)
        pCtx.fillStyle = "#4b2c20";
        pCtx.beginPath();
        pCtx.arc(x, y + r * 0.4, r * 0.35, 0, Math.PI);
        pCtx.fill();
        
        // Tongue
        pCtx.fillStyle = "#ff85a1";
        pCtx.beginPath();
        pCtx.arc(x, y + r * 0.65, r * 0.15, Math.PI, 0, true);
        pCtx.fill();

        // 5. Colorful Sparkles
        const drawSparkle = (sx: number, sy: number, size: number, color: string) => {
          pCtx.fillStyle = color;
          for (let i = 0; i < 4; i++) {
            pCtx.beginPath();
            pCtx.ellipse(sx, sy, size, size/4, (i * Math.PI)/2, 0, Math.PI * 2);
            pCtx.fill();
          }
        };
        drawSparkle(x - r * 1.1, y - r * 0.6, 3, "#22d3ee"); // Cyan
        drawSparkle(x + r * 1.0, y - r * 1.2, 2, "#fde047"); // Gold
        drawSparkle(x + r * 0.9, y + r * 0.8, 2.5, "#ff0054"); // Hot Pink
      });
    });
  };

  drawUnicornPoop(s * 0.5, s * 0.5, s * 0.3);

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}
export function textureLeaves(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.5);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  pCtx.fillStyle = "#f0fdf4"; // Pale green bg
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawLeaf = (cx: number, cy: number, r: number, angle: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        pCtx.save();
        pCtx.translate(cx + dx, cy + dy);
        pCtx.rotate(angle);
        pCtx.fillStyle = "#22c55e";
        pCtx.beginPath();
        pCtx.moveTo(0, -r);
        pCtx.quadraticCurveTo(r, 0, 0, r);
        pCtx.quadraticCurveTo(-r, 0, 0, -r);
        pCtx.fill();
        pCtx.restore();
      });
    });
  };

  drawLeaf(s * 0.3, s * 0.3, s * 0.15, 0.5);
  drawLeaf(s * 0.7, s * 0.7, s * 0.12, -0.8);
  
  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureAutumnLeaves(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.6);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background: Warm Cream
  pCtx.fillStyle = "#fffbeb"; 
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawAutumnLeaf = (cx: number, cy: number, r: number, angle: number, color: string) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        pCtx.save();
        pCtx.translate(cx + dx, cy + dy);
        pCtx.rotate(angle);
        pCtx.fillStyle = color;
        
        pCtx.beginPath();
        pCtx.moveTo(0, -r);
        // Slightly sharper leaf shape
        pCtx.quadraticCurveTo(r * 0.7, 0, 0, r);
        pCtx.quadraticCurveTo(-r * 0.7, 0, 0, -r);
        pCtx.fill();

        // Subtle center vein
        pCtx.strokeStyle = "rgba(0,0,0,0.1)";
        pCtx.lineWidth = 1;
        pCtx.beginPath();
        pCtx.moveTo(0, -r);
        pCtx.lineTo(0, r * 0.8);
        pCtx.stroke();
        
        pCtx.restore();
      });
    });
  };

  drawAutumnLeaf(s * 0.2, s * 0.3, s * 0.15, 0.4, "#ef4444"); // Red
  drawAutumnLeaf(s * 0.7, s * 0.2, s * 0.12, -0.6, "#f59e0b"); // Gold
  drawAutumnLeaf(s * 0.5, s * 0.8, s * 0.14, 2.1, "#f97316"); // Orange
  
  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureBambooLeaves(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.5);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background: Deep Forest Green
  pCtx.fillStyle = "#064e3b"; 
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawSlenderLeaf = (cx: number, cy: number, r: number, angle: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        pCtx.save();
        pCtx.translate(cx + dx, cy + dy);
        pCtx.rotate(angle);
        pCtx.fillStyle = "#10b981"; // Vibrant Emerald
        
        pCtx.beginPath();
        pCtx.moveTo(0, -r * 1.5); // Stretched length
        pCtx.quadraticCurveTo(r * 0.3, 0, 0, r * 1.5);
        pCtx.quadraticCurveTo(-r * 0.3, 0, 0, -r * 1.5);
        pCtx.fill();
        pCtx.restore();
      });
    });
  };

  drawSlenderLeaf(s * 0.3, s * 0.5, s * 0.2, 0.2);
  drawSlenderLeaf(s * 0.8, s * 0.4, s * 0.18, 0.8);
  
  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureFlowers(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.6);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  pCtx.fillStyle = "#fff7ed";
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawFlower = (cx: number, cy: number, r: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        pCtx.fillStyle = "#fbbf24"; // Center
        pCtx.beginPath(); pCtx.arc(x, y, r * 0.3, 0, Math.PI * 2); pCtx.fill();
        pCtx.fillStyle = "#f87171"; // Petals
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          pCtx.beginPath();
          pCtx.arc(x + Math.cos(angle) * r, y + Math.sin(angle) * r, r * 0.4, 0, Math.PI * 2);
          pCtx.fill();
        }
      });
    });
  };

  drawFlower(s * 0.5, s * 0.5, s * 0.15);
  
  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureClover(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.6);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  pCtx.fillStyle = "#f0fdf4";
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawSprig = (cx: number, cy: number, r: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        pCtx.save();
        pCtx.translate(cx + dx, cy + dy);
        pCtx.fillStyle = "#22c55e";
        
        // Draw 3 leaves rotated around the center
        for (let i = 0; i < 3; i++) {
          pCtx.save();
          pCtx.rotate((i * Math.PI * 2) / 3);
          pCtx.beginPath();
          pCtx.moveTo(0, 0);
          pCtx.quadraticCurveTo(r, -r, 0, -r * 1.2);
          pCtx.quadraticCurveTo(-r, -r, 0, 0);
          pCtx.fill();
          pCtx.restore();
        }
        pCtx.restore();
      });
    });
  };

  drawSprig(s * 0.5, s * 0.5, s * 0.12);
  drawSprig(s * 0.1, s * 0.1, s * 0.08); // Wraps to corners

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureSnowflakes(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.5);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  pCtx.fillStyle = "#0ea5e9"; // Winter blue
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawSnowflake = (cx: number, cy: number, r: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        pCtx.strokeStyle = "white";
        pCtx.lineWidth = 1.5;
        const x = cx + dx, y = cy + dy;
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          pCtx.beginPath();
          pCtx.moveTo(x, y);
          pCtx.lineTo(x + Math.cos(angle) * r, y + Math.sin(angle) * r);
          pCtx.stroke();
        }
      });
    });
  };

  drawSnowflake(s * 0.5, s * 0.5, s * 0.2);
  
  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureSnowflakeConfetti(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.8); // Larger tile for more variety
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background: Deep Winter Blue
  pCtx.fillStyle = "#0284c7"; 
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawDetailedSnowflake = (cx: number, cy: number, r: number, rotation: number, alpha: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        pCtx.save();
        pCtx.translate(cx + dx, cy + dy);
        pCtx.rotate(rotation);
        pCtx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        pCtx.lineWidth = r * 0.15;
        pCtx.lineCap = "round";

        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const x2 = Math.cos(angle) * r;
          const y2 = Math.sin(angle) * r;

          // Main Arm
          pCtx.beginPath();
          pCtx.moveTo(0, 0);
          pCtx.lineTo(x2, y2);
          
          // Secondary Branches (V-shape)
          const branchPos = r * 0.6; // Position along the arm
          const branchSize = r * 0.3;
          const bx = Math.cos(angle) * branchPos;
          const by = Math.sin(angle) * branchPos;
          
          pCtx.moveTo(bx, by);
          pCtx.lineTo(bx + Math.cos(angle + 0.8) * branchSize, by + Math.sin(angle + 0.8) * branchSize);
          pCtx.moveTo(bx, by);
          pCtx.lineTo(bx + Math.cos(angle - 0.8) * branchSize, by + Math.sin(angle - 0.8) * branchSize);
          
          pCtx.stroke();
        }
        pCtx.restore();
      });
    });
  };

  // Scatter different snowflakes
  drawDetailedSnowflake(s * 0.3, s * 0.3, s * 0.15, 0.2, 1.0);
  drawDetailedSnowflake(s * 0.8, s * 0.2, s * 0.1, 0.8, 0.7);
  drawDetailedSnowflake(s * 0.6, s * 0.8, s * 0.12, -0.4, 0.9);
  drawDetailedSnowflake(s * 0.1, s * 0.8, s * 0.08, 1.2, 0.6);
  
  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureFrozenMist(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.4);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  pCtx.fillStyle = "#38bdf8"; // Lighter Cyan-Blue
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawStarFlake = (cx: number, cy: number, r: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        pCtx.fillStyle = "white";
        // 4-pointed star
        pCtx.beginPath();
        for(let i=0; i<8; i++) {
            const a = (i/8) * Math.PI * 2;
            const dist = i % 2 === 0 ? r : r * 0.2;
            pCtx.lineTo(x + Math.cos(a) * dist, y + Math.sin(a) * dist);
        }
        pCtx.fill();
        
        // Add tiny dust around it
        pCtx.beginPath();
        pCtx.arc(x + r, y + r, 1, 0, Math.PI * 2);
        pCtx.arc(x - r, y - r*0.5, 0.8, 0, Math.PI * 2);
        pCtx.fill();
      });
    });
  };

  drawStarFlake(s * 0.3, s * 0.3, s * 0.12);
  drawStarFlake(s * 0.7, s * 0.8, s * 0.08);

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureRaindrops(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.5);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background: Soft rainy slate
  pCtx.fillStyle = "#f1f5f9";
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawBetterDrop = (cx: number, cy: number, r: number, tilt: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        pCtx.save();
        pCtx.translate(cx + dx, cy + dy);
        pCtx.rotate(tilt);

        // Body Gradient
        const grad = pCtx.createLinearGradient(0, -r, 0, r);
        grad.addColorStop(0, "#60a5fa"); // Light top
        grad.addColorStop(1, "#2563eb"); // Dark bottom
        
        pCtx.fillStyle = grad;
        pCtx.beginPath();
        pCtx.moveTo(0, -r);
        pCtx.bezierCurveTo(r, r * 0.5, r, r * 1.2, 0, r * 1.2);
        pCtx.bezierCurveTo(-r, r * 1.2, -r, r * 0.5, 0, -r);
        pCtx.fill();

        // Shine Highlight
        pCtx.fillStyle = "rgba(255, 255, 255, 0.4)";
        pCtx.beginPath();
        pCtx.arc(-r * 0.3, r * 0.4, r * 0.2, 0, Math.PI * 2);
        pCtx.fill();

        pCtx.restore();
      });
    });
  };

  // Scattered drops with different sizes and tilts
  drawBetterDrop(s * 0.3, s * 0.3, s * 0.12, 0.1);
  drawBetterDrop(s * 0.8, s * 0.7, s * 0.08, 0.15);
  
  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureRainStreaks(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.4);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background: Dark Stormy Night
  pCtx.fillStyle = "#0f172a";
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawStreak = (cx: number, cy: number, len: number, opacity: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        pCtx.strokeStyle = `rgba(186, 230, 253, ${opacity})`;
        pCtx.lineWidth = 1.5;
        pCtx.lineCap = "round";
        
        pCtx.beginPath();
        pCtx.moveTo(x, y);
        // Draw slanted line for motion effect
        pCtx.lineTo(x + len * 0.2, y + len);
        pCtx.stroke();
      });
    });
  };

  // Mix of long and short streaks for depth
  drawStreak(s * 0.2, s * 0.1, s * 0.5, 0.6);
  drawStreak(s * 0.7, s * 0.4, s * 0.3, 0.3);
  drawStreak(s * 0.4, s * 0.8, s * 0.4, 0.5);

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureRainRipples(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.6);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  pCtx.fillStyle = "#1e293b";
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawRipple = (cx: number, cy: number, r: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        pCtx.strokeStyle = "rgba(125, 211, 252, 0.4)";
        pCtx.lineWidth = 1;
        
        pCtx.beginPath();
        pCtx.ellipse(x, y, r, r * 0.5, 0, 0, Math.PI * 2);
        pCtx.stroke();
        
        pCtx.beginPath();
        pCtx.ellipse(x, y, r * 0.6, r * 0.3, 0, 0, Math.PI * 2);
        pCtx.stroke();
      });
    });
  };

  drawRipple(s * 0.3, s * 0.4, s * 0.2);
  drawRipple(s * 0.8, s * 0.8, s * 0.15);

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureWood(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.8);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  pCtx.fillStyle = "#78350f"; // Dark wood
  pCtx.fillRect(-1, -1, s + 2, s + 2);
  pCtx.strokeStyle = "#92400e";
  pCtx.lineWidth = 1.5;

  const frequency = (Math.PI * 2) / s;
  for (let i = 0; i < s; i += 6) {
    pCtx.beginPath();
    for (let y = 0; y <= s; y++) {
      // Create wobbly grain lines
      const xOffset = Math.sin(y * frequency + (i * 0.1)) * 3;
      if (y === 0) pCtx.moveTo(i + xOffset, y);
      else pCtx.lineTo(i + xOffset, y);
    }
    pCtx.stroke();
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureKnottedWood(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 1.0); // Larger tile for better knot distribution
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background: Warm Golden Brown
  pCtx.fillStyle = "#92400e"; 
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  // 1. Draw the Grain Lines
  pCtx.strokeStyle = "#78350f";
  pCtx.lineWidth = 1.2;
  for (let i = -10; i < s + 10; i += 8) {
    pCtx.beginPath();
    for (let y = 0; y <= s; y++) {
      // Mix two sine waves for a "wobble" that looks less like a math function
      const wobble = Math.sin(y * 0.05 + i) * 4 + Math.sin(y * 0.02) * 2;
      if (y === 0) pCtx.moveTo(i + wobble, y);
      else pCtx.lineTo(i + wobble, y);
    }
    pCtx.stroke();
  }

  // 2. Draw the Knots
  const drawKnot = (kx: number, ky: number, kw: number, kh: number) => {
    pCtx.strokeStyle = "#451a03";
    pCtx.lineWidth = 1;
    for (let r = 1; r < 5; r++) {
      pCtx.beginPath();
      // Use ellipses for knots to simulate the stretched look of wood grain
      pCtx.ellipse(kx, ky, kw * (r / 5), kh * (r / 5), 0.2, 0, Math.PI * 2);
      pCtx.stroke();
    }
  };

  drawKnot(s * 0.3, s * 0.4, 15, 25);
  drawKnot(s * 0.8, s * 0.7, 10, 20);

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureMahogany(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.6);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background: Deep Reddish Brown
  pCtx.fillStyle = "#450a0a"; 
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  pCtx.strokeStyle = "#7f1d1d"; // Slightly lighter grain
  pCtx.lineWidth = 0.8;

  for (let i = 0; i < s; i += 4) {
    pCtx.beginPath();
    for (let y = 0; y <= s; y++) {
      // Subtle, long-frequency waves for a "straight-grain" look
      const xOffset = Math.sin(y * 0.01 + i) * 2;
      if (y === 0) pCtx.moveTo(i + xOffset, y);
      else pCtx.lineTo(i + xOffset, y);
    }
    pCtx.stroke();
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureStone(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.6);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  pCtx.fillStyle = "#94a3b8"; // Slate grey
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawCrack = (seed: number) => {
    pCtx.strokeStyle = "#475569";
    pCtx.lineWidth = 1;
    pCtx.beginPath();
    pCtx.moveTo(0, (seed % 10) * (s/10));
    pCtx.lineTo(s, ((seed * 7) % 10) * (s/10));
    pCtx.stroke();
  };

  [12, 45, 89].forEach(n => drawCrack(n));

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureSunburst(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.6);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  pCtx.fillStyle = "#fffbeb"; // Warm cream bg
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawSun = (cx: number, cy: number, r: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        pCtx.fillStyle = "#fbbf24";
        pCtx.beginPath(); pCtx.arc(x, y, r * 0.4, 0, Math.PI * 2); pCtx.fill();
        
        pCtx.strokeStyle = "#fbbf24";
        pCtx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          pCtx.beginPath();
          pCtx.moveTo(x + Math.cos(angle) * (r * 0.6), y + Math.sin(angle) * (r * 0.6));
          pCtx.lineTo(x + Math.cos(angle) * r, y + Math.sin(angle) * r);
          pCtx.stroke();
        }
      });
    });
  };

  drawSun(s * 0.5, s * 0.5, s * 0.25);
  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureVines(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.5);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  pCtx.fillStyle = "#f7fee7";
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  pCtx.strokeStyle = "#4d7c0f";
  pCtx.lineWidth = 1.5;
  const frequency = (Math.PI * 2) / s;

  // Draw the main vine stem
  pCtx.beginPath();
  for (let y = 0; y <= s; y++) {
    const x = s * 0.5 + Math.sin(y * frequency) * (s * 0.1);
    if (y === 0) pCtx.moveTo(x, y); else pCtx.lineTo(x, y);
    
    // Periodically draw a leaf
    if (y % Math.round(s/4) === 0) {
        pCtx.fillStyle = "#65a30d";
        pCtx.ellipse(x + 5, y, 6, 3, 0.5, 0, Math.PI * 2);
        pCtx.fill();
    }
  }
  pCtx.stroke();

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureAnimals(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.7); // Larger tile size for clear visibility
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background: Soft Cream
  pCtx.fillStyle = "#fffbeb"; 
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  // Global style for animal outlines
  pCtx.strokeStyle = "#422006"; // Dark Wood Brown
  pCtx.lineWidth = 1.5;
  pCtx.lineJoin = "round";

  const drawBunny = (cx: number, cy: number, r: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        
        // 1. Long Ears (Iconic Bunny Feature)
        pCtx.fillStyle = "#f1f5f9"; // White fur
        pCtx.beginPath();
        pCtx.ellipse(x - r/2.5, y - r*1.2, r/3, r, -0.1, 0, Math.PI * 2);
        pCtx.ellipse(x + r/2.5, y - r*1.2, r/3, r, 0.1, 0, Math.PI * 2);
        pCtx.fill(); pCtx.stroke();

        // 2. Inner Ears (Pink)
        pCtx.fillStyle = "#fda4af";
        pCtx.beginPath();
        pCtx.ellipse(x - r/2.5, y - r*1.2, r/6, r/1.5, -0.1, 0, Math.PI * 2);
        pCtx.ellipse(x + r/2.5, y - r*1.2, r/6, r/1.5, 0.1, 0, Math.PI * 2);
        pCtx.fill();

        // 3. Round Head
        pCtx.fillStyle = "#f1f5f9";
        pCtx.beginPath(); pCtx.arc(x, y, r, 0, Math.PI * 2); pCtx.fill(); pCtx.stroke();

        // 4. Face Features
        pCtx.fillStyle = "#422006";
        pCtx.beginPath(); pCtx.arc(x - r/3, y - r/8, r/8, 0, Math.PI * 2); pCtx.fill(); // Eye
        pCtx.beginPath(); pCtx.arc(x + r/3, y - r/8, r/8, 0, Math.PI * 2); pCtx.fill(); // Eye
        pCtx.fillStyle = "#fda4af"; // Pink nose
        pCtx.beginPath(); pCtx.arc(x, y + r/5, r/6, 0, Math.PI * 2); pCtx.fill();
      });
    });
  };

  const drawPig = (cx: number, cy: number, r: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        
        pCtx.fillStyle = "#fbcfe8"; // Pink body
        // 1. Pointy Ears
        pCtx.beginPath();
        pCtx.moveTo(x - r, y - r/2); pCtx.lineTo(x - r, y - r*1.1); pCtx.lineTo(x - r/2, y - r);
        pCtx.moveTo(x + r, y - r/2); pCtx.lineTo(x + r, y - r*1.1); pCtx.lineTo(x + r/2, y - r);
        pCtx.fill(); pCtx.stroke();

        // 2. Head
        pCtx.beginPath(); pCtx.arc(x, y, r, 0, Math.PI * 2); pCtx.fill(); pCtx.stroke();

        // 3. Snout (Essential Pig Feature)
        pCtx.fillStyle = "#f9a8d4"; // Darker pink snout
        pCtx.beginPath(); pCtx.ellipse(x, y + r/4, r/1.5, r/2, 0, 0, Math.PI * 2); pCtx.fill(); pCtx.stroke();
        
        // 4. Nostrils
        pCtx.fillStyle = "#9d174d";
        pCtx.beginPath(); pCtx.arc(x - r/4, y + r/4, r/8, 0, Math.PI * 2); pCtx.fill();
        pCtx.beginPath(); pCtx.arc(x + r/4, y + r/4, r/8, 0, Math.PI * 2); pCtx.fill();

        // 5. Eyes
        pCtx.fillStyle = "#422006";
        pCtx.beginPath(); pCtx.arc(x - r/2.5, y - r/4, r/10, 0, Math.PI * 2); pCtx.fill();
        pCtx.beginPath(); pCtx.arc(x + r/2.5, y - r/4, r/10, 0, Math.PI * 2); pCtx.fill();
      });
    });
  };

  drawBunny(s * 0.3, s * 0.4, s * 0.22);
  drawPig(s * 0.8, s * 0.8, s * 0.2);

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}
export function textureSkyFun(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.7); // Slightly larger tile
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background: Clearer Blue (higher contrast)
  pCtx.fillStyle = "#bae6fd"; 
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawBetterBalloon = (cx: number, cy: number, r: number, color: string) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        
        // Balloon Body
        pCtx.fillStyle = color;
        pCtx.beginPath(); pCtx.ellipse(x, y, r * 0.85, r, 0, 0, Math.PI * 2); pCtx.fill();
        
        // Shine Highlight (Essential for visibility)
        pCtx.fillStyle = "rgba(255, 255, 255, 0.4)";
        pCtx.beginPath(); pCtx.ellipse(x - r * 0.3, y - r * 0.4, r * 0.2, r * 0.3, 0.5, 0, Math.PI * 2); pCtx.fill();

        // The Knot at the bottom
        pCtx.fillStyle = color;
        pCtx.beginPath();
        pCtx.moveTo(x, y + r);
        pCtx.lineTo(x - r * 0.2, y + r * 1.2);
        pCtx.lineTo(x + r * 0.2, y + r * 1.2);
        pCtx.closePath();
        pCtx.fill();

        // String (Wavy)
        pCtx.strokeStyle = "#475569";
        pCtx.lineWidth = 1;
        pCtx.beginPath();
        pCtx.moveTo(x, y + r * 1.2);
        pCtx.bezierCurveTo(x + 5, y + r * 1.5, x - 5, y + r * 1.8, x, y + r * 2.2);
        pCtx.stroke();
      });
    });
  };

  drawBetterBalloon(s * 0.3, s * 0.3, s * 0.2, "#f43f5e"); // Bright Red

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureSunsetSky(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.8);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background: Sunset Purple
  pCtx.fillStyle = "#4c1d95"; 
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  // Draw a bright Sun/Moon for context
  pCtx.fillStyle = "#fde047";
  pCtx.beginPath(); pCtx.arc(s * 0.2, s * 0.2, s * 0.15, 0, Math.PI * 2); pCtx.fill();

  const drawSimpleBird = (cx: number, cy: number, r: number) => {
    pCtx.strokeStyle = "white";
    pCtx.lineWidth = 1.5;
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        pCtx.beginPath();
        pCtx.moveTo(x - r, y);
        pCtx.quadraticCurveTo(x - r/2, y - r, x, y);
        pCtx.quadraticCurveTo(x + r/2, y - r, x + r, y);
        pCtx.stroke();
      });
    });
  };

  drawSimpleBird(s * 0.5, s * 0.4, 8);
  drawSimpleBird(s * 0.6, s * 0.5, 6);

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}


export function textureOnlyCat(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.5); // Scaled for high density
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background: Soft Pastel Cream
  pCtx.fillStyle = "#fff9db"; 
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawCatHead = (cx: number, cy: number, r: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        
        pCtx.fillStyle = "#868e96"; // Slate Grey Cat
        pCtx.strokeStyle = "#333";
        pCtx.lineWidth = 1.2;
        pCtx.lineJoin = "round";

        // 1. EARS (Sharp Triangles)
        pCtx.beginPath();
        // Left Ear
        pCtx.moveTo(x - r * 0.8, y - r * 0.4);
        pCtx.lineTo(x - r * 0.7, y - r * 1.2);
        pCtx.lineTo(x - r * 0.2, y - r * 0.8);
        // Right Ear
        pCtx.moveTo(x + r * 0.8, y - r * 0.4);
        pCtx.lineTo(x + r * 0.7, y - r * 1.2);
        pCtx.lineTo(x + r * 0.2, y - r * 0.8);
        pCtx.fill();

        // 2. FACE (Round)
        pCtx.beginPath();
        pCtx.arc(x, y, r, 0, Math.PI * 2);
        pCtx.fill();

        // 3. EYES (Tiny Black Dots)
        pCtx.fillStyle = "black";
        pCtx.beginPath();
        pCtx.arc(x - r * 0.35, y - r * 0.1, r * 0.12, 0, Math.PI * 2);
        pCtx.arc(x + r * 0.35, y - r * 0.1, r * 0.12, 0, Math.PI * 2);
        pCtx.fill();

        // 4. NOSE & WHISKERS
        pCtx.strokeStyle = "#333";
        pCtx.lineWidth = 1;
        // Whiskers Left
        pCtx.beginPath();
        pCtx.moveTo(x - r * 0.6, y + r * 0.1); pCtx.lineTo(x - r * 1.2, y);
        pCtx.moveTo(x - r * 0.6, y + r * 0.3); pCtx.lineTo(x - r * 1.2, y + r * 0.4);
        // Whiskers Right
        pCtx.moveTo(x + r * 0.6, y + r * 0.1); pCtx.lineTo(x + r * 1.2, y);
        pCtx.moveTo(x + r * 0.6, y + r * 0.3); pCtx.lineTo(x + r * 1.2, y + r * 0.4);
        pCtx.stroke();
        
        // Tiny Pink Nose
        pCtx.fillStyle = "#ff8787";
        pCtx.beginPath();
        pCtx.arc(x, y + r * 0.1, r * 0.1, 0, Math.PI * 2);
        pCtx.fill();
      });
    });
  };

  // Draw one large cat in the center
  drawCatHead(s * 0.5, s * 0.5, s * 0.25);

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureAggressiveFire(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.6); // Slightly larger tile for complexity
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background: Intense charcoal
  pCtx.fillStyle = "#0a0a0a";
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawAggressiveFlame = (cx: number, cy: number, r: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx;
        const y = cy + dy;

        // 1. Outer Jagged Layer (Dark Red/Orange)
        pCtx.fillStyle = "#e63946";
        pCtx.beginPath();
        pCtx.moveTo(x - r, y + r);
        pCtx.lineTo(x - r * 0.8, y - r * 0.2); // Spike 1
        pCtx.lineTo(x - r * 0.4, y + r * 0.2);
        pCtx.lineTo(x, y - r * 1.2);          // Tall Center Spike
        pCtx.lineTo(x + r * 0.4, y + r * 0.2);
        pCtx.lineTo(x + r * 0.8, y - r * 0.4); // Spike 2
        pCtx.lineTo(x + r, y + r);
        pCtx.closePath();
        pCtx.fill();

        // 2. Mid Layer (Bright Orange)
        pCtx.fillStyle = "#fb8500";
        pCtx.beginPath();
        pCtx.moveTo(x - r * 0.6, y + r);
        pCtx.lineTo(x - r * 0.3, y);
        pCtx.lineTo(x, y - r * 0.8);
        pCtx.lineTo(x + r * 0.3, y);
        pCtx.lineTo(x + r * 0.6, y + r);
        pCtx.fill();

        // 3. Inner Core (Bright Yellow)
        pCtx.fillStyle = "#ffb703";
        pCtx.beginPath();
        pCtx.arc(x, y + r * 0.5, r * 0.3, 0, Math.PI * 2);
        pCtx.fill();

        // 4. Sparks (Floating Dots)
        pCtx.fillStyle = "#ffb703";
        pCtx.fillRect(x - r, y - r, 2, 2);
        pCtx.fillRect(x + r * 0.5, y - r * 0.8, 1.5, 1.5);
      });
    });
  };

  // Place multiple flames for a "forest fire" look
  drawAggressiveFlame(s * 0.2, s * 0.6, s * 0.25);
  drawAggressiveFlame(s * 0.7, s * 0.7, s * 0.2);
  drawAggressiveFlame(s * 0.5, s * 0.3, s * 0.15);

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureFire(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.4); // High density
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background: Deep charcoal to make fire pop
  pCtx.fillStyle = "#1a1a1a";
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawFlame = (cx: number, cy: number, r: number) => {
    // Wrap-around logic for seamless tiling
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx;
        const y = cy + dy;

        // 1. Outer Flame (Orange)
        pCtx.fillStyle = "#ff6b00";
        pCtx.beginPath();
        pCtx.moveTo(x, y + r); // Bottom center
        // Curving up to a sharp point
        pCtx.quadraticCurveTo(x + r, y, x, y - r); 
        pCtx.quadraticCurveTo(x - r, y, x, y + r);
        pCtx.fill();

        // 2. Inner Flame (Yellow)
        pCtx.fillStyle = "#ffcf00";
        pCtx.beginPath();
        const ir = r * 0.5; // Inner radius
        pCtx.moveTo(x, y + r); 
        pCtx.quadraticCurveTo(x + ir, y + ir/2, x, y - r/4);
        pCtx.quadraticCurveTo(x - ir, y + ir/2, x, y + r);
        pCtx.fill();
      });
    });
  };

  // Placing two flames at deterministic offsets
  drawFlame(s * 0.3, s * 0.6, s * 0.2);
  drawFlame(s * 0.8, s * 0.4, s * 0.15);

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureOnlyDog(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.5); // High density tile
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background: Soft Blue-Grey
  pCtx.fillStyle = "#e9ecef"; 
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawDogHead = (cx: number, cy: number, r: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        
        const brown = "#964b00";
        const darkBrown = "#5d2e00";

        // 1. EARS (Long Floppy Ovals)
        pCtx.fillStyle = darkBrown;
        pCtx.beginPath();
        pCtx.ellipse(x - r * 0.9, y - r * 0.2, r * 0.4, r * 0.8, 0.2, 0, Math.PI * 2);
        pCtx.ellipse(x + r * 0.9, y - r * 0.2, r * 0.4, r * 0.8, -0.2, 0, Math.PI * 2);
        pCtx.fill();

        // 2. FACE (Rounded)
        pCtx.fillStyle = brown;
        pCtx.beginPath();
        pCtx.arc(x, y, r, 0, Math.PI * 2);
        pCtx.fill();

        // 3. SNOUT (Lighter Brown/Cream)
        pCtx.fillStyle = "#d7a374";
        pCtx.beginPath();
        pCtx.ellipse(x, y + r * 0.3, r * 0.6, r * 0.5, 0, 0, Math.PI * 2);
        pCtx.fill();

        // 4. EYES (Simple Dots)
        pCtx.fillStyle = "black";
        pCtx.beginPath();
        pCtx.arc(x - r * 0.3, y - r * 0.2, r * 0.12, 0, Math.PI * 2);
        pCtx.arc(x + r * 0.3, y - r * 0.2, r * 0.12, 0, Math.PI * 2);
        pCtx.fill();

        // 5. NOSE (Black Heart-ish shape)
        pCtx.beginPath();
        pCtx.arc(x, y + r * 0.15, r * 0.15, 0, Math.PI * 2);
        pCtx.fill();
        
        // 6. MOUTH (Tiny W)
        pCtx.strokeStyle = "black";
        pCtx.lineWidth = 1.5;
        pCtx.lineCap = "round";
        pCtx.beginPath();
        pCtx.arc(x - r * 0.15, y + r * 0.4, r * 0.15, 0, Math.PI);
        pCtx.stroke();
        pCtx.beginPath();
        pCtx.arc(x + r * 0.15, y + r * 0.4, r * 0.15, 0, Math.PI);
        pCtx.stroke();
      });
    });
  };

  // Center the dog face
  drawDogHead(s * 0.5, s * 0.5, s * 0.25);

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureOnlyBear(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.5); // Scaled for high density
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background: Soft Honey / Warm Cream
  pCtx.fillStyle = "#fff4e6"; 
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawBearHead = (cx: number, cy: number, r: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        
        const bearBrown = "#a36a3e";
        const darkBrown = "#5c3d2e";
        const snoutCream = "#d9b38c";

        // 1. EARS (Big Round Ears)
        pCtx.fillStyle = bearBrown;
        pCtx.beginPath();
        pCtx.arc(x - r * 0.7, y - r * 0.7, r * 0.45, 0, Math.PI * 2);
        pCtx.arc(x + r * 0.7, y - r * 0.7, r * 0.45, 0, Math.PI * 2);
        pCtx.fill();
        
        // Inner Ear Detail
        pCtx.fillStyle = snoutCream;
        pCtx.beginPath();
        pCtx.arc(x - r * 0.7, y - r * 0.7, r * 0.25, 0, Math.PI * 2);
        pCtx.arc(x + r * 0.7, y - r * 0.7, r * 0.25, 0, Math.PI * 2);
        pCtx.fill();

        // 2. FACE (Large Circle)
        pCtx.fillStyle = bearBrown;
        pCtx.beginPath();
        pCtx.arc(x, y, r, 0, Math.PI * 2);
        pCtx.fill();

        // 3. SNOUT (Large Oval)
        pCtx.fillStyle = snoutCream;
        pCtx.beginPath();
        pCtx.ellipse(x, y + r * 0.35, r * 0.55, r * 0.45, 0, 0, Math.PI * 2);
        pCtx.fill();

        // 4. EYES (Small Black Beads)
        pCtx.fillStyle = "black";
        pCtx.beginPath();
        pCtx.arc(x - r * 0.35, y - r * 0.1, r * 0.1, 0, Math.PI * 2);
        pCtx.arc(x + r * 0.35, y - r * 0.1, r * 0.1, 0, Math.PI * 2);
        pCtx.fill();

        // 5. NOSE (Small Rounded Triangle/Oval)
        pCtx.fillStyle = darkBrown;
        pCtx.beginPath();
        pCtx.ellipse(x, y + r * 0.2, r * 0.18, r * 0.12, 0, 0, Math.PI * 2);
        pCtx.fill();
        
        // 6. MOUTH (Subtle W shape)
        pCtx.strokeStyle = darkBrown;
        pCtx.lineWidth = 1.5;
        pCtx.lineCap = "round";
        pCtx.beginPath();
        pCtx.arc(x - r * 0.12, y + r * 0.35, r * 0.12, 0, Math.PI);
        pCtx.stroke();
        pCtx.beginPath();
        pCtx.arc(x + r * 0.12, y + r * 0.35, r * 0.12, 0, Math.PI);
        pCtx.stroke();
      });
    });
  };

  // Center the bear face in the tile
  drawBearHead(s * 0.5, s * 0.5, s * 0.25);

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureOnlyCow(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.6); 
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // 1. DARKER BACKGROUND (Meadow Green)
  pCtx.fillStyle = "#2d6a4f"; 
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawCow = (cx: number, cy: number, r: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        
        // 2. BOVINE EARS (Deeper and angled)
        pCtx.fillStyle = "#ffffff";
        pCtx.beginPath();
        pCtx.ellipse(x - r * 1.1, y - r * 0.4, r * 0.5, r * 0.25, -0.2, 0, Math.PI * 2);
        pCtx.ellipse(x + r * 1.1, y - r * 0.4, r * 0.5, r * 0.25, 0.2, 0, Math.PI * 2);
        pCtx.fill();

        // 3. HORNS (Blunted cream color)
        pCtx.fillStyle = "#e9ecef";
        pCtx.beginPath();
        pCtx.arc(x - r * 0.4, y - r * 0.9, r * 0.2, 0, Math.PI * 2);
        pCtx.arc(x + r * 0.4, y - r * 0.9, r * 0.2, 0, Math.PI * 2);
        pCtx.fill();

        // 4. MAIN HEAD (White)
        pCtx.fillStyle = "#ffffff";
        pCtx.beginPath();
        pCtx.arc(x, y, r, 0, Math.PI * 2);
        pCtx.fill();

        // 5. AGGRESSIVE SPOTS (Irregular patches)
        pCtx.fillStyle = "#1a1a1a";
        // Large patch covering ear and part of head
        pCtx.beginPath();
        pCtx.ellipse(x - r * 0.6, y - r * 0.5, r * 0.7, r * 0.6, 0.8, 0, Math.PI * 2);
        pCtx.fill();
        // Smaller spot on the other side
        pCtx.beginPath();
        pCtx.arc(x + r * 0.7, y + r * 0.4, r * 0.4, 0, Math.PI * 2);
        pCtx.fill();

        // 6. PROMINENT SNOUT (Large Pink Oval)
        pCtx.fillStyle = "#ffb1b1";
        pCtx.beginPath();
        pCtx.ellipse(x, y + r * 0.45, r * 0.75, r * 0.5, 0, 0, Math.PI * 2);
        pCtx.fill();

        // 7. NOSTRILS & MOUTH
        pCtx.fillStyle = "#c92a2a";
        pCtx.beginPath();
        pCtx.arc(x - r * 0.25, y + r * 0.45, r * 0.12, 0, Math.PI * 2);
        pCtx.arc(x + r * 0.25, y + r * 0.45, r * 0.12, 0, Math.PI * 2);
        pCtx.fill();

        // 8. EYES (Beady and set apart)
        pCtx.fillStyle = "#000000";
        pCtx.beginPath();
        pCtx.arc(x - r * 0.4, y - r * 0.1, r * 0.12, 0, Math.PI * 2);
        pCtx.arc(x + r * 0.4, y - r * 0.1, r * 0.12, 0, Math.PI * 2);
        pCtx.fill();
        // Shine in eyes
        pCtx.fillStyle = "#ffffff";
        pCtx.beginPath();
        pCtx.arc(x - r * 0.45, y - r * 0.15, r * 0.04, 0, Math.PI * 2);
        pCtx.arc(x + r * 0.35, y - r * 0.15, r * 0.04, 0, Math.PI * 2);
        pCtx.fill();
      });
    });
  };

  // Centered draw
  drawCow(s * 0.5, s * 0.5, s * 0.25);

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureOnlyLion(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.7); 
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background: Savannah Orange/Brown
  pCtx.fillStyle = "#92400e"; 
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawLion = (cx: number, cy: number, r: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        
        // 1. MANE (Large scalloped circle)
        pCtx.fillStyle = "#78350f";
        for (let i = 0; i < 12; i++) {
          const angle = (i / 12) * Math.PI * 2;
          pCtx.beginPath();
          pCtx.arc(x + Math.cos(angle) * r, y + Math.sin(angle) * r, r * 0.5, 0, Math.PI * 2);
          pCtx.fill();
        }

        // 2. FACE
        pCtx.fillStyle = "#facc15";
        pCtx.beginPath(); pCtx.arc(x, y, r, 0, Math.PI * 2); pCtx.fill();

        // 3. SNOUT (Light Yellow)
        pCtx.fillStyle = "#fef08a";
        pCtx.beginPath();
        pCtx.ellipse(x, y + r * 0.3, r * 0.6, r * 0.4, 0, 0, Math.PI * 2);
        pCtx.fill();

        // 4. FEATURES
        pCtx.fillStyle = "black";
        pCtx.beginPath(); // Eyes
        pCtx.arc(x - r * 0.3, y - r * 0.1, r * 0.1, 0, Math.PI * 2);
        pCtx.arc(x + r * 0.3, y - r * 0.1, r * 0.1, 0, Math.PI * 2);
        pCtx.fill();
        
        pCtx.beginPath(); // Nose (Triangle)
        pCtx.moveTo(x - r * 0.15, y + r * 0.1);
        pCtx.lineTo(x + r * 0.15, y + r * 0.1);
        pCtx.lineTo(x, y + r * 0.3);
        pCtx.fill();
      });
    });
  };

  drawLion(s * 0.5, s * 0.5, s * 0.25);
  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureOnlyGiraffe(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.9); // Larger tile for better detail
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background: Soft Savanna Sky
  pCtx.fillStyle = "#e0f2fe"; 
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawClearGiraffe = (cx: number, cy: number, r: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        
        // Style settings
        pCtx.strokeStyle = "#451a03"; // Dark Brown Outline
        pCtx.lineWidth = 2;
        pCtx.lineCap = "round";
        pCtx.lineJoin = "round";

        // 1. EARS (Crucial for the silhouette)
        pCtx.fillStyle = "#fbbf24";
        const drawEar = (ex: number, ey: number, angle: number) => {
            pCtx.save();
            pCtx.translate(ex, ey);
            pCtx.rotate(angle);
            pCtx.beginPath();
            pCtx.moveTo(0, 0);
            pCtx.quadraticCurveTo(r * 0.8, -r * 0.8, 0, -r * 1.2);
            pCtx.quadraticCurveTo(-r * 0.8, -r * 0.8, 0, 0);
            pCtx.fill();
            pCtx.stroke();
            pCtx.restore();
        };
        drawEar(x - r * 0.5, y - r * 0.5, -0.5);
        drawEar(x + r * 0.5, y - r * 0.5, 0.5);

        // 2. OSSICONES (Horns)
        pCtx.fillStyle = "#fbbf24";
        pCtx.beginPath();
        // Left stalk
        pCtx.rect(x - r * 0.35, y - r * 1.2, r * 0.15, r * 0.6);
        // Right stalk
        pCtx.rect(x + r * 0.2, y - r * 1.2, r * 0.15, r * 0.6);
        pCtx.fill(); pCtx.stroke();
        
        // Brown Tops
        pCtx.fillStyle = "#451a03";
        pCtx.beginPath();
        pCtx.arc(x - r * 0.27, y - r * 1.3, r * 0.2, 0, Math.PI * 2);
        pCtx.arc(x + r * 0.27, y - r * 1.3, r * 0.2, 0, Math.PI * 2);
        pCtx.fill();

        // 3. FACE SHAPE (Slightly narrower at top)
        pCtx.fillStyle = "#fbbf24";
        pCtx.beginPath();
        pCtx.ellipse(x, y, r * 0.85, r, 0, 0, Math.PI * 2);
        pCtx.fill(); pCtx.stroke();

        // 4. SNOUT
        pCtx.fillStyle = "#fef3c7"; // Lighter tan
        pCtx.beginPath();
        pCtx.ellipse(x, y + r * 0.5, r * 0.7, r * 0.5, 0, 0, Math.PI * 2);
        pCtx.fill(); pCtx.stroke();
        
        // Nostrils
        pCtx.fillStyle = "#451a03";
        pCtx.beginPath();
        pCtx.arc(x - r * 0.2, y + r * 0.6, r * 0.1, 0, Math.PI * 2);
        pCtx.arc(x + r * 0.2, y + r * 0.6, r * 0.1, 0, Math.PI * 2);
        pCtx.fill();

        // 5. EYES (Large and expressive)
        pCtx.fillStyle = "black";
        pCtx.beginPath();
        pCtx.arc(x - r * 0.4, y - r * 0.1, r * 0.15, 0, Math.PI * 2);
        pCtx.arc(x + r * 0.4, y - r * 0.1, r * 0.15, 0, Math.PI * 2);
        pCtx.fill();

        // 6. SPOTS (On the forehead/cheeks)
        pCtx.fillStyle = "#b45309";
        pCtx.beginPath();
        pCtx.arc(x, y - r * 0.5, r * 0.2, 0, Math.PI * 2);
        pCtx.arc(x - r * 0.6, y + r * 0.1, r * 0.15, 0, Math.PI * 2);
        pCtx.arc(x + r * 0.6, y + r * 0.1, r * 0.15, 0, Math.PI * 2);
        pCtx.fill();
      });
    });
  };

  drawClearGiraffe(s * 0.5, s * 0.5, s * 0.25);
  
  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureOnlyGoat(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.6); 
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background: Mountain Grey
  pCtx.fillStyle = "#334155"; 
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawGoat = (cx: number, cy: number, r: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        
        // 1. HORNS (Curved)
        pCtx.strokeStyle = "#94a3b8"; pCtx.lineWidth = 6; pCtx.lineCap = "round";
        pCtx.beginPath(); pCtx.arc(x - r * 0.5, y - r * 0.5, r * 0.5, Math.PI, Math.PI * 1.5); pCtx.stroke();
        pCtx.beginPath(); pCtx.arc(x + r * 0.5, y - r * 0.5, r * 0.5, Math.PI * 1.5, Math.PI * 2); pCtx.stroke();

        // 2. FACE
        pCtx.fillStyle = "#f1f5f9";
        pCtx.beginPath(); pCtx.ellipse(x, y, r * 0.7, r, 0, 0, Math.PI * 2); pCtx.fill();

        // 3. BEARD (Triangle goatee)
        pCtx.beginPath();
        pCtx.moveTo(x - r * 0.2, y + r);
        pCtx.lineTo(x + r * 0.2, y + r);
        pCtx.lineTo(x, y + r * 1.4);
        pCtx.fill();

        // 4. FEATURES
        pCtx.fillStyle = "black";
        pCtx.beginPath(); pCtx.arc(x - r * 0.3, y - r * 0.1, r * 0.08, 0, Math.PI * 2);
        pCtx.arc(x + r * 0.3, y - r * 0.1, r * 0.08, 0, Math.PI * 2); pCtx.fill();
        pCtx.fillStyle = "#cbd5e1"; // Snout area
        pCtx.beginPath(); pCtx.arc(x, y + r * 0.5, r * 0.4, 0, Math.PI * 2); pCtx.fill();
      });
    });
  };

  drawGoat(s * 0.5, s * 0.5, s * 0.25);
  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureElephantFull(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.8); // Increased tile size for full body clarity
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background: Soft Savanna Sand
  pCtx.fillStyle = "#f8fafc"; 
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawClearElephant = (cx: number, cy: number, r: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        
        // Colors & Style
        const skinColor = "#94a3b8";   // Slate Gray
        const shadowColor = "#64748b"; // Darker Gray for back legs/ears
        const outlineColor = "#334155"; // Deep Charcoal for definition
        
        pCtx.strokeStyle = outlineColor;
        pCtx.lineWidth = r * 0.08;
        pCtx.lineJoin = "round";
        pCtx.lineCap = "round";

        // 1. BACK LEGS (Drawn first, slightly darker)
        pCtx.fillStyle = shadowColor;
        pCtx.beginPath();
        pCtx.roundRect(x - r * 0.4, y + r * 0.6, r * 0.35, r * 0.7, r * 0.1);
        pCtx.roundRect(x + r * 0.3, y + r * 0.6, r * 0.35, r * 0.7, r * 0.1);
        pCtx.fill(); pCtx.stroke();

        // 2. TAIL
        pCtx.beginPath();
        pCtx.moveTo(x + r * 1.1, y + r * 0.2);
        pCtx.quadraticCurveTo(x + r * 1.4, y + r * 0.4, x + r * 1.3, y + r * 0.8);
        pCtx.stroke();

        // 3. BODY
        pCtx.fillStyle = skinColor;
        pCtx.beginPath();
        pCtx.ellipse(x, y + r * 0.3, r * 1.2, r * 0.9, 0, 0, Math.PI * 2);
        pCtx.fill(); pCtx.stroke();

        // 4. FRONT LEGS (Foreground)
        pCtx.beginPath();
        pCtx.roundRect(x - r * 0.8, y + r * 0.6, r * 0.4, r * 0.8, r * 0.1);
        pCtx.roundRect(x + r * 0.6, y + r * 0.6, r * 0.4, r * 0.8, r * 0.1);
        pCtx.fill(); pCtx.stroke();

        // 5. THE EAR (The primary identifier)
        pCtx.fillStyle = shadowColor;
        pCtx.beginPath();
        // Teardrop shape for the ear
        pCtx.moveTo(x - r * 0.3, y - r * 0.4);
        pCtx.bezierCurveTo(x + r * 0.5, y - r * 0.8, x + r * 0.8, y + r * 0.5, x - r * 0.1, y + r * 0.6);
        pCtx.fill(); pCtx.stroke();

        // 6. HEAD & TRUNK (Drawn as one continuous path for flow)
        pCtx.fillStyle = skinColor;
        pCtx.beginPath();
        // Head circle
        pCtx.arc(x - r * 0.7, y - r * 0.1, r * 0.65, 0, Math.PI * 2);
        pCtx.fill(); pCtx.stroke();

        // Trunk
        pCtx.beginPath();
        pCtx.moveTo(x - r * 1.1, y + r * 0.2);
        pCtx.bezierCurveTo(x - r * 1.8, y + r * 0.2, x - r * 1.8, y - r * 0.6, x - r * 1.3, y - r * 0.5);
        pCtx.lineWidth = r * 0.35;
        pCtx.stroke();
        pCtx.lineWidth = r * 0.1; // Reset line width

        // 7. FEATURES (Eye & Tusk)
        pCtx.fillStyle = "white"; // Tusk
        pCtx.beginPath();
        pCtx.moveTo(x - r * 1.2, y + r * 0.2);
        pCtx.lineTo(x - r * 1.5, y + r * 0.4);
        pCtx.lineTo(x - r * 1.2, y + r * 0.45);
        pCtx.fill(); pCtx.stroke();

        pCtx.fillStyle = "black"; // Eye
        pCtx.beginPath();
        pCtx.arc(x - r * 0.9, y - r * 0.2, r * 0.08, 0, Math.PI * 2);
        pCtx.fill();
      });
    });
  };

  // Draw the elephant centered
  drawClearElephant(s * 0.5, s * 0.5, s * 0.2);

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureMemphisStyle(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 1); // Larger tile for more variety
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // 1. BACKGROUND (Off-white or very pale yellow)
  pCtx.fillStyle = "#93ffae";
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  // 2. DETERMINISTIC HASH FOR POSITIONING
  const pr = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const colors = ["#ff0054", "#3f37c9", "#4cc9f0", "#f8961e", "#70e000", "#000000"];

  const drawMemphisElement = (type: number, cx: number, cy: number, seed: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx;
        const y = cy + dy;
        const color = colors[Math.floor(pr(seed) * colors.length)];
        const r = s * 0.08 + pr(seed + 1) * (s * 0.1);
        
        pCtx.save();
        pCtx.translate(x, y);
        pCtx.rotate(pr(seed + 2) * Math.PI);
        pCtx.fillStyle = color;
        pCtx.strokeStyle = color;
        pCtx.lineWidth = 4;
        pCtx.lineCap = "round";

        if (type < 0.25) { 
          // Thick Zig-Zag (Squiggle)
          pCtx.beginPath();
          pCtx.moveTo(-r, 0);
          pCtx.lineTo(-r/2, r/2);
          pCtx.lineTo(0, 0);
          pCtx.lineTo(r/2, r/2);
          pCtx.lineTo(r, 0);
          pCtx.stroke();
        } else if (type < 0.5) {
          // Half-Circle
          pCtx.beginPath();
          pCtx.arc(0, 0, r, 0, Math.PI);
          pCtx.fill();
        } else if (type < 0.75) {
          // Triangle
          pCtx.beginPath();
          pCtx.moveTo(0, -r);
          pCtx.lineTo(r, r);
          pCtx.lineTo(-r, r);
          pCtx.closePath();
          pCtx.stroke();
        } else {
          // Floating Dots/Pills
          pCtx.beginPath();
          pCtx.roundRect(-r, -r/4, r*2, r/2, 10);
          pCtx.fill();
        }
        pCtx.restore();
      });
    });
  };

  // Scatter elements across the tile
  const count = 8;
  for (let i = 0; i < count; i++) {
    const type = pr(i * 5);
    const cx = pr(i * 2) * s;
    const cy = pr(i * 3) * s;
    drawMemphisElement(type, cx, cy, i);
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureMemphisVariety(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 1.8); // Larger area for more complexity
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  const pr = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // 1. BACKGROUND (Classic pale cream)
  pCtx.fillStyle = "#fffdf0";
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  // 2. LAYER 1: THE DOT GRID (Subtle background texture)
  pCtx.fillStyle = "#dee2e6";
  for (let i = 0; i < s; i += s / 10) {
    for (let j = 0; j < s; j += s / 10) {
      pCtx.beginPath();
      pCtx.arc(i, j, 1, 0, Math.PI * 2);
      pCtx.fill();
    }
  }

  const colors = ["#ff0054", "#3f37c9", "#4cc9f0", "#f8961e", "#70e000", "#000000"];

  const drawElement = (cx: number, cy: number, seed: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        const type = pr(seed);
        const color = colors[Math.floor(pr(seed + 1) * colors.length)];
        const r = s * 0.08 + pr(seed + 2) * (s * 0.08);

        pCtx.save();
        pCtx.translate(x, y);
        pCtx.rotate(pr(seed + 3) * Math.PI * 2);
        
        if (type < 0.2) {
          // ZIG-ZAG (The "Squiggle")
          pCtx.strokeStyle = color;
          pCtx.lineWidth = 5;
          pCtx.beginPath();
          pCtx.moveTo(-r, 0);
          for(let k = 0; k < 4; k++) {
            pCtx.lineTo(-r + (k*2+1)*r/4, (k%2 === 0 ? -r/2 : r/2));
          }
          pCtx.stroke();
        } 
        else if (type < 0.4) {
          // STRIPED CIRCLE
          pCtx.save();
          pCtx.beginPath(); pCtx.arc(0, 0, r, 0, Math.PI * 2); pCtx.clip();
          pCtx.strokeStyle = color; pCtx.lineWidth = 3;
          for(let k = -r; k < r; k += 6) {
            pCtx.beginPath(); pCtx.moveTo(-r, k); pCtx.lineTo(r, k); pCtx.stroke();
          }
          pCtx.restore();
          pCtx.strokeStyle = "#000"; pCtx.lineWidth = 2;
          pCtx.beginPath(); pCtx.arc(0, 0, r, 0, Math.PI * 2); pCtx.stroke();
        }
        else if (type < 0.6) {
          // THE "L" SHAPE / TETRIS BLOCK
          pCtx.fillStyle = color;
          pCtx.fillRect(-r/2, -r/2, r, r/3);
          pCtx.fillRect(-r/2, -r/2, r/3, r);
        }
        else if (type < 0.8) {
          // CONFETTI CLUSTER (Tiny triangles/lines)
          pCtx.fillStyle = color;
          for(let k = 0; k < 5; k++) {
            const sx = (pr(seed+k)-0.5)*r*2;
            const sy = (pr(seed+k+1)-0.5)*r*2;
            pCtx.fillRect(sx, sy, r/4, r/10);
          }
        }
        else {
          // DONUT SHAPE
          pCtx.strokeStyle = color;
          pCtx.lineWidth = r/3;
          pCtx.beginPath(); pCtx.arc(0, 0, r*0.7, 0, Math.PI*2); pCtx.stroke();
        }
        pCtx.restore();
      });
    });
  };

  // Generate more elements for a "packed" look
  for (let i = 0; i < 12; i++) {
    drawElement(pr(i * 7) * s, pr(i * 13) * s, i);
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureBauhaus(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.5);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background: Muted Sand
  pCtx.fillStyle = "#f2e9e4"; 
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const colors = ["#c32f27", "#1b4965", "#000000"];
  
  const drawBauhaus = (cx: number, cy: number, r: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        pCtx.fillStyle = colors[0];
        // Solid Quarter Circle
        pCtx.beginPath();
        pCtx.moveTo(x, y);
        pCtx.arc(x, y, r, 0, Math.PI / 2);
        pCtx.fill();
        // Thick Line
        pCtx.strokeStyle = colors[1];
        pCtx.lineWidth = 4;
        pCtx.beginPath();
        pCtx.moveTo(x - r, y - r);
        pCtx.lineTo(x + r, y + r);
        pCtx.stroke();
      });
    });
  };

  drawBauhaus(s * 0.5, s * 0.5, s * 0.3);
  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureCyberGrid(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.4);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Background: Deep Night
  pCtx.fillStyle = "#020617";
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  // Subtle Grid Lines
  pCtx.strokeStyle = "rgba(56, 189, 248, 0.2)";
  pCtx.lineWidth = 0.5;
  pCtx.strokeRect(0, 0, s, s);

  // Glowing "Nodes" at corners
  const drawNode = (cx: number, cy: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        pCtx.fillStyle = "#38bdf8";
        pCtx.beginPath();
        pCtx.arc(x, y, 1.5, 0, Math.PI * 2);
        pCtx.fill();
      });
    });
  };

  drawNode(0, 0);
  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureDeterministicGrain(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.4);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Deterministic Hash Function
  const pr = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Background: Warm Paper / Stone
  pCtx.fillStyle = "#f5f5f4";
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  // Generate 400 deterministic "specks"
  const speckCount = 400;
  for (let i = 0; i < speckCount; i++) {
    // Use the index as the seed for X, Y, and Opacity
    const x = pr(i + 0.1) * s;
    const y = pr(i + 0.2) * s;
    const opacity = pr(i + 0.3) * 0.15; // Subtle grit
    
    pCtx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
    
    // Vary the speck size slightly for a more natural feel
    const speckSize = pr(i + 0.4) > 0.8 ? 1.5 : 1; 
    pCtx.fillRect(x, y, speckSize, speckSize);
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureSeigaiha(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.5);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  pCtx.fillStyle = "#1e3a8a"; // Dark blue
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawWave = (cx: number, cy: number, r: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        pCtx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        pCtx.lineWidth = 1;
        // Multiple concentric arcs
        for (let i = 1; i <= 4; i++) {
          pCtx.beginPath();
          pCtx.arc(x, y, (r / 4) * i, Math.PI, 0);
          pCtx.stroke();
        }
      });
    });
  };

  // Staggered waves for the classic look
  drawWave(s * 0.5, s * 0.5, s * 0.4);
  drawWave(0, s, s * 0.4);
  drawWave(s, s, s * 0.4);

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureFilmGrain(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.4);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  const pr = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Base: Deep Charcoal
  pCtx.fillStyle = "#111827";
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  for (let i = 0; i < 500; i++) {
    const x = pr(i + 123) * s;
    const y = pr(i + 456) * s;
    // Brighter white specks for high contrast
    const alpha = pr(i + 789) * 0.25;
    pCtx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    pCtx.fillRect(x, y, 1.2, 1.2);
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureConcrete(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.5);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  const pr = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Base: Neutral Grey
  pCtx.fillStyle = "#d1d5db";
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  for (let i = 0; i < 300; i++) {
    const x = pr(i * 1.5) * s;
    const y = pr(i * 2.5) * s;
    const size = pr(i) > 0.9 ? 2 : 1;
    // Mix of light and dark specks for "depth"
    const color = pr(i + 5) > 0.5 ? "255,255,255" : "0,0,0";
    const alpha = pr(i + 6) * 0.12;
    
    pCtx.fillStyle = `rgba(${color}, ${alpha})`;
    pCtx.fillRect(x, y, size, size);
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureFineSand(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.3);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  const pr = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Base: Warm Sand
  pCtx.fillStyle = "#fdf6e3";
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  // High density, very low opacity
  for (let i = 0; i < 800; i++) {
    const x = pr(i + 1) * s;
    const y = pr(i + 2) * s;
    const alpha = pr(i + 3) * 0.08;
    pCtx.fillStyle = `rgba(180, 150, 100, ${alpha})`;
    pCtx.fillRect(x, y, 0.8, 0.8);
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureRandomDigits(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 1); // Larger tile for more digit variety
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Deterministic Hash
  const pr = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // 1. BACKGROUND (Deep Navy / Coding vibe)
  pCtx.fillStyle = "#0f172a";
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  // 2. GRID SETTINGS
  const gridCount = 5; // 5x5 grid of numbers
  const cellSize = s / gridCount;
  
  // Font styling
  pCtx.font = `bold ${cellSize * 1}px monospace`;
  pCtx.textAlign = "center";
  pCtx.textBaseline = "middle";

  const drawDigit = (cx: number, cy: number, seed: number) => {
    // 3x3 wrap-around for seamless tiling
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx;
        const y = cy + dy;
        
        const digit = Math.floor(pr(seed) * 10); // Random 0-9
        const opacity = 0.1 + pr(seed + 1) * 0.4; // Varied brightness
        
        // Matrix Green or Soft Blue
        pCtx.fillStyle = `rgba(56, 189, 248, ${opacity})`; 
        
        pCtx.fillText(digit.toString(), x, y);
      });
    });
  };

  // 3. FILL GRID
  for (let row = 0; row < gridCount; row++) {
    for (let col = 0; col < gridCount; col++) {
      const seed = row * gridCount + col;
      
      // Calculate center of cell with a tiny bit of "jitter"
      const jx = (pr(seed + 2) - 0.5) * (cellSize * 0.2);
      const jy = (pr(seed + 3) - 0.5) * (cellSize * 0.2);
      
      const x = (col + 0.5) * cellSize + jx;
      const y = (row + 0.5) * cellSize + jy;
      
      drawDigit(x, y, seed);
    }
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureHackerDigits(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 1.8); // Large tile for data density
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  const pr = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // 1. PITCH BLACK BACKGROUND
  pCtx.fillStyle = "#000000";
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  // 2. GRID CONFIG
  const gridCount = 8; 
  const cellSize = s / gridCount;
  
  pCtx.font = `bold ${cellSize * 0.6}px monospace`;
  pCtx.textAlign = "center";
  pCtx.textBaseline = "middle";

  const drawHackerDigit = (cx: number, cy: number, seed: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx;
        const y = cy + dy;
        
        const digit = Math.floor(pr(seed) * 10);
        const brightness = pr(seed + 1);
        
        // Layer 1: The "Glow" (Blurry background)
        pCtx.shadowBlur = 8;
        pCtx.shadowColor = "#22c55e";
        pCtx.fillStyle = `rgba(34, 197, 94, ${brightness * 0.3})`;
        pCtx.fillText(digit.toString(), x, y);
        
        // Layer 2: The Sharp Character
        pCtx.shadowBlur = 0; // Turn off shadow for sharpness
        pCtx.fillStyle = `rgba(34, 197, 94, ${0.4 + brightness * 0.6})`;
        pCtx.fillText(digit.toString(), x, y);
      });
    });
  };

  // 3. FILL GRID
  for (let row = 0; row < gridCount; row++) {
    for (let col = 0; col < gridCount; col++) {
      const seed = row * gridCount + col;
      
      // Strict grid with minimal jitter for that "code" structure
      const x = (col + 0.5) * cellSize;
      const y = (row + 0.5) * cellSize;
      
      // Occasionally skip a cell to make it look like "sparse data"
      if (pr(seed + 5) > 0.15) {
        drawHackerDigit(x, y, seed);
      }
    }
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureRandomAlphabets(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 1.5); 
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  const pr = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // 1. BACKGROUND (Classic Typewriter Paper)
  pCtx.fillStyle = "#bef3c2";
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const gridCount = 6;
  const cellSize = s / gridCount;
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  const drawChar = (cx: number, cy: number, seed: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx;
        const y = cy + dy;
        
        const char = chars[Math.floor(pr(seed) * chars.length)];
        const rotation = (pr(seed + 1) - 0.5) * 0.4; // Subtle tilt
        const opacity = 0.2 + pr(seed + 2) * 0.5;
        
        pCtx.save();
        pCtx.translate(x, y);
        pCtx.rotate(rotation);
        
        pCtx.font = `bold ${cellSize * 0.5}px "Courier New", monospace`;
        pCtx.textAlign = "center";
        pCtx.textBaseline = "middle";
        pCtx.fillStyle = `rgba(30, 41, 59, ${opacity})`; // Dark Slate
        
        pCtx.fillText(char, 0, 0);
        pCtx.restore();
      });
    });
  };

  for (let row = 0; row < gridCount; row++) {
    for (let col = 0; col < gridCount; col++) {
      const seed = row * gridCount + col;
      const x = (col + 0.5) * cellSize;
      const y = (row + 0.5) * cellSize;
      
      // Jitter the position slightly
      const jx = (pr(seed + 3) - 0.5) * (cellSize * 0.3);
      const jy = (pr(seed + 4) - 0.5) * (cellSize * 0.3);
      
      drawChar(x + jx, y + jy, seed);
    }
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureCandies(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 0.8); // Larger tile for variety
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  const pr = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // 1. BACKGROUND (Soft Pink Pastry Shop vibe)
  pCtx.fillStyle = "#fff0f6";
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const colors = ["#ff6b6b", "#f06595", "#845ef7", "#51cf66", "#fcc419", "#ff922b"];

  const drawCandy = (cx: number, cy: number, seed: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        const type = pr(seed);
        const color = colors[Math.floor(pr(seed + 1) * colors.length)];
        const r = s * 0.08 + pr(seed + 2) * (s * 0.05);

        pCtx.save();
        pCtx.translate(x, y);
        pCtx.rotate(pr(seed + 3) * Math.PI * 2);

        if (type < 0.4) {
          // WRAPPED HARD CANDY
          pCtx.fillStyle = color;
          // Ties/Wrappers
          pCtx.beginPath();
          pCtx.moveTo(-r * 1.5, -r * 0.5); pCtx.lineTo(-r * 0.5, 0); pCtx.lineTo(-r * 1.5, r * 0.5);
          pCtx.moveTo(r * 1.5, -r * 0.5); pCtx.lineTo(r * 0.5, 0); pCtx.lineTo(r * 1.5, r * 0.5);
          pCtx.fill();
          // Center
          pCtx.beginPath(); pCtx.arc(0, 0, r, 0, Math.PI * 2); pCtx.fill();
          // Shine
          pCtx.fillStyle = "rgba(255,255,255,0.3)";
          pCtx.beginPath(); pCtx.arc(-r*0.3, -r*0.3, r*0.3, 0, Math.PI * 2); pCtx.fill();
        } 
        else if (type < 0.7) {
          // JELLYBEAN
          pCtx.fillStyle = color;
          pCtx.beginPath();
          pCtx.ellipse(0, 0, r * 1.2, r * 0.7, 0, 0, Math.PI * 2);
          pCtx.fill();
          // Bean highlight
          pCtx.strokeStyle = "rgba(255,255,255,0.5)";
          pCtx.lineWidth = 3;
          pCtx.lineCap = "round";
          pCtx.beginPath(); pCtx.arc(0, 0, r * 0.8, -Math.PI * 0.5, 0); pCtx.stroke();
        } 
        else {
          // SWIRL LOLLIPOP/GUMBALL
          pCtx.fillStyle = color;
          pCtx.beginPath(); pCtx.arc(0, 0, r, 0, Math.PI * 2); pCtx.fill();
          // Swirl Detail
          pCtx.strokeStyle = "rgba(0,0,0,0.1)";
          pCtx.lineWidth = 2;
          pCtx.beginPath(); pCtx.arc(0, 0, r * 0.6, 0, Math.PI); pCtx.stroke();
        }
        pCtx.restore();
      });
    });
  };

  // Grid-based placement to prevent overlaps
  const grid = 2;
  const cell = s / grid;
  for (let i = 0; i < grid; i++) {
    for (let j = 0; j < grid; j++) {
      const seed = i * grid + j;
      const x = (i + 0.5) * cell + (pr(seed + 4) - 0.5) * (cell * 0.4);
      const y = (j + 0.5) * cell + (pr(seed + 5) - 0.5) * (cell * 0.4);
      drawCandy(x, y, seed);
    }
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureGifts(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 1.5); 
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  const pr = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // 1. BACKGROUND (Festive Deep Red or Soft Blue)
  pCtx.fillStyle = "#f8f9fa"; 
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const boxColors = ["#e63946", "#457b9d", "#f1faee", "#ffb703", "#fb8500"];
  const ribbonColors = ["#ffffff", "#1d3557", "#ffb703", "#e63946"];

  const drawGift = (cx: number, cy: number, seed: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        
        const boxColor = boxColors[Math.floor(pr(seed) * boxColors.length)];
        const ribbonColor = ribbonColors[Math.floor(pr(seed + 1) * ribbonColors.length)];
        const width = s * 0.15 + pr(seed + 2) * (s * 0.1);
        const height = s * 0.15 + pr(seed + 3) * (s * 0.1);
        const rotation = (pr(seed + 4) - 0.5) * 0.5;

        pCtx.save();
        pCtx.translate(x, y);
        pCtx.rotate(rotation);

        // 1. THE BOX
        pCtx.fillStyle = boxColor;
        pCtx.strokeStyle = "rgba(0,0,0,0.1)";
        pCtx.lineWidth = 1;
        pCtx.beginPath();
        pCtx.roundRect(-width / 2, -height / 2, width, height, 4);
        pCtx.fill();
        pCtx.stroke();

        // 2. THE RIBBONS (Cross shape)
        pCtx.fillStyle = ribbonColor;
        const rw = width * 0.2; // Ribbon width
        pCtx.fillRect(-rw / 2, -height / 2, rw, height); // Vertical
        pCtx.fillRect(-width / 2, -rw / 2, width, rw);   // Horizontal

        // 3. THE BOW (Two loops on top)
        const bw = rw * 1.5;
        pCtx.beginPath();
        // Left loop
        pCtx.ellipse(-bw / 2, -height / 2, bw, bw / 2, -Math.PI / 4, 0, Math.PI * 2);
        // Right loop
        pCtx.ellipse(bw / 2, -height / 2, bw, bw / 2, Math.PI / 4, 0, Math.PI * 2);
        pCtx.fill();
        
        // Bow Center knot
        pCtx.beginPath();
        pCtx.arc(0, -height / 2, rw * 0.6, 0, Math.PI * 2);
        pCtx.fill();

        pCtx.restore();
      });
    });
  };

  // 3x3 Grid with Jitter
  const grid = 3;
  const cell = s / grid;
  for (let i = 0; i < grid; i++) {
    for (let j = 0; j < grid; j++) {
      const seed = i * grid + j;
      const x = (i + 0.5) * cell + (pr(seed + 5) - 0.5) * (cell * 0.3);
      const y = (j + 0.5) * cell + (pr(seed + 6) - 0.5) * (cell * 0.3);
      drawGift(x, y, seed);
    }
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureCakeSlices(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 1.5); 
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  const pr = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // 1. BACKGROUND (Warm Vanilla)
  pCtx.fillStyle = "#fff9db"; 
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const cakeColors = ["#ff8787", "#fcc419", "#9775fa", "#a61e4d"]; // Strawberry, Lemon, Blueberry, Velvet
  const creamColor = "#ffffff";

  const drawCakeSlice = (cx: number, cy: number, seed: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        
        const mainColor = cakeColors[Math.floor(pr(seed) * cakeColors.length)];
        const r = s * 0.12;
        const rotation = pr(seed + 1) * Math.PI * 2;

        pCtx.save();
        pCtx.translate(x, y);
        pCtx.rotate(rotation);

        // 2. CAKE BODY (Triangle/Wedge)
        pCtx.fillStyle = mainColor;
        pCtx.beginPath();
        pCtx.moveTo(-r, -r * 0.5);
        pCtx.lineTo(r, 0);
        pCtx.lineTo(-r, r * 0.5);
        pCtx.closePath();
        pCtx.fill();

        // 3. FROSTING LAYERS (Middle and Top)
        pCtx.fillStyle = creamColor;
        // Middle filling line
        pCtx.fillRect(-r, -r * 0.05, r * 1.5, r * 0.1); 
        // Back frosting (curved edge)
        pCtx.beginPath();
        pCtx.arc(-r, 0, r * 0.5, Math.PI * 0.5, Math.PI * 1.5);
        pCtx.fill();

        // 4. CHERRY & CREAM TOPPING
        // Cream dollop
        pCtx.beginPath();
        pCtx.arc(-r * 0.5, -r * 0.2, r * 0.2, 0, Math.PI * 2);
        pCtx.fill();
        // The Cherry
        pCtx.fillStyle = "#e03131";
        pCtx.beginPath();
        pCtx.arc(-r * 0.5, -r * 0.35, r * 0.12, 0, Math.PI * 2);
        pCtx.fill();

        pCtx.restore();
      });
    });
  };

  // Scatter slices using a grid + jitter
  const grid = 3;
  const cell = s / grid;
  for (let i = 0; i < grid; i++) {
    for (let j = 0; j < grid; j++) {
      const seed = i * grid + j;
      const x = (i + 0.5) * cell + (pr(seed + 2) - 0.5) * (cell * 0.4);
      const y = (j + 0.5) * cell + (pr(seed + 3) - 0.5) * (cell * 0.4);
      
      drawCakeSlice(x, y, seed);

      // Add "Crumbs" in the empty space
      pCtx.fillStyle = "#fab005";
      for (let k = 0; k < 3; k++) {
        const cx = x + (pr(seed + k + 5) - 0.5) * cell;
        const cy = y + (pr(seed + k + 8) - 0.5) * cell;
        pCtx.beginPath();
        pCtx.arc(cx, cy, 1.5, 0, Math.PI * 2);
        pCtx.fill();
      }
    }
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureChristmas(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 1.5); 
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  const pr = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // 1. BACKGROUND (Night Sky or Festive Cream)
  pCtx.fillStyle = "#1a365d"; // Deep midnight blue
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawObject = (cx: number, cy: number, seed: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        const type = pr(seed);
        const r = s * 0.12;

        pCtx.save();
        pCtx.translate(x, y);

        if (type < 0.35) {
          // CHRISTMAS TREE
          pCtx.fillStyle = "#2f855a"; // Forest Green
          pCtx.beginPath();
          pCtx.moveTo(0, -r);
          pCtx.lineTo(r * 0.8, r * 0.5);
          pCtx.lineTo(-r * 0.8, r * 0.5);
          pCtx.closePath();
          pCtx.fill();
          // Trunk
          pCtx.fillStyle = "#744210";
          pCtx.fillRect(-r * 0.15, r * 0.5, r * 0.3, r * 0.3);
          // Star
          pCtx.fillStyle = "#f6e05e";
          pCtx.beginPath(); pCtx.arc(0, -r, r * 0.15, 0, Math.PI * 2); pCtx.fill();
        } 
        else if (type < 0.7) {
          // ORNAMENT / BAUBLE
          const color = pr(seed + 1) > 0.5 ? "#e53e3e" : "#f6e05e";
          pCtx.fillStyle = color;
          pCtx.beginPath(); pCtx.arc(0, 0, r * 0.7, 0, Math.PI * 2); pCtx.fill();
          // Top Cap
          pCtx.fillStyle = "#cbd5e0";
          pCtx.fillRect(-r * 0.15, -r * 0.85, r * 0.3, r * 0.2);
          // Shine
          pCtx.fillStyle = "rgba(255,255,255,0.3)";
          pCtx.beginPath(); pCtx.arc(-r * 0.2, -r * 0.2, r * 0.2, 0, Math.PI * 2); pCtx.fill();
        } 
        else {
          // SNOWFLAKE (Simple Star shape)
          pCtx.strokeStyle = "#ffffff";
          pCtx.lineWidth = 3;
          pCtx.lineCap = "round";
          for (let i = 0; i < 6; i++) {
            pCtx.rotate(Math.PI / 3);
            pCtx.beginPath(); pCtx.moveTo(0, 0); pCtx.lineTo(0, r * 0.7); pCtx.stroke();
            // Little V-tips
            pCtx.beginPath();
            pCtx.moveTo(-r * 0.2, r * 0.4); pCtx.lineTo(0, r * 0.6); pCtx.lineTo(r * 0.2, r * 0.4);
            pCtx.stroke();
          }
        }
        pCtx.restore();
      });
    });
  };

  // 3x3 Grid of Holiday Cheer
  const grid = 3;
  const cell = s / grid;
  for (let i = 0; i < grid; i++) {
    for (let j = 0; j < grid; j++) {
      const seed = i * grid + j;
      const x = (i + 0.5) * cell + (pr(seed + 2) - 0.5) * (cell * 0.2);
      const y = (j + 0.5) * cell + (pr(seed + 3) - 0.5) * (cell * 0.2);
      drawObject(x, y, seed);
    }
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}


export function textureFlowerGarden(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 1.6); 
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  const pr = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // 1. BACKGROUND (Soft Sage Green)
  pCtx.fillStyle = "#f1f5f0"; 
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawFlower = (cx: number, cy: number, seed: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        const type = pr(seed);
        const r = s * 0.08;
        const petalColor = ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#a0c4ff", "#bdb2ff", "#ffc6ff"][Math.floor(pr(seed + 1) * 8)];

        pCtx.save();
        pCtx.translate(x, y);
        pCtx.rotate(pr(seed + 2) * Math.PI * 2);

        if (type < 0.4) {
          // 2. DAISY (Circular petals)
          pCtx.fillStyle = "white";
          for (let i = 0; i < 8; i++) {
            pCtx.rotate(Math.PI / 4);
            pCtx.beginPath();
            pCtx.ellipse(r, 0, r * 0.8, r * 0.3, 0, 0, Math.PI * 2);
            pCtx.fill();
          }
          // Center
          pCtx.fillStyle = "#ffd6a5";
          pCtx.beginPath(); pCtx.arc(0, 0, r * 0.4, 0, Math.PI * 2); pCtx.fill();
        } 
        else if (type < 0.7) {
          // 3. TULIP
          pCtx.fillStyle = petalColor;
          pCtx.beginPath();
          pCtx.arc(0, 0, r, 0, Math.PI, false); // Bottom bowl
          pCtx.lineTo(-r, -r);
          pCtx.lineTo(-r * 0.3, -r * 0.5);
          pCtx.lineTo(0, -r);
          pCtx.lineTo(r * 0.3, -r * 0.5);
          pCtx.lineTo(r, -r);
          pCtx.closePath();
          pCtx.fill();
          // Stem nub
          pCtx.strokeStyle = "#556b2f"; pCtx.lineWidth = 2;
          pCtx.beginPath(); pCtx.moveTo(0, r); pCtx.lineTo(0, r * 1.5); pCtx.stroke();
        } 
        else {
          // 4. SIMPLE 5-PETAL BLOSSOM
          pCtx.fillStyle = petalColor;
          for (let i = 0; i < 5; i++) {
            pCtx.rotate((Math.PI * 2) / 5);
            pCtx.beginPath();
            pCtx.ellipse(r * 0.7, 0, r * 0.6, r * 0.5, 0, 0, Math.PI * 2);
            pCtx.fill();
          }
          pCtx.fillStyle = "rgba(0,0,0,0.1)";
          pCtx.beginPath(); pCtx.arc(0, 0, r * 0.2, 0, Math.PI * 2); pCtx.fill();
        }
        pCtx.restore();
      });
    });
  };

  // 4x4 Grid for a dense garden feel
  const grid = 4;
  const cell = s / grid;
  for (let i = 0; i < grid; i++) {
    for (let j = 0; j < grid; j++) {
      const seed = i * grid + j;
      const x = (i + 0.5) * cell + (pr(seed + 3) - 0.5) * (cell * 0.5);
      const y = (j + 0.5) * cell + (pr(seed + 4) - 0.5) * (cell * 0.5);
      drawFlower(x, y, seed);
    }
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureFlowersDarkBg(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 1.6); 
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  const pr = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // 1. BACKGROUND (Deep Moody Teal)
  pCtx.fillStyle = "#1a3c34"; 
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  // Richer jewel tones for the dark background
  const petalColors = ["#ff6b6b", "#fcc419", "#51cf66", "#339af0", "#cc5de8", "#ff922b", "#fa5252"];

  const drawFlower = (cx: number, cy: number, seed: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        const type = pr(seed);
        const r = s * 0.08;
        const petalColor = petalColors[Math.floor(pr(seed + 1) * petalColors.length)];

        pCtx.save();
        pCtx.translate(x, y);
        pCtx.rotate(pr(seed + 2) * Math.PI * 2);

        // Shared style for colored flowers to pop against dark bg
        pCtx.strokeStyle = "rgba(255,255,255,0.25)";
        pCtx.lineWidth = 1;

        if (type < 0.35) {
          // 2. CLASSIC DAISY (White pops naturally)
          pCtx.fillStyle = "#f8f9fa"; // Bright white
          for (let i = 0; i < 8; i++) {
            pCtx.rotate(Math.PI / 4);
            pCtx.beginPath();
            pCtx.ellipse(r, 0, r * 0.8, r * 0.3, 0, 0, Math.PI * 2);
            pCtx.fill();
          }
          // Center (Bright Gold)
          pCtx.fillStyle = "#ffd700";
          pCtx.beginPath(); pCtx.arc(0, 0, r * 0.4, 0, Math.PI * 2); pCtx.fill();
        } 
        else if (type < 0.7) {
          // 3. TULIP
          pCtx.fillStyle = petalColor;
          pCtx.beginPath();
          pCtx.arc(0, 0, r, 0, Math.PI, false);
          pCtx.lineTo(-r, -r); pCtx.lineTo(-r * 0.3, -r * 0.5);
          pCtx.lineTo(0, -r); pCtx.lineTo(r * 0.3, -r * 0.5);
          pCtx.lineTo(r, -r);
          pCtx.closePath();
          pCtx.fill();
          pCtx.stroke(); // Subtle outline
          // Stem nub (Lighter green to see it)
          pCtx.strokeStyle = "#82c91e"; pCtx.lineWidth = 2;
          pCtx.beginPath(); pCtx.moveTo(0, r); pCtx.lineTo(0, r * 1.5); pCtx.stroke();
        } 
        else {
          // 4. ROUND BLOSSOM
          pCtx.fillStyle = petalColor;
          for (let i = 0; i < 5; i++) {
            pCtx.rotate((Math.PI * 2) / 5);
            pCtx.beginPath();
            pCtx.ellipse(r * 0.7, 0, r * 0.6, r * 0.5, 0, 0, Math.PI * 2);
            pCtx.fill();
            pCtx.stroke(); // Subtle outline on petals
          }
          pCtx.fillStyle = "rgba(255,255,255,0.8)"; // Bright center dot
          pCtx.beginPath(); pCtx.arc(0, 0, r * 0.15, 0, Math.PI * 2); pCtx.fill();
        }
        pCtx.restore();
      });
    });
  };

  // Dense 4x4 Grid with jitter
  const grid = 4;
  const cell = s / grid;
  for (let i = 0; i < grid; i++) {
    for (let j = 0; j < grid; j++) {
      const seed = i * grid + j;
      const x = (i + 0.5) * cell + (pr(seed + 3) - 0.5) * (cell * 0.5);
      const y = (j + 0.5) * cell + (pr(seed + 4) - 0.5) * (cell * 0.5);
      drawFlower(x, y, seed);
    }
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureMidnightNeon(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 1.8); 
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  const pr = (n: number) => {
    const x = Math.sin(n) * 10000;
    return x - Math.floor(x);
  };

  // Background: Deepest Obsidian
  pCtx.fillStyle = "#020617"; 
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const neonColors = ["#00f5d4", "#f15bb5", "#fee440", "#00bbf9", "#9b5de5"];

  const drawFlora = (cx: number, cy: number, seed: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        const type = pr(seed);
        const r = s * 0.07;
        const color = neonColors[Math.floor(pr(seed + 1) * neonColors.length)];

        pCtx.save();
        pCtx.translate(x, y);
        pCtx.rotate(pr(seed + 2) * Math.PI * 2);

        if (type < 0.4) {
          // STARFLOWER (Pointy petals)
          pCtx.fillStyle = color;
          pCtx.beginPath();
          for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const dist = i % 2 === 0 ? r : r * 0.4;
            pCtx.lineTo(Math.cos(angle) * dist, Math.sin(angle) * dist);
          }
          pCtx.fill();
        } else if (type < 0.7) {
          // LILY (3 Sharp Petals)
          pCtx.strokeStyle = color;
          pCtx.lineWidth = 2;
          for (let i = 0; i < 3; i++) {
            pCtx.rotate((Math.PI * 2) / 3);
            pCtx.beginPath();
            pCtx.moveTo(0, 0);
            pCtx.quadraticCurveTo(r, -r, 0, -r * 1.2);
            pCtx.quadraticCurveTo(-r, -r, 0, 0);
            pCtx.stroke();
          }
        } else {
          // LEAF FILLER (To make it lush)
          pCtx.fillStyle = "#10b981"; // Emerald green
          pCtx.beginPath();
          pCtx.ellipse(0, 0, r * 0.8, r * 0.3, 0.5, 0, Math.PI * 2);
          pCtx.fill();
        }
        pCtx.restore();
      });
    });
  };

  const grid = 5; // Denser grid
  const cell = s / grid;
  for (let i = 0; i < grid; i++) {
    for (let j = 0; j < grid; j++) {
      const seed = i * grid + j;
      const x = (i + 0.5) * cell + (pr(seed + 3) - 0.5) * (cell * 0.6);
      const y = (j + 0.5) * cell + (pr(seed + 4) - 0.5) * (cell * 0.6);
      drawFlora(x, y, seed);
    }
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}


export function textureMidnightBerries(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 1.5); 
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  const pr = (n: number) => Math.abs(Math.sin(n) * 10000) % 1;

  // Background: Deep Forest
  pCtx.fillStyle = "#131c15"; 
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const berryColors = ["#ff4d6d", "#ff758f", "#c9184a", "#800f2f"];

  const drawBerryCluster = (cx: number, cy: number, seed: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        pCtx.save();
        pCtx.translate(x, y);
        pCtx.rotate(pr(seed) * Math.PI * 2);

        // Stems
        pCtx.strokeStyle = "#4b634d";
        pCtx.lineWidth = 1;
        pCtx.beginPath();
        pCtx.moveTo(0, 0);
        pCtx.lineTo(0, s * 0.1);
        pCtx.stroke();

        // Berries (3 to 5 tiny circles)
        const count = 3 + Math.floor(pr(seed + 1) * 3);
        for (let i = 0; i < count; i++) {
          pCtx.fillStyle = berryColors[Math.floor(pr(seed + i) * berryColors.length)];
          const bx = (pr(seed + i) - 0.5) * 15;
          const by = (pr(seed + i + 1) - 0.5) * 15;
          pCtx.beginPath();
          pCtx.arc(bx, by, 3, 0, Math.PI * 2);
          pCtx.fill();
          // Tiny white "shine" on berry
          pCtx.fillStyle = "rgba(255,255,255,0.4)";
          pCtx.fillRect(bx - 1, by - 1, 1, 1);
        }
        pCtx.restore();
      });
    });
  };

  const grid = 6;
  const cell = s / grid;
  for (let i = 0; i < grid; i++) {
    for (let j = 0; j < grid; j++) {
      drawBerryCluster((i + 0.5) * cell, (j + 0.5) * cell, i * grid + j);
    }
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureCherryBlossom(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  // Increase tile size slightly for better variety in a dense pattern
  const s = Math.round(size * 1.5);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // Deterministic random helper
  const pr = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Background: Soft Spring Sky
  pCtx.fillStyle = "#fdf2f8"; // Very pale pink-white
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawSakura = (cx: number, cy: number, r: number, seed: number) => {
    // Seamless wrapping logic
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        pCtx.save();
        pCtx.translate(x, y);
        pCtx.rotate(pr(seed) * Math.PI * 2);

        // Draw 5 notched petals
        const petalColor = pr(seed + 1) > 0.5 ? "#fda4af" : "#fecdd3";
        pCtx.fillStyle = petalColor;
        
        for (let i = 0; i < 5; i++) {
          pCtx.rotate((Math.PI * 2) / 5);
          pCtx.beginPath();
          // Sakura petals are heart-shaped (notched at the end)
          pCtx.moveTo(0, 0);
          pCtx.bezierCurveTo(r * 0.5, -r * 0.5, r * 1.2, -r * 0.2, r, 0);
          pCtx.bezierCurveTo(r * 1.2, r * 0.2, r * 0.5, r * 0.5, 0, 0);
          pCtx.fill();
        }

        // Center stamen
        pCtx.fillStyle = "#fb7185";
        pCtx.beginPath(); pCtx.arc(0, 0, r * 0.2, 0, Math.PI * 2); pCtx.fill();
        pCtx.restore();
      });
    });
  };

  const drawSinglePetal = (cx: number, cy: number, r: number, seed: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        pCtx.save();
        pCtx.translate(cx + dx, cy + dy);
        pCtx.rotate(pr(seed) * Math.PI * 2);
        pCtx.fillStyle = "#ffe4e6";
        pCtx.beginPath();
        pCtx.ellipse(0, 0, r, r * 0.6, 0, 0, Math.PI * 2);
        pCtx.fill();
        pCtx.restore();
      });
    });
  };

  // 1. Density: Use a 5x5 grid for flowers
  const grid = 5;
  const cell = s / grid;

  for (let i = 0; i < grid; i++) {
    for (let j = 0; j < grid; j++) {
      const seed = i * grid + j;
      
      // Jittered position
      const x = (i + 0.5) * cell + (pr(seed + 10) - 0.5) * (cell * 0.7);
      const y = (j + 0.5) * cell + (pr(seed + 20) - 0.5) * (cell * 0.7);
      
      // Variable size
      const radius = s * 0.05 + pr(seed + 30) * (s * 0.04);
      
      drawSakura(x, y, radius, seed);

      // 2. Add "falling petals" in the gaps
      const px = x + (pr(seed + 40) - 0.5) * cell;
      const py = y + (pr(seed + 50) - 0.5) * cell;
      drawSinglePetal(px, py, radius * 0.4, seed + 60);
    }
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureMidnightRose(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 1.5);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  const pr = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Background: Deep Indigo
  pCtx.fillStyle = "#1e1b4b"; 
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawRose = (cx: number, cy: number, seed: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        const r = s * 0.12;
        const color = pr(seed) > 0.5 ? "#be123c" : "#7e22ce"; // Rose Red or Violet

        pCtx.save();
        pCtx.translate(x, y);
        pCtx.rotate(pr(seed + 1) * Math.PI * 2);

        // Outer Petals
        pCtx.fillStyle = color;
        for (let i = 0; i < 6; i++) {
          pCtx.rotate(Math.PI / 3);
          pCtx.beginPath();
          pCtx.ellipse(r * 0.6, 0, r * 0.7, r * 0.5, 0, 0, Math.PI * 2);
          pCtx.fill();
        }
        // Inner Petals (Slightly darker)
        pCtx.globalAlpha = 0.8;
        pCtx.fillStyle = "#4c0519"; 
        for (let i = 0; i < 3; i++) {
          pCtx.rotate(Math.PI / 1.5);
          pCtx.beginPath();
          pCtx.ellipse(r * 0.3, 0, r * 0.4, r * 0.3, 0, 0, Math.PI * 2);
          pCtx.fill();
        }
        pCtx.restore();
      });
    });
  };

  for (let i = 0; i < 5; i++) {
    drawRose(pr(i * 7) * s, pr(i * 13) * s, i);
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureCyberFlora(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 1.2);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  const pr = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  pCtx.fillStyle = "#000000";
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawNeonFlower = (cx: number, cy: number, seed: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        const color = pr(seed) > 0.5 ? "#22d3ee" : "#f472b6"; // Cyan or Pink
        const r = s * 0.08;

        pCtx.save();
        pCtx.translate(x, y);
        
        // Glow Effect
        pCtx.shadowBlur = 10;
        pCtx.shadowColor = color;
        pCtx.strokeStyle = color;
        pCtx.lineWidth = 2;

        for (let i = 0; i < 4; i++) {
          pCtx.rotate(Math.PI / 2);
          pCtx.beginPath();
          pCtx.moveTo(0, 0);
          pCtx.quadraticCurveTo(r, -r, r * 1.5, 0);
          pCtx.quadraticCurveTo(r, r, 0, 0);
          pCtx.stroke();
        }
        
        // Bright Center Node
        pCtx.fillStyle = "#ffffff";
        pCtx.beginPath(); pCtx.arc(0, 0, 2, 0, Math.PI * 2); pCtx.fill();
        pCtx.restore();
      });
    });
  };

  for (let i = 0; i < 8; i++) {
    drawNeonFlower(pr(i * 5) * s, pr(i * 11) * s, i);
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureDarkSunflowers(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 1.5);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  const pr = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  pCtx.fillStyle = "#1c1917"; // Stone/Charcoal
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawSunflower = (cx: number, cy: number, seed: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        const r = s * 0.1;

        pCtx.save();
        pCtx.translate(x, y);
        pCtx.rotate(pr(seed) * Math.PI);

        // Petals (Pointed)
        pCtx.fillStyle = pr(seed + 2) > 0.5 ? "#fbbf24" : "#ea580c";
        for (let i = 0; i < 12; i++) {
          pCtx.rotate(Math.PI / 6);
          pCtx.beginPath();
          pCtx.moveTo(0, 0);
          pCtx.lineTo(r, -r * 0.15);
          pCtx.lineTo(r * 1.2, 0);
          pCtx.lineTo(r, r * 0.15);
          pCtx.closePath();
          pCtx.fill();
        }

        // Dark Textured Center
        pCtx.fillStyle = "#44403c";
        pCtx.beginPath(); pCtx.arc(0, 0, r * 0.45, 0, Math.PI * 2); pCtx.fill();
        pCtx.restore();
      });
    });
  };

  for (let i = 0; i < 6; i++) {
    drawSunflower(pr(i * 3) * s, pr(i * 9) * s, i);
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureApplesDark(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 1.5); 
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  const pr = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // 1. BACKGROUND (Midnight Forest Green)
  pCtx.fillStyle = "#064e3b"; 
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawApple = (cx: number, cy: number, seed: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        
        // Deterministic properties
        const isGreen = pr(seed) > 0.7; // 30% chance for a Green apple
        const appleColor = isGreen ? "#84cc16" : "#ef4444";
        const r = s * 0.1 + pr(seed + 1) * (s * 0.04);
        const rotation = (pr(seed + 2) - 0.5) * 0.5;

        pCtx.save();
        pCtx.translate(x, y);
        pCtx.rotate(rotation);

        // 2. STEM (Brown)
        pCtx.strokeStyle = "#451a03";
        pCtx.lineWidth = 3;
        pCtx.lineCap = "round";
        pCtx.beginPath();
        pCtx.moveTo(0, 0);
        pCtx.quadraticCurveTo(r * 0.2, -r * 1.2, r * 0.4, -r * 1.3);
        pCtx.stroke();

        // 3. LEAF (Darker Green)
        pCtx.fillStyle = "#166534";
        pCtx.beginPath();
        pCtx.ellipse(r * 0.3, -r * 1.1, r * 0.4, r * 0.2, -Math.PI / 4, 0, Math.PI * 2);
        pCtx.fill();

        // 4. APPLE BODY (Heart-like Round Shape)
        pCtx.fillStyle = appleColor;
        pCtx.beginPath();
        // Left lobe
        pCtx.arc(-r * 0.4, -r * 0.1, r * 0.7, 0, Math.PI * 2);
        // Right lobe
        pCtx.arc(r * 0.4, -r * 0.1, r * 0.7, 0, Math.PI * 2);
        // Bottom fill
        pCtx.arc(0, r * 0.3, r * 0.7, 0, Math.PI * 2);
        pCtx.fill();

        // 5. SHINE (White highlight)
        pCtx.fillStyle = "rgba(255, 255, 255, 0.3)";
        pCtx.beginPath();
        pCtx.ellipse(-r * 0.5, -r * 0.4, r * 0.3, r * 0.15, Math.PI / 4, 0, Math.PI * 2);
        pCtx.fill();

        pCtx.restore();
      });
    });
  };

  // 3x3 Grid of Apples
  const grid = 3;
  const cell = s / grid;
  for (let i = 0; i < grid; i++) {
    for (let j = 0; j < grid; j++) {
      const seed = i * grid + j;
      const x = (i + 0.5) * cell + (pr(seed + 3) - 0.5) * (cell * 0.3);
      const y = (j + 0.5) * cell + (pr(seed + 4) - 0.5) * (cell * 0.3);
      drawApple(x, y, seed);
    }
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureRefinedApples(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 1.5); 
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  const pr = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // 1. BACKGROUND (Deep Midnight Charcoal)
  pCtx.fillStyle = "#064e3b"; 
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawApple = (cx: number, cy: number, seed: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        
        // Size reduction: radius is now much smaller (s * 0.05)
        const r = s * 0.05 + pr(seed + 1) * (s * 0.02);
        const isGreen = pr(seed) > 0.75;
        const appleColor = isGreen ? "#65a30d" : "#dc2626";
        const rotation = (pr(seed + 2) - 0.5) * 0.6;

        pCtx.save();
        pCtx.translate(x, y);
        pCtx.rotate(rotation);

        // 2. REFINED APPLE SHAPE (Bezier Path)
        pCtx.fillStyle = appleColor;
        pCtx.beginPath();
        // Start at the top indent
        pCtx.moveTo(0, -r * 0.2);
        // Top right lobe
        pCtx.bezierCurveTo(r * 0.5, -r * 1.2, r * 1.5, -r * 0.5, r, r * 0.5);
        // Bottom point
        pCtx.bezierCurveTo(r * 0.8, r * 1.2, -r * 0.8, r * 1.2, -r, r * 0.5);
        // Top left lobe
        pCtx.bezierCurveTo(-r * 1.5, -r * 0.5, -r * 0.5, -r * 1.2, 0, -r * 0.2);
        pCtx.fill();

        // 3. STEM
        pCtx.strokeStyle = "#451a03";
        pCtx.lineWidth = 1.5;
        pCtx.beginPath();
        pCtx.moveTo(0, -r * 0.2);
        pCtx.quadraticCurveTo(r * 0.1, -r * 0.8, r * 0.4, -r * 0.9);
        pCtx.stroke();

        // 4. LEAF
        pCtx.fillStyle = "#14532d";
        pCtx.beginPath();
        pCtx.ellipse(r * 0.3, -r * 0.7, r * 0.35, r * 0.15, -Math.PI / 4, 0, Math.PI * 2);
        pCtx.fill();

        // 5. TINY HIGHLIGHT
        pCtx.fillStyle = "rgba(255, 255, 255, 0.2)";
        pCtx.beginPath();
        pCtx.arc(-r * 0.4, -r * 0.2, r * 0.15, 0, Math.PI * 2);
        pCtx.fill();

        pCtx.restore();
      });
    });
  };

  // 4x4 Grid for a smaller, denser repeat
  const grid = 4;
  const cell = s / grid;
  for (let i = 0; i < grid; i++) {
    for (let j = 0; j < grid; j++) {
      const seed = i * grid + j;
      const x = (i + 0.5) * cell + (pr(seed + 3) - 0.5) * (cell * 0.4);
      const y = (j + 0.5) * cell + (pr(seed + 4) - 0.5) * (cell * 0.4);
      drawApple(x, y, seed);
    }
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureRefinedBananas(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 1.6); 
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  const pr = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // 1. BACKGROUND (Deep Midnight Violet)
  pCtx.fillStyle = "#0f071a"; 
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawBanana = (cx: number, cy: number, seed: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        
        // Size reduction: radius/length is much smaller (s * 0.06)
        const r = s * 0.06 + pr(seed + 1) * (s * 0.02);
        const bananaColor = "#fde047"; // Bright Banana Yellow
        const tipColor = "#422006";    // Dark Brown
        const rotation = pr(seed + 2) * Math.PI * 2;

        pCtx.save();
        pCtx.translate(x, y);
        pCtx.rotate(rotation);

        // 2. BANANA BODY (Crescent Shape)
        pCtx.fillStyle = bananaColor;
        pCtx.beginPath();
        // Top outer curve
        pCtx.moveTo(-r, 0);
        pCtx.quadraticCurveTo(0, -r * 0.8, r, 0);
        // Inner curve to create the crescent thickness
        pCtx.quadraticCurveTo(0, -r * 0.2, -r, 0);
        pCtx.fill();

        // 3. STEM (Top)
        pCtx.fillStyle = tipColor;
        pCtx.save();
        pCtx.translate(-r, 0);
        pCtx.rotate(-Math.PI / 4);
        pCtx.fillRect(0, -2, 4, 4);
        pCtx.restore();

        // 4. TIP (Bottom)
        pCtx.beginPath();
        pCtx.arc(r, 0, 1.5, 0, Math.PI * 2);
        pCtx.fill();

        // 5. DEFINITION LINE (Subtle ridge)
        pCtx.strokeStyle = "rgba(0, 0, 0, 0.15)";
        pCtx.lineWidth = 1;
        pCtx.beginPath();
        pCtx.moveTo(-r * 0.8, -r * 0.1);
        pCtx.quadraticCurveTo(0, -r * 0.5, r * 0.8, -r * 0.1);
        pCtx.stroke();

        // 6. HIGHLIGHT
        pCtx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        pCtx.lineWidth = 1.5;
        pCtx.beginPath();
        pCtx.arc(0, -r * 0.4, r * 0.4, Math.PI * 1.1, Math.PI * 1.9);
        pCtx.stroke();

        pCtx.restore();
      });
    });
  };

  // 5x5 Grid for a very dense, high-quality repeat
  const grid = 5;
  const cell = s / grid;
  for (let i = 0; i < grid; i++) {
    for (let j = 0; j < grid; j++) {
      const seed = i * grid + j;
      const x = (i + 0.5) * cell + (pr(seed + 3) - 0.5) * (cell * 0.5);
      const y = (j + 0.5) * cell + (pr(seed + 4) - 0.5) * (cell * 0.5);
      drawBanana(x, y, seed);
    }
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureAnatomicalBananas(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 1.6); 
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  const pr = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // 1. BACKGROUND (Deep Charcoal / Midnight)
  pCtx.fillStyle = "#111111"; 
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const drawRealBanana = (cx: number, cy: number, seed: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = cx + dx, y = cy + dy;
        
        // Scale: Small and refined
        const r = s * 0.05 + pr(seed + 1) * (s * 0.02);
        const rotation = pr(seed + 2) * Math.PI * 2;

        pCtx.save();
        pCtx.translate(x, y);
        pCtx.rotate(rotation);

        // 2. THE BANANA BODY (Asymmetric Tapered Path)
        pCtx.fillStyle = "#facc15"; // Ripened Yellow
        pCtx.beginPath();
        // The "Top" outer curve (The arch)
        pCtx.moveTo(-r * 1.5, -r * 0.2); 
        pCtx.bezierCurveTo(-r * 0.5, -r * 1.2, r * 0.8, -r * 1.0, r * 1.5, r * 0.4);
        // The "Bottom" inner curve (The belly)
        pCtx.bezierCurveTo(r * 0.8, r * 0.2, -r * 0.5, 0, -r * 1.5, -r * 0.2);
        pCtx.fill();

        // 3. THE STEM (The Neck)
        pCtx.fillStyle = "#422006"; // Dark Wood Brown
        pCtx.save();
        pCtx.translate(-r * 1.5, -r * 0.2);
        pCtx.rotate(-Math.PI / 6);
        // Small rectangular stem neck
        pCtx.fillRect(-2, -r * 0.3, 4, r * 0.4); 
        pCtx.restore();

        // 4. THE TIP (Floral End)
        pCtx.beginPath();
        pCtx.arc(r * 1.5, r * 0.4, 1.5, 0, Math.PI * 2);
        pCtx.fill();

        // 5. THE RIDGE (The line that makes it look 3D)
        pCtx.strokeStyle = "rgba(0, 0, 0, 0.1)";
        pCtx.lineWidth = 1;
        pCtx.beginPath();
        pCtx.moveTo(-r * 1.2, -r * 0.1);
        pCtx.bezierCurveTo(-r * 0.4, -r * 0.6, r * 0.6, -r * 0.4, r * 1.2, r * 0.3);
        pCtx.stroke();

        // 6. SOFT HIGHLIGHT (Glossy Peel)
        pCtx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        pCtx.lineWidth = 2;
        pCtx.beginPath();
        pCtx.arc(0, -r * 0.5, r * 0.6, Math.PI * 1.2, Math.PI * 1.6);
        pCtx.stroke();

        pCtx.restore();
      });
    });
  };

  // 5x5 Grid for a high-density, high-quality repeat
  const grid = 5;
  const cell = s / grid;
  for (let i = 0; i < grid; i++) {
    for (let j = 0; j < grid; j++) {
      const seed = i * grid + j;
      const x = (i + 0.5) * cell + (pr(seed + 3) - 0.5) * (cell * 0.4);
      const y = (j + 0.5) * cell + (pr(seed + 4) - 0.5) * (cell * 0.4);
      drawRealBanana(x, y, seed);
    }
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureGrassLight(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 1.2); 
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  const pr = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // 1. BACKGROUND (Deep Earthy Green)
  pCtx.fillStyle = "#304b24"; 
  pCtx.fillRect(-1, -1, s + 2, s + 2);

  const colors = ["#3f6212", "#4d7c29", "#65a30d"];

  const drawBladeLight = (bx: number, by: number, seed: number) => {
    // 3x3 Tiling Wrap (Only necessary if blades are long enough to cross edges)
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        const x = bx + dx, y = by + dy;
        const h = s * 0.1 + pr(seed) * (s * 0.1);
        const tilt = (pr(seed + 1) - 0.5) * (h * 0.6);
        const color = colors[Math.floor(pr(seed + 2) * colors.length)];

        pCtx.strokeStyle = color;
        pCtx.lineWidth = 1.5;
        pCtx.lineCap = "round";

        // Draw blade as a single curved line
        pCtx.beginPath();
        pCtx.moveTo(x, y);
        pCtx.quadraticCurveTo(x + tilt * 0.2, y - h * 0.5, x + tilt, y - h);
        pCtx.stroke();
      });
    });
  };

  // 2. REDUCED DENSITY GRID (6x6 instead of 10x10)
  const grid = 6;
  const cell = s / grid;
  for (let i = 0; i < grid; i++) {
    for (let j = 0; j < grid; j++) {
      const seed = i * grid + j;
      // Position with jitter
      const x = (i + 0.5) * cell + (pr(seed + 3) - 0.5) * cell;
      const y = (j + 0.5) * cell + (pr(seed + 4) - 0.5) * cell;
      
      // Draw 2-3 blades per spot instead of 7
      drawBladeLight(x, y, seed);
      drawBladeLight(x + 2, y, seed + 10);
    }
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureGhosts(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 1.6);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  const pr = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // 1. CREATE HIGH-QUALITY SPRITE (Off-screen)
  const spriteSize = s * 0.4;
  const ghostSprite = document.createElement("canvas");
  ghostSprite.width = spriteSize * dpr; ghostSprite.height = spriteSize * dpr;
  const gCtx = ghostSprite.getContext("2d")!;
  gCtx.scale(dpr, dpr);

  const r = spriteSize * 0.22;
  const bh = r * 1.6;
  const cx = spriteSize / 2;
  const cy = r + 10;

  // Layer A: The Pre-Baked Glow (Radial Gradient is faster than shadowBlur)
  const glow = gCtx.createRadialGradient(cx, cy, 0, cx, cy, r * 2.5);
  glow.addColorStop(0, "rgba(255, 255, 255, 0.2)");
  glow.addColorStop(1, "rgba(255, 255, 255, 0)");
  gCtx.fillStyle = glow;
  gCtx.fillRect(0, 0, spriteSize, spriteSize);

  // Layer B: The Fluid Ghost Body
  gCtx.fillStyle = "rgba(240, 248, 255, 0.9)"; // Slight blue-tint white
  gCtx.beginPath();
  gCtx.arc(cx, cy, r, Math.PI, 0); // Head
  gCtx.lineTo(cx + r, cy + bh);   // Right side
  
  // Fluid wavy bottom using Bezier curves
  const wave = (r * 2) / 4;
  gCtx.bezierCurveTo(cx + r - wave, cy + bh + 10, cx + r - wave * 2, cy + bh - 10, cx, cy + bh);
  gCtx.bezierCurveTo(cx - wave, cy + bh + 10, cx - r + wave, cy + bh - 10, cx - r, cy + bh);
  
  gCtx.lineTo(cx - r, cy);
  gCtx.fill();

  // Layer C: Refined Eyes (Tear-drop/Oval)
  gCtx.fillStyle = "#0f172a";
  const eyeOffset = r * 0.35;
  const eyeSize = r * 0.22;
  gCtx.beginPath();
  gCtx.ellipse(cx - eyeOffset, cy, eyeSize, eyeSize * 1.3, 0, 0, Math.PI * 2);
  gCtx.ellipse(cx + eyeOffset, cy, eyeSize, eyeSize * 1.3, 0, 0, Math.PI * 2);
  gCtx.fill();

  // 2. MAIN PATTERN RENDERING (Super Fast)
  pCtx.fillStyle = "#0a0a0f"; // Very dark midnight
  pCtx.fillRect(0, 0, s, s);

  const grid = 4;
  const cell = s / grid;

  for (let i = 0; i < grid; i++) {
    for (let j = 0; j < grid; j++) {
      const seed = i * grid + j;
      const x = (i + 0.5) * cell + (pr(seed) - 0.5) * (cell * 0.6);
      const y = (j + 0.5) * cell + (pr(seed + 1) - 0.5) * (cell * 0.6);
      
      pCtx.save();
      pCtx.translate(x, y);
      pCtx.rotate((pr(seed + 2) - 0.5) * 0.4);
      pCtx.scale(0.8 + pr(seed + 3) * 0.4, 0.8 + pr(seed + 3) * 0.4); // Scale variety
      
      pCtx.drawImage(ghostSprite, -spriteSize / 2, -spriteSize / 2, spriteSize, spriteSize);
      
      pCtx.restore();
    }
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureScatteredGhosts(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 1.8); // Slightly larger tile for more "breathing room"
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  const pr = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // 1. SPRITE GENERATION (Off-screen)
  const spriteSize = s * 0.35;
  const ghostSprite = document.createElement("canvas");
  ghostSprite.width = spriteSize * dpr; ghostSprite.height = spriteSize * dpr;
  const gCtx = ghostSprite.getContext("2d")!;
  gCtx.scale(dpr, dpr);

  const r = spriteSize * 0.2;
  const bh = r * 1.5;
  const cx = spriteSize / 2;
  const cy = r + 5;

  // Layer A: Glow
  const glow = gCtx.createRadialGradient(cx, cy, 0, cx, cy, r * 2.2);
  glow.addColorStop(0, "rgba(255, 255, 255, 0.15)");
  glow.addColorStop(1, "rgba(255, 255, 255, 0)");
  gCtx.fillStyle = glow;
  gCtx.fillRect(0, 0, spriteSize, spriteSize);

  // Layer B: Body
  gCtx.fillStyle = "rgba(248, 250, 252, 0.95)"; 
  gCtx.beginPath();
  gCtx.arc(cx, cy, r, Math.PI, 0); 
  gCtx.lineTo(cx + r, cy + bh);   
  const wave = (r * 2) / 3;
  // Deep, smooth waves
  gCtx.bezierCurveTo(cx + r - wave/2, cy + bh + 8, cx + wave/2, cy + bh + 8, cx, cy + bh);
  gCtx.bezierCurveTo(cx - wave/2, cy + bh + 8, cx - r + wave/2, cy + bh + 8, cx - r, cy + bh);
  gCtx.lineTo(cx - r, cy);
  gCtx.fill();

  // Layer C: Cheeks (The "slightly different" detail)
  gCtx.fillStyle = "rgba(251, 113, 133, 0.3)"; // Soft rose blush
  gCtx.beginPath();
  gCtx.arc(cx - r * 0.5, cy + r * 0.3, r * 0.2, 0, Math.PI * 2);
  gCtx.arc(cx + r * 0.5, cy + r * 0.3, r * 0.2, 0, Math.PI * 2);
  gCtx.fill();

  // Layer D: Eyes
  gCtx.fillStyle = "#1e293b";
  gCtx.beginPath();
  gCtx.ellipse(cx - r * 0.3, cy, r * 0.15, r * 0.2, 0, 0, Math.PI * 2);
  gCtx.ellipse(cx + r * 0.3, cy, r * 0.15, r * 0.2, 0, 0, Math.PI * 2);
  gCtx.fill();

  // 2. MAIN SCENE RENDERING
  pCtx.fillStyle = "#0c0a1f"; // Deep midnight purple-black
  pCtx.fillRect(0, 0, s, s);

  // Instead of a strict grid, we use more "seeds" with higher overlap checking
  const ghostCount = 12; // Total number of ghosts per tile
  for (let i = 0; i < ghostCount; i++) {
    const seed = i * 137.5; // Golden angle-ish spacing
    
    // Position using a deterministic scatter
    const bx = pr(seed) * s;
    const by = pr(seed + 1) * s;

    // Draw the ghost and its "wraps" to ensure seamless tiling
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        pCtx.save();
        pCtx.translate(bx + dx, by + dy);
        
        // Slightly different rotation and scale for every single ghost
        pCtx.rotate((pr(seed + 2) - 0.5) * 0.8);
        const scale = 0.6 + pr(seed + 3) * 0.6;
        pCtx.scale(scale, scale);
        
        // Alternate flip
        if (pr(seed + 4) > 0.5) pCtx.scale(-1, 1);

        pCtx.drawImage(ghostSprite, -spriteSize / 2, -spriteSize / 2, spriteSize, spriteSize);
        pCtx.restore();
      });
    });
  }

  // Add some tiny background "dust/embers"
  pCtx.fillStyle = "rgba(255, 255, 255, 0.1)";
  for (let k = 0; k < 20; k++) {
    pCtx.beginPath();
    pCtx.arc(pr(k) * s, pr(k + 1) * s, 1, 0, Math.PI * 2);
    pCtx.fill();
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureNeonCircuit(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // 1. SPRITE CACHE (Cross-hair circuit node)
  const dim = 50;
  const sCanvas = document.createElement("canvas");
  sCanvas.width = dim * dpr; sCanvas.height = dim * dpr;
  const sCtx = sCanvas.getContext("2d")!;
  sCtx.scale(dpr, dpr);

  const color = "#39ff14"; // Neon Green
  sCtx.strokeStyle = color;
  sCtx.lineWidth = 1;

  // Draw Glow
  sCtx.shadowBlur = 8;
  sCtx.shadowColor = color;
  
  // Node Center
  sCtx.strokeRect(dim/2 - 4, dim/2 - 4, 8, 8);
  // Connection Lines
  sCtx.beginPath();
  sCtx.moveTo(dim/2, 0); sCtx.lineTo(dim/2, dim/2 - 4);
  sCtx.moveTo(dim/2, dim/2 + 4); sCtx.lineTo(dim/2, dim);
  sCtx.moveTo(0, dim/2); sCtx.lineTo(dim/2 - 4, dim/2);
  sCtx.moveTo(dim/2 + 4, dim/2); sCtx.lineTo(dim, dim/2);
  sCtx.stroke();

  // 2. MAIN SYMMETRICAL GRID (3x3)
  pCtx.fillStyle = "#020402";
  pCtx.fillRect(0, 0, s, s);
  const cell = s / 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      pCtx.drawImage(sCanvas, (i + 0.5) * cell - dim / 2, (j + 0.5) * cell - dim / 2, dim, dim);
    }
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureNeonHex(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 1.5);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // 1. SPRITE CACHE (One Hexagon)
  const r = 20; // radius
  const h = r * Math.sqrt(3); // height offset
  const dim = 50;
  const sCanvas = document.createElement("canvas");
  sCanvas.width = dim * dpr; sCanvas.height = dim * dpr;
  const sCtx = sCanvas.getContext("2d")!;
  sCtx.scale(dpr, dpr);

  const color = "#00f3ff"; // Cyber Cyan
  sCtx.strokeStyle = color;
  sCtx.lineWidth = 1.5;
  sCtx.shadowBlur = 10;
  sCtx.shadowColor = color;

  sCtx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const x = dim/2 + r * Math.cos(angle);
    const y = dim/2 + r * Math.sin(angle);
    if (i === 0) sCtx.moveTo(x, y);
    else sCtx.lineTo(x, y);
  }
  sCtx.closePath();
  sCtx.stroke();

  // 2. TILING (Hexagonal Offset)
  pCtx.fillStyle = "#020408";
  pCtx.fillRect(0, 0, s, s);
  
  const colSpacing = r * 1.5;
  const rowSpacing = h;

  for (let i = -1; i < (s / colSpacing) + 1; i++) {
    for (let j = -1; j < (s / rowSpacing) + 1; j++) {
      const x = i * colSpacing;
      // Offset every other column for the honeycomb fit
      const y = j * rowSpacing + (i % 2 === 0 ? 0 : h / 2);
      pCtx.drawImage(sCanvas, x - dim/2, y - dim/2, dim, dim);
    }
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureNeonHUD(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 1.2);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  const color = "#ff00ff"; // Neon Magenta
  pCtx.fillStyle = "#050005";
  pCtx.fillRect(0, 0, s, s);

  const drawHUDRing = (cx: number, cy: number, r: number) => {
    [0, s, -s].forEach(dx => {
      [0, s, -s].forEach(dy => {
        pCtx.save();
        pCtx.translate(cx + dx, cy + dy);
        pCtx.strokeStyle = color;
        pCtx.shadowBlur = 12;
        pCtx.shadowColor = color;
        pCtx.lineWidth = 2;

        // Outer broken ring
        pCtx.beginPath();
        pCtx.setLineDash([r * 0.4, r * 0.2]);
        pCtx.arc(0, 0, r, 0, Math.PI * 2);
        pCtx.stroke();

        // Inner solid ring with thin stroke
        pCtx.setLineDash([]);
        pCtx.lineWidth = 0.5;
        pCtx.beginPath();
        pCtx.arc(0, 0, r * 0.6, 0, Math.PI * 2);
        pCtx.stroke();

        // Center dot
        pCtx.fillStyle = color;
        pCtx.beginPath();
        pCtx.arc(0, 0, 2, 0, Math.PI * 2);
        pCtx.fill();
        pCtx.restore();
      });
    });
  };

  drawHUDRing(s * 0.5, s * 0.5, s * 0.3);
  drawHUDRing(0, 0, s * 0.15); // Corners

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureNeonCircuit1(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  // Use a slightly smaller base size for denser circuitry
  const s = Math.round(size * 0.8);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  // 1. SPRITE CACHE (Cross-hair circuit node)
  // The dimension needs to match the grid cell size for perfect connection
  const dim = s / 4; 
  const sCanvas = document.createElement("canvas");
  sCanvas.width = dim * dpr; sCanvas.height = dim * dpr;
  const sCtx = sCanvas.getContext("2d")!;
  sCtx.scale(dpr, dpr);

  const color = "#39ff14"; // Neon Green
  sCtx.strokeStyle = color;
  sCtx.fillStyle = color;
  sCtx.lineWidth = 1.5;

  // Draw Glow
  sCtx.shadowBlur = 8;
  sCtx.shadowColor = color;
  
  const center = dim / 2;
  const padSize = dim * 0.2;

  // Node Center Pad (filled square)
  sCtx.fillRect(center - padSize/2, center - padSize/2, padSize, padSize);

  // Connection Lines leading to the edges
  sCtx.beginPath();
  sCtx.moveTo(center, 0); sCtx.lineTo(center, center - padSize/2); // Top
  sCtx.moveTo(center, dim); sCtx.lineTo(center, center + padSize/2); // Bottom
  sCtx.moveTo(0, center); sCtx.lineTo(center - padSize/2, center); // Left
  sCtx.moveTo(dim, center); sCtx.lineTo(center + padSize/2, center); // Right
  sCtx.stroke();

  // 2. TILING (Simple Grid)
  pCtx.fillStyle = "#010501"; // Very dark green-black bg
  pCtx.fillRect(0, 0, s, s);

  // Tile the nodes; lines will connect automatically
  for (let i = 0; i < s / dim; i++) {
    for (let j = 0; j < s / dim; j++) {
      pCtx.drawImage(sCanvas, i * dim, j * dim, dim, dim);
    }
  }
  
  // Add some faint connecting lines on the background layer for more complexity
  pCtx.strokeStyle = "rgba(57, 255, 20, 0.1)";
  pCtx.lineWidth = 1;
  pCtx.shadowBlur = 0; // No glow for background lines
  pCtx.beginPath();
  for(let i = 0; i <= s; i += dim) {
      pCtx.moveTo(i, 0); pCtx.lineTo(i, s);
      pCtx.moveTo(0, i); pCtx.lineTo(s, i);
  }
  pCtx.stroke();


  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureNeonTriangles(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 1.5);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  pCtx.fillStyle = "#080208"; // Dark purple-black bg
  pCtx.fillRect(0, 0, s, s);

  const color = "#ff00ff"; // Neon Magenta
  pCtx.strokeStyle = color;
  pCtx.lineWidth = 1.2;
  pCtx.shadowBlur = 8;
  pCtx.shadowColor = color;

  // Grid settings
  const triangleHeight = s / 5;
  // Calculate side length based on height for equilateral triangles
  const sideLength = triangleHeight / (Math.sqrt(3) / 2);

  pCtx.beginPath();

  // 1. Horizontal Lines
  for (let y = 0; y <= s; y += triangleHeight) {
    pCtx.moveTo(0, y);
    pCtx.lineTo(s, y);
  }

  // 2. Diagonal Lines (Forward slashes / )
  // We need to draw extra lines off-canvas to ensure coverage due to the angle
  for (let i = -s; i <= s * 2; i += sideLength) {
     // Slope relates to height vs half-side
     pCtx.moveTo(i, 0);
     pCtx.lineTo(i - s * (sideLength / triangleHeight / 2), s);
  }

  // 3. Diagonal Lines (Back slashes \ )
  for (let i = -s; i <= s * 2; i += sideLength) {
    pCtx.moveTo(i, 0);
    pCtx.lineTo(i + s * (sideLength / triangleHeight / 2), s);
 }

  pCtx.stroke();

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}

export function textureNeonGrid(ctx: CanvasRenderingContext2D, size: number) {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.round(size * 1.2);
  const pCanvas = document.createElement("canvas");
  pCanvas.width = s * dpr; pCanvas.height = s * dpr;
  const pCtx = pCanvas.getContext("2d")!;
  pCtx.scale(dpr, dpr);

  pCtx.fillStyle = "#020208"; // Deep blue-black bg
  pCtx.fillRect(0, 0, s, s);

  const colorBase = "#00aaff"; // Neon Blue
  const colorHot = "#ffffff"; // White hot center
  
  const gridSize = s / 6;

  // 1. Draw Base Grid Lines (Standard Glow)
  pCtx.strokeStyle = colorBase;
  pCtx.lineWidth = 1;
  pCtx.shadowBlur = 6;
  pCtx.shadowColor = colorBase;
  
  pCtx.beginPath();
  for (let i = 0; i <= s; i += gridSize) {
      // Vertical
      pCtx.moveTo(i, 0); pCtx.lineTo(i, s);
      // Horizontal
      pCtx.moveTo(0, i); pCtx.lineTo(s, i);
  }
  pCtx.stroke();

  // 2. Draw Intersection Nodes (Intense Glow)
  // We draw glowing squares at the intersections for a "digital city" look
  pCtx.fillStyle = colorHot;
  pCtx.shadowBlur = 12; // stronger glow
  pCtx.shadowColor = colorBase;

  const nodeSize = 3;
  for (let i = 0; i <= s; i += gridSize) {
    for (let j = 0; j <= s; j += gridSize) {
        // Draw square centered on intersection
        pCtx.fillRect(i - nodeSize/2, j - nodeSize/2, nodeSize, nodeSize);
    }
  }

  const pattern = ctx.createPattern(pCanvas, "repeat")!;
  pattern.setTransform(new DOMMatrix().scale(1 / dpr, 1 / dpr));
  return pattern;
}