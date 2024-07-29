import { createScene } from './scene.js';
import { createCity } from './city.js';
import buildingFactory from './buildings.js';

//import { toolId } from '../App.js';

/**
 * Creates a new Game object
 * @returns a Game object
 */

let activeToolId = 'residential';

const setActiveToolId = (toolId) => {
    activeToolId = toolId;
    //console.log(toolId);
    alert(toolId);
}

export function createGame() {

  const scene = createScene();
  const city = createCity(16);

  scene.initialize(city);

  scene.onObjectSelected = (selectedObject) => {
    let { x, y, z } = selectedObject.userData;
    
    const tile = city.data[x][y][z];

    console.log(tile)
    /*
    //if (x >= 0 && x < city.size && y > 0 && y < city.size && z >= 0 && z < city.size) {
    
      if (activeToolId === 'bulldoze') {
        tile.building = undefined;
        scene.update(city);
      } else if (!tile.building) {
        tile.building = buildingFactory[activeToolId]();
        scene.update(city);
      }
    //}
    */
  }

  // Hook up mouse event handlers to the scene
  document.addEventListener('mousedown', scene.onMouseDown.bind(scene), false);
  document.addEventListener('mousemove', scene.onMouseMove.bind(scene), false);
  document.addEventListener('contextmenu', (event) => event.preventDefault(), false);

  const game = {
    update() {
      // Update the city data model first, then update the scene
      city.update();
      scene.update(city);
    }
  }

  /*
  // Start update interval
  setInterval(() => {
    game.update();
  }, 1000)
  */

  scene.start();

  return game;
}

export { activeToolId, setActiveToolId };