export class InputHandler {
  constructor(canvasElement, onDropCallback, onRestartCallback) {
    this.canvas = canvasElement;
    this.onDrop = onDropCallback;
    this.onRestart = onRestartCallback;

    this.targetX = 0;
    this.isDragging = false;
    this.enabled = true;

    // Movement Bounds
    this.minX = -3.5;
    this.maxX = 3.5;

    this.setupMouseEvents();
    this.setupTouchEvents();
    this.setupKeyboardEvents();
  }

  setupMouseEvents() {
    window.addEventListener('mousemove', (e) => {
      if (!this.enabled) return;
      // Map screen X [-1, 1] to world X [-3.5, 3.5]
      const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      this.targetX = Math.max(Math.min(normalizedX * 4.5, this.maxX), this.minX);
    });

    window.addEventListener('pointerdown', (e) => {
      // Ignore click if clicking on UI buttons
      if (e.target.closest('button') || e.target.closest('.overlay')) return;
      if (!this.enabled) return;
      if (this.onDrop) this.onDrop();
    });
  }

  setupTouchEvents() {
    window.addEventListener('touchmove', (e) => {
      if (!this.enabled || !e.touches.length) return;
      const touch = e.touches[0];
      const normalizedX = (touch.clientX / window.innerWidth) * 2 - 1;
      this.targetX = Math.max(Math.min(normalizedX * 4.5, this.maxX), this.minX);
    }, { passive: true });
  }

  setupKeyboardEvents() {
    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyR') {
        if (this.onRestart) this.onRestart();
        return;
      }

      if (!this.enabled) return;

      const step = 0.25;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        this.targetX = Math.max(this.targetX - step, this.minX);
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        this.targetX = Math.min(this.targetX + step, this.maxX);
      } else if (e.code === 'Space' || e.code === 'Enter' || e.code === 'ArrowDown') {
        e.preventDefault();
        if (this.onDrop) this.onDrop();
      }
    });
  }

  reset() {
    this.targetX = 0;
  }
}
