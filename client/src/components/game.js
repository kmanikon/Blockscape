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

export function createGame(mode) {

  const scene = createScene(mode);
  const city = createCity(16);

  scene.initialize(city);


  // Hook up mouse event handlers to the scene
  document.addEventListener('mousedown', scene.onMouseDown.bind(scene), false);
  document.addEventListener('mousemove', scene.onMouseMove.bind(scene), false);
  document.addEventListener('contextmenu', (event) => event.preventDefault(), false);


  const game = {
    clearHighlights() {
      scene.clearHighlights();
    }
  }

  scene.start();

  return game;
}

export { activeToolData, setActiveToolData };