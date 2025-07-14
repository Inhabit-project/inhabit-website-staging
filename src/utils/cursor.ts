const LEAFS = [
  '/assets/icons/leaf1.svg',
  '/assets/icons/leaf2.svg',
  '/assets/icons/leaf3.svg',
  '/assets/icons/leaf4.svg',
  '/assets/icons/leaf5.svg',
  '/assets/icons/leaf6.svg',
];

function isTouchDevice() {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0
  );
}

class Cursor {
  cursor: HTMLDivElement | null = null;
  particles: Set<HTMLDivElement>;
  lastTime: number;
  videoSections: HTMLElement[];
  handleMouseMove!: (e: MouseEvent) => void;
  handleMouseLeave!: () => void;
  handleSectionEnter!: (e: MouseEvent) => void;
  handleSectionLeave!: (e: MouseEvent) => void;

  constructor() {
    if (isTouchDevice()) {
      this.cursor = null;
      this.particles = new Set();
      this.lastTime = Date.now();
      this.videoSections = [];
      return;
    }
    this.cursor = this.createCursor();
    this.particles = new Set();
    this.lastTime = Date.now();
    this.videoSections = Array.from(document.querySelectorAll('.custom-cursor-hide'));

    this.handleMouseMove = this._handleMouseMove.bind(this);
    this.handleMouseLeave = this._handleMouseLeave.bind(this);
    this.handleSectionEnter = this._handleSectionEnter.bind(this);
    this.handleSectionLeave = this._handleSectionLeave.bind(this);

    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseleave', this.handleMouseLeave);
    this.videoSections.forEach(section => {
      section.addEventListener('mouseenter', this.handleSectionEnter);
      section.addEventListener('mouseleave', this.handleSectionLeave);
    });
  }

  createCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    const img = document.createElement('img');
    img.src = LEAFS[0];
    img.alt = 'leaf-cursor';
    img.style.width = '100%';
    img.style.height = '100%';
    cursor.appendChild(img);
    document.body.appendChild(cursor);
    return cursor;
  }

  createParticle(x: number, y: number) {
    if (!this.cursor) return;
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.transform = 'translate(-50%, -50%)';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    const img = document.createElement('img');
    const randomLeaf = LEAFS[Math.floor(Math.random() * LEAFS.length)];
    img.src = randomLeaf;
    img.alt = 'leaf';
    particle.appendChild(img);
    document.body.appendChild(particle);

    particle.addEventListener('animationend', () => {
      particle.remove();
      this.particles.delete(particle);
    });

    this.particles.add(particle);
  }

  _handleMouseMove(e: MouseEvent) {
    if (!this.cursor) return;
    const now = Date.now();
    requestAnimationFrame(() => {
      this.cursor!.style.display = 'block';
      this.cursor!.style.transform = 'translate(-50%, -50%)';
      this.cursor!.style.left = `${e.clientX}px`;
      this.cursor!.style.top = `${e.clientY}px`;
    });
    if (now - this.lastTime > 50) {
      this.createParticle(e.clientX, e.clientY);
      this.lastTime = now;
    }
  }

  _handleMouseLeave() {
    if (!this.cursor) return;
    this.cursor.style.display = 'none';
  }

  _handleSectionEnter() {
    if (!this.cursor) return;
    this.cursor.style.display = 'none';
  }

  _handleSectionLeave() {
    if (!this.cursor) return;
    this.cursor.style.display = 'block';
  }

  destroy() {
    if (!this.cursor) return;
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseleave', this.handleMouseLeave);
    this.videoSections.forEach(section => {
      section.removeEventListener('mouseenter', this.handleSectionEnter);
      section.removeEventListener('mouseleave', this.handleSectionLeave);
    });
    this.cursor?.remove();
    this.particles?.forEach(p => p.remove());
    this.particles.clear();
  }
}

export default Cursor; 