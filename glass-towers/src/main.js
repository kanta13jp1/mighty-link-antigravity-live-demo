import { GameManager } from './game/GameManager.js';
import { soundManager } from './game/SoundManager.js';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('canvas-container');

  // UI Element Refs
  const scoreHeightEl = document.getElementById('score-height');
  const scoreCountEl = document.getElementById('score-count');
  const scoreBestEl = document.getElementById('score-best');

  const nextIconEl = document.getElementById('next-shape-icon');
  const nextNameEl = document.getElementById('next-shape-name');
  const nextMassEl = document.getElementById('next-shape-mass');

  const overlayStart = document.getElementById('overlay-start');
  const overlayGameOver = document.getElementById('overlay-gameover');

  const finalHeightEl = document.getElementById('final-height');
  const finalCountEl = document.getElementById('final-count');
  const finalBestEl = document.getElementById('final-best');

  const btnStart = document.getElementById('btn-start');
  const btnPlayAgain = document.getElementById('btn-play-again');
  const btnRestart = document.getElementById('btn-restart');
  const btnSound = document.getElementById('btn-sound');
  const soundIcon = document.getElementById('sound-icon');

  // UI Callbacks
  const uiCallbacks = {
    onScoreUpdate: ({ height, count, best }) => {
      scoreHeightEl.textContent = height.toFixed(1);
      scoreCountEl.textContent = count.toString();
      scoreBestEl.textContent = best.toFixed(1);
    },
    onNextPieceChange: (template) => {
      nextIconEl.textContent = template.icon;
      nextNameEl.textContent = template.name;
      nextMassEl.textContent = `Mass: ${template.mass.toFixed(1)}kg (${template.colorName})`;
    },
    onGameOver: ({ height, count, best }) => {
      finalHeightEl.textContent = `${height.toFixed(1)}m`;
      finalCountEl.textContent = count.toString();
      finalBestEl.textContent = `${best.toFixed(1)}m`;
      overlayGameOver.classList.remove('hidden');
    }
  };

  // Initialize Game Manager
  const game = new GameManager(container, uiCallbacks);

  // Button Listeners
  btnStart.addEventListener('click', () => {
    soundManager.init();
    overlayStart.classList.add('hidden');
    game.startGame();
  });

  btnPlayAgain.addEventListener('click', () => {
    overlayGameOver.classList.add('hidden');
    game.restartGame();
  });

  btnRestart.addEventListener('click', () => {
    overlayStart.classList.add('hidden');
    overlayGameOver.classList.add('hidden');
    game.restartGame();
  });

  btnSound.addEventListener('click', () => {
    const isMuted = soundManager.toggleMute();
    soundIcon.textContent = isMuted ? '🔇' : '🔊';
  });
});
