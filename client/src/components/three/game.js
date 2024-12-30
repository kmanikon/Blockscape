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


  // Hook up mouse event handlers to the scene
  document.addEventListener('mousedown', scene.onMouseDown.bind(scene), false);
  document.addEventListener('mousemove', scene.onMouseMove.bind(scene), false);
  document.addEventListener('wheel', scene.onMouseWheel.bind(scene), false);
  document.addEventListener('contextmenu', (event) => event.preventDefault(), false);

  

  
  const handleMouseDown = (event) => scene.onMouseDown(event);
  const handleMouseMove = (event) => scene.onMouseMove(event);
  //const handleMouseWheel = (event) => scene.onMouseWheel(event);
  
  // Hook up touch event handlers for mobile
  document.addEventListener('touchstart', (event) => {
    event.preventDefault(); // Prevent touch event from triggering mouse events
    handleMouseDown(event);
  }, { passive: false });
  
  document.addEventListener('touchmove', (event) => {
    event.preventDefault(); // Prevent default scroll behavior
    handleMouseMove(event);
  }, { passive: false });
  
  /*
  document.addEventListener('touchend', (event) => {
    // You can implement touch-end behavior here, similar to mouseup if necessary
    handleMouseWheel(event);
  }, { passive: false });
  */
  

  const game = {
    clearHighlights() {
      scene.clearHighlights();
    }
  }

  scene.start();

  return game;
}

export { activeToolData, setActiveToolData };