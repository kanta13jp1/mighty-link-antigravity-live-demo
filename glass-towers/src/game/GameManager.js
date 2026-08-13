import { SceneManager } from './SceneManager.js';
import { PhysicsManager } from './PhysicsManager.js';
import { InputHandler } from './InputHandler.js';
import { getRandomShapeTemplate, buildShapeInstance } from './GlassShapes.js';
import { soundManager } from './SoundManager.js';

export const GAME_STATE = {
  IDLE: 'IDLE',
  READY: 'READY',
  DROPPING: 'DROPPING',
  SETTLING: 'SETTLING',
  GAME_OVER: 'GAME_OVER'
};

export class GameManager {
  constructor(containerElement, uiCallbacks) {
    this.ui = uiCallbacks || {};
    this.state = GAME_STATE.IDLE;

    // Managers
    this.sceneMgr = new SceneManager(containerElement);
    this.physicsMgr = new PhysicsManager();

    // Add Pedestal Physics Body
    this.pedestalBody = this.physicsMgr.addPedestalBody(
      { x: 0, y: -0.5, z: 0 },
      { x: 1.6, y: 0.5, z: 1.6 }
    );

    // Active & Stacked Pieces
    this.activePiece = null;
    this.nextTemplate = getRandomShapeTemplate();
    this.stackedPieces = [];

    // Stats
    this.towerHeight = 0.0;
    this.pieceCount = 0;
    this.bestHeight = parseFloat(localStorage.getItem('glass_towers_best') || '0.0');

    // Input Handler
    this.inputHandler = new InputHandler(
      this.sceneMgr.renderer.domElement,
      () => this.dropActivePiece(),
      () => this.restartGame()
    );

    // Start Game Loop
    this.lastTime = performance.now();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);

    // Notify UI of initial best score
    if (this.ui.onScoreUpdate) {
      this.ui.onScoreUpdate({ height: 0, count: 0, best: this.bestHeight });
    }
  }

  startGame() {
    this.reset();
    this.state = GAME_STATE.READY;
    this.spawnNextPiece();
  }

  spawnNextPiece() {
    if (this.state === GAME_STATE.GAME_OVER) return;

    const template = this.nextTemplate;
    this.nextTemplate = getRandomShapeTemplate();

    if (this.ui.onNextPieceChange) {
      this.ui.onNextPieceChange(this.nextTemplate);
    }

    const instance = buildShapeInstance(template);

    // Spawn height above current tower peak
    const spawnY = Math.max(this.towerHeight + 3.2, 4.2);
    instance.mesh.position.set(0, spawnY, 0);

    // Dynamic physics setup: kinematics while player moves piece
    instance.body.type = 2; // Dynamic
    instance.body.position.set(0, spawnY, 0);
    instance.body.sleep(); // Sleeping until drop

    this.sceneMgr.scene.add(instance.mesh);
    this.activePiece = instance;
    this.state = GAME_STATE.READY;
    this.inputHandler.enabled = true;
  }

  dropActivePiece() {
    if (this.state !== GAME_STATE.READY || !this.activePiece) return;

    soundManager.playDrop();

    this.state = GAME_STATE.DROPPING;
    this.inputHandler.enabled = false;

    // Wake up physics body & add to physics world
    this.activePiece.body.wakeUp();
    this.physicsMgr.addGlassBody(this.activePiece.body);

    this.stackedPieces.push(this.activePiece);
    this.activePiece = null;

    // Settle timer
    this.settleTimeout = setTimeout(() => {
      this.evaluateTowerState();
    }, 2200);
  }

  evaluateTowerState() {
    if (this.state === GAME_STATE.GAME_OVER) return;

    // Check if any piece fell off pedestal (y < -1.8)
    let fallen = false;
    let maxTopY = 0.0;

    this.stackedPieces.forEach((p) => {
      const pos = p.body.position;
      if (pos.y < -1.8) {
        fallen = true;
      } else {
        const pieceTopY = pos.y + (p.height / 2);
        if (pieceTopY > maxTopY) {
          maxTopY = pieceTopY;
        }
      }
    });

    if (fallen) {
      this.triggerGameOver();
    } else {
      this.towerHeight = Math.max(parseFloat(maxTopY.toFixed(1)), 0);
      this.pieceCount = this.stackedPieces.length;

      if (this.towerHeight > this.bestHeight) {
        this.bestHeight = this.towerHeight;
        localStorage.setItem('glass_towers_best', this.bestHeight.toString());
      }

      if (this.ui.onScoreUpdate) {
        this.ui.onScoreUpdate({
          height: this.towerHeight,
          count: this.pieceCount,
          best: this.bestHeight
        });
      }

      this.sceneMgr.updateCameraTarget(this.towerHeight);
      this.spawnNextPiece();
    }
  }

  triggerGameOver() {
    this.state = GAME_STATE.GAME_OVER;
    this.inputHandler.enabled = false;

    soundManager.playGameOver();

    if (this.ui.onGameOver) {
      this.ui.onGameOver({
        height: this.towerHeight,
        count: this.pieceCount,
        best: this.bestHeight
      });
    }
  }

  restartGame() {
    clearTimeout(this.settleTimeout);
    this.reset();
    this.startGame();
  }

  reset() {
    // Remove active piece mesh
    if (this.activePiece) {
      this.sceneMgr.scene.remove(this.activePiece.mesh);
      this.activePiece = null;
    }

    // Remove stacked piece meshes & physics bodies
    this.stackedPieces.forEach((p) => {
      this.sceneMgr.scene.remove(p.mesh);
      this.physicsMgr.removeBody(p.body);
    });

    this.stackedPieces = [];
    this.physicsMgr.reset();

    this.towerHeight = 0.0;
    this.pieceCount = 0;

    this.inputHandler.reset();
    this.sceneMgr.updateCameraTarget(0);

    if (this.ui.onScoreUpdate) {
      this.ui.onScoreUpdate({
        height: 0.0,
        count: 0,
        best: this.bestHeight
      });
    }
  }

  animate(time) {
    requestAnimationFrame(this.animate);

    const deltaTime = Math.min((time - this.lastTime) / 1000, 0.1);
    this.lastTime = time;

    // Active Piece Position Lerp while in READY state
    if (this.state === GAME_STATE.READY && this.activePiece) {
      const targetX = this.inputHandler.targetX;
      const currentX = this.activePiece.mesh.position.x;
      const lerpedX = currentX + (targetX - currentX) * 0.2;

      const spawnY = Math.max(this.towerHeight + 3.2, 4.2);
      this.activePiece.mesh.position.set(lerpedX, spawnY, 0);
      this.activePiece.body.position.set(lerpedX, spawnY, 0);
    }

    // Physics Step
    if (this.state === GAME_STATE.DROPPING || this.state === GAME_STATE.SETTLING || this.state === GAME_STATE.GAME_OVER) {
      this.physicsMgr.update(deltaTime);

      // Sync Three.js Meshes to Cannon.js Bodies
      this.stackedPieces.forEach((p) => {
        p.mesh.position.copy(p.body.position);
        p.mesh.quaternion.copy(p.body.quaternion);

        // Continuous falling check during drop
        if (p.body.position.y < -2.5 && this.state !== GAME_STATE.GAME_OVER) {
          this.triggerGameOver();
        }
      });
    }

    // Render Scene
    this.sceneMgr.render();
  }
}
