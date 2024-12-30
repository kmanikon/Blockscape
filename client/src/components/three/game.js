import { createScene } from './scene.js';
import { createCity } from './city.js';

/**
 * Creates a new Game object
 * @returns a Game object
 */

let activeToolData = { id: '', color: 0x000000 };

const setActiveToolData = (toolData) => {
    activeToolData = { id: toolData.id, color: toolData.color };
}

export function createGame(mode, initialTerrain, setSelectedTerrain) {

  const scene = createScene(mode, setSelectedTerrain);
  const city = createCity(16);

  scene.initialize(city, initialTerrain,);

  let touchStartDistance = 0;

  document.addEventListener('mousedown', scene.onMouseDown.bind(scene), false);
// Replace with:
document.addEventListener('touchstart', (event) => {
  event.preventDefault(); // Prevent default behavior (e.g., scrolling)
  scene.onMouseDown({ 
    clientX: event.touches[0].clientX, 
    clientY: event.touches[0].clientY 
  }); 
}, false);

document.addEventListener('mousemove', scene.onMouseMove.bind(scene), false);
// Replace with:
document.addEventListener('touchmove', (event) => {
  event.preventDefault();
  scene.onMouseMove({ 
    clientX: event.touches[0].clientX, 
    clientY: event.touches[0].clientY 
  }); 
}, false);

document.addEventListener('wheel', scene.onMouseWheel.bind(scene), false);

  const game = {
    clearHighlights() {
      scene.clearHighlights();
    }
  }

  scene.start();

  return game;
}

export { activeToolData, setActiveToolData };