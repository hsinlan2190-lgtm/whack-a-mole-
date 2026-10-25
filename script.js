
* {
  box-sizing: border-box;
}

:root {
  --grass: #b9e99a;
  --grass-dark: #79bf59;
  --brown: #8c5939;
  --cream: #fff8df;
  --green: #397e43;
}

body {
  margin: 0;
  min-height: 100vh;
  padding: 20px 12px 40px;
  font-family: "Trebuchet MS", "Noto Sans TC", sans-serif;
  color: #3f5734;
  background:
    radial-gradient(ellipse at 15% 10%, #f5ffcf 0, transparent 30%),
    linear-gradient(180deg, #d9f6bb, #8fd27d);
}

button {
  font: inherit;
}

.game {
  width: min(100%, 760px);
  margin: 0 auto;
}

.game-header {
  text-align: center;
  margin-bottom: 20px;
}

.eyebrow {
  margin: 0;
  color: #4e9149;
  font-weight: 800;
  font-size: 12px;
  letter-spacing: 4px;
}

h1 {
  margin: 7px 0;
  font-size: clamp(28px, 6vw, 42px);
  color: #356f3b;
  text-shadow: 0 3px 0 #ffffffb0;
}

.subtitle {
  margin: 0;
  color: #567b47;
}

.scoreboard {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 16px;
}

.stat {
  padding: 12px 4px;
  text-align: center;
  border: 2px solid #ffffffb8;
  border-radius: 17px;
  background: #fffbe8e8;
  box-shadow: 0 4px 0 #75b86d;
}

.stat span {
  display: block;
  font-size: 12px;
  color: #67845b;
}

.stat strong {
  display: block;
  margin-top: 4px;
  font-size: clamp(18px, 4vw, 25px);
  color: #397d43;
  font-variant-numeric: tabular-nums;
}

.garden {
  position: relative;
  overflow: hidden;
  padding: 25px 12px 35px;
  border: 4px solid #fff5c9;
  border-radius: 28px;
  background:
    radial-gradient(ellipse at 50% 100%, #74b94f 0, #a8df7e 58%, #c8ed9b 100%);
  box-shadow: 0 9px 0 #6da951, 0 14px 25px #477e3540;
}

.holes {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(12px, 3.5vw, 26px) 12px;
  max-width: 590px;
  margin: 22px auto 0;
}

.hole {
  position: relative;
  min-width: 0;
  aspect-ratio: 1 / 0.94;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: crosshair;
  -webkit-tap-highlight-color: transparent;
}

.hole:focus-visible {
  outline: 3px solid white;
  outline-offset: 3px;
  border-radius: 18px;
}

.hole-dirt {
  position: absolute;
  z-index: 2;
  left: 4%;
  right: 4%;
  bottom: 3%;
  height: 35%;
  border: 3px solid #87532e;
  border-radius: 50%;
  background:
    radial-gradient(ellipse at 35% 25%, #b87b45 0 8%, transparent 9%),
    linear-gradient(#754529, #4c3025);
  box-shadow: inset 0 5px 0 #c18a4e, 0 5px 0 #6b9b44;
}

.mole-window {
  position: absolute;
  z-index: 1;
  left: 3%;
  right: 3%;
  bottom: 12%;
  height: 78%;
  overflow: hidden;
  pointer-events: none;
}

.mole {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center bottom;
  transform: translate(-50%, 105%);
  opacity: 0;
  user-select: none;
  -webkit-user-drag: none;
}

.hole.up .mole {
  transform: translate(-50%, 0);
  opacity: 1;
}

.hole.hit .mole {
  opacity: 1;
  transform: translate(-50%, 0);
}

.hole.hit .hole-dirt {
  filter: brightness(1.13);
}

.garden-decoration {
  position: absolute;
  opacity: 0.85;
  pointer-events: none;
}

.flower-one {
  top: 15px;
  left: 15px;
  font-size: 28px;
}

.flower-two {
  top: 52px;
  right: 18px;
  font-size: 24px;
}

.butterfly {
  top: 18px;
  right: 23%;
  font-size: 23px;
}

.message {
  position: relative;
  z-index: 3;
  min-height: 28px;
  margin: 23px 0 0;
  text-align: center;
  font-size: 16px;
  font-weight: 800;
  color: #386d37;
}

.controls {
  text-align: center;
  padding-top: 24px;
}

.start-button {
  min-width: 190px;
  padding: 14px 28px;
  border: 3px solid #fff8d8;
  border-radius: 999px;
  color: white;
  background: linear-gradient(#ffb84c, #f28a31);
  box-shadow: 0 6px 0 #c66b28;
  font-size: 18px;
  font-weight: 900;
  cursor: pointer;
  transition: transform 0.12s, box-shadow 0.12s;
}

.start-button:hover {
  filter: brightness(1.05);
}

.start-button:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 #c66b28;
}

.start-button:disabled {
  cursor: default;
  opacity: 0.8;
}

.instructions {
  color: #4f7c43;
  font-size: 13px;
}

/* 木槌 Sprite Sheet：預期為 6 格、1152 × 192 px */
.hammer {
  position: fixed;
  z-index: 20;
  left: -300px;
  top: -300px;
  width: 192px;
  height: 192px;
  background-image: url("assets/sprites/hammer/hammer_basic.png");
  background-repeat: no-repeat;
  background-size: 600% 100%;
  background-position: 0 0;
  pointer-events: none;
  opacity: 0;
  transform-origin: 50% 78%;
}

.hammer.show {
  opacity: 1;
}

.hammer.swing {
  animation: hammer-swing 0.36s steps(1, end) forwards;
}

@keyframes hammer-swing {
  0%   { background-position: 0 0; transform: rotate(-12deg) scale(1); }
  20%  { background-position: 20% 0; transform: rotate(8deg) scale(1.02); }
  40%  { background-position: 40% 0; transform: rotate(24deg) scale(0.96); }
  60%  { background-position: 60% 0; transform: rotate(20deg) scale(0.98); }
  80%  { background-position: 80% 0; transform: rotate(-4deg) scale(1.02); }
  100% { background-position: 100% 0; transform: rotate(-12deg) scale(1); }
}

@media (max-width: 480px) {
  body {
    padding: 14px 9px 28px;
  }

  .stat {
    border-radius: 13px;
    padding: 10px 2px;
  }

  .stat span {
    font-size: 11px;
  }

  .garden {
    padding: 18px 7px 25px;
    border-radius: 22px;
  }

  .holes {
    gap: 12px 5px;
  }

  .hole-dirt {
    border-width: 2px;
  }

  .mole-window {
    left: 0;
    right: 0;
  }

  .hammer {
    width: 120px;
    height: 120px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
