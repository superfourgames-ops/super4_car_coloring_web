export function initDoodleBackground(): void {
  const doodleContainer = document.getElementById('bg-doodles');
  if (!doodleContainer) return;

  doodleContainer.innerHTML = '';

  const patterns = [
    './assets/bg/pattern1.png',
    './assets/bg/pattern2.png',
    './assets/bg/pattern3.png',
    './assets/bg/pattern4.png',
    './assets/bg/pattern5.png',
  ];

  // Divide screen into a grid (8 columns x 5 rows) for smaller, dense doodle coverage
  const cols = 11;
  const rows = 8;

  const fragment = document.createDocumentFragment();

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const img = document.createElement('img');
      const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
      img.src = randomPattern;
      img.className = 'doodle';
      img.alt = 'bg-doodle';

      // Cell position percentage with random jitter
      const cellWidth = 100 / cols;
      const cellHeight = 100 / rows;

      const left = (c * cellWidth) + (Math.random() * 0.7 + 0.15) * cellWidth;
      const top = (r * cellHeight) + (Math.random() * 0.7 + 0.15) * cellHeight;

      const rotation = Math.floor(Math.random() * 360);
      const scale = (Math.random() * 0.5 + 0.5).toFixed(2);
      const opacity = (Math.random() * 0.35 + 0.5).toFixed(2);

      img.style.left = `${left.toFixed(2)}%`;
      img.style.top = `${top.toFixed(2)}%`;
      img.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`;
      img.style.opacity = opacity;

      fragment.appendChild(img);
    }
  }

  doodleContainer.appendChild(fragment);
}
