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
/*
  // Replace with:
document.addEventListener('touchstart', (event) => {
  event.preventDefault(); // Prevent default behavior (e.g., scrolling)
  scene.onMouseDown({ 
    clientX: event.touches[0].clientX, 
    clientY: event.touches[0].clientY 
  }); 
}, false);
*/

document.addEventListener('mousemove', scene.onMouseMove.bind(scene), false);
/*
// Replace with:
document.addEventListener('touchmove', (event) => {
  event.preventDefault();
  scene.onMouseMove({ 
    clientX: event.touches[0].clientX, 
    clientY: event.touches[0].clientY 
  }); 
}, false);
*/

document.addEventListener('touchstart', (event) => {
  if (event.touches.length === 2) { 
    // Calculate initial distance between two touch points
    const dx = event.touches[0].clientX - event.touches[1].clientX;
    const dy = event.touches[0].clientY - event.touches[1].clientY;
    touchStartDistance = Math.sqrt(dx * dx + dy * dy);
  }
});

document.addEventListener('touchmove', (event) => {
  if (event.touches.length === 2) {
    const dx = event.touches[0].clientX - event.touches[1].clientX;
    const dy = event.touches[0].clientY - event.touches[1].clientY;
    const currentDistance = Math.sqrt(dx * dx + dy * dy);

    if (currentDistance > touchStartDistance) { 
      // Zooming in
      scene.camera.zoom *= 1.1; 
    } else {
      // Zooming out
      scene.camera.zoom *= 0.9; 
    }
    scene.camera.updateProjectionMatrix(); 

    touchStartDistance = currentDistance; // Update for next touchmove
  }
});

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