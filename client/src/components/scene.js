import * as THREE from 'three';
import { createCamera } from './camera.js';
import { createAssetInstance } from './assets.js';

import { activeToolId } from './game.js';


const ymax = 2;

export function createScene() {
  // Initial scene setup
  const gameWindow = document.getElementById('render-target');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x777777);

  const camera = createCamera(gameWindow);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(gameWindow.offsetWidth, gameWindow.offsetHeight);
  gameWindow.appendChild(renderer.domElement);
  
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let selectedObject = undefined;

  let terrain = [];
  let buildings = [];

  let onObjectSelected = undefined;

  function initialize(city) {
    scene.clear();
    terrain = [];
    buildings = [];



    // setup terrain array
    for (let x = 0; x < city.size; x++) {
      const column = [];
      for (let y = 0; y < city.size; y++) {
        const row = [];
        for (let z = 0; z < city.size; z++){
          row.push(undefined);
        }
        column.push(row);
      }
      terrain.push(column);
    };



    // add ground squares
    for (let x = 0; x < city.size; x++) {
      //const column = [];
      for (let y = 0; y < city.size; y++) {
        //const row = [];
        //for (let z = 0; z < city.size; z++){
          const terrainId = 'grass';//city.data[x][y][0].terrainId;
          const mesh = createAssetInstance(terrainId, x, 0, y);
          scene.add(mesh);
          //row.push(mesh);
        //}

        
        /*
        for (let z = 1; z < ymax; z++){
          const terrainId = 'sky';//city.data[x][y][0].terrainId;
          const mesh = createAssetInstance(terrainId, x, z, y);
          scene.add(mesh);
          row.push(mesh);
        }
        */
       terrain[x][0][y] = mesh;
        


        //column.push(row);
      }
      //terrain.push(column);
      //buildings.push([...Array(city.size)]);
    }

   
    
    //console.log(buildings);

    /*
    let newBuilding = [];
    for (let i = 0; i < city.size; i++) {
        let floor = [];
        for (let j = 0; j < city.size; j++) {
            let row = [];
            for (let k = 0; k < city.size; k++) {
                row.push(undefined);
            }
            floor.push(row);
        }
        newBuilding.push(floor);
    }
    buildings.push(newBuilding);
    */

    setupLights();
  }

  function isPlaceable(x, y, z) {
      // Check if the current position is not 'sky'
      if (terrain[x][y][z].userData.id !== 'sky') {
          return true;
      }

      // Check the neighboring positions
      // Check left neighbor
      if (x > 0 && terrain[x - 1][y][z].userData.id !== 'sky') {
          return true;
      }
      // Check right neighbor
      if (x < terrain.length - 1 && terrain[x + 1][y][z].userData.id !== 'sky') {
          return true;
      }
      // Check down neighbor
      if (y > 0 && terrain[x][y - 1][z].userData.id !== 'sky') {
          return true;
      }
      // Check up neighbor
      if (y < terrain[0].length - 1 && terrain[x][y + 1][z].userData.id !== 'sky') {
          return true;
      }
      // Check back neighbor
      if (z > 0 && terrain[x][y][z - 1].userData.id !== 'sky') {
          return true;
      }
      // Check front neighbor
      if (z < terrain[0][0].length - 1 && terrain[x][y][z + 1].userData.id !== 'sky') {
          return true;
      }

      // If no neighboring position is suitable, return false
      return false;
  }


  function placeSkyBlocksAbove(x, y, z, size) {
    // Assuming 'createAssetInstance' and 'scene.add' are defined

    // Iterate over the given x, y, z position
    // Check each spot directly above by incrementing y coordinate

    const xmin = Math.max(x - 1, 0);
    const xmax = Math.min(x + 1, size);

    const ymin = Math.max(y - 1, 0);
    const ymax = Math.min(y + 1, size);

    const zAbove = Math.min(z, size);

    if (z == size) {
      return;
    }

    for (let xAbove = xmin; xAbove <= xmax; xAbove++) {
        for (let yAbove = ymin; yAbove <= ymax; yAbove++) {
            const terrainId = 'sky'; // or city.data[x][yAbove][z].terrainId if dynamic
            const mesh = createAssetInstance(terrainId, xAbove, yAbove, zAbove);
            scene.add(mesh);
      }
    }
  }    


  function boundVal (val, min, max) {
    if (val < min){
      return min;
    }
    if (val > max){
      return max;
    }
    return val;
  }

  function update(city) {
    //console.log(city);

    const x = boundVal(selectedObject.userData.x, 0, city.size);
    const y = boundVal(selectedObject.userData.y + 1, 0, city.size);
    const z = boundVal(selectedObject.userData.z, 0, city.size);

    const previousBlock = terrain[x][z][y];


    
    /*
    if (activeToolId === 'bulldoze'){
      if (terrain[x][z][y].userData.id !== 'grass'){
        scene.remove(previousBlock);
        const skyMesh = createAssetInstance('sky', x, y, z);
        terrain[x][z][y] = skyMesh;
        scene.add(skyMesh);   
      }
    }

    else if (isPlaceable(x, z, y)){
      const newBlock = createAssetInstance(activeToolId, x, y, z, undefined);
      //const previousBlock = terrain[x][y][z];
      scene.remove(previousBlock);
      scene.add(newBlock);
      terrain[x][z][y] = newBlock;

      //placeSkyBlocksAbove(x, z, y, city.size);
       
      
    }
    */

    const newBlock = createAssetInstance(activeToolId, x, y, z, undefined);
    //const previousBlock = terrain[x][y][z];
    scene.remove(previousBlock);
    scene.add(newBlock);
    terrain[x][z][y] = newBlock;
    

    


    

    /*
    for (let x = 0; x < city.size; x++) {
      for (let y = 0; y < city.size; y++) {
        //for (let z = 0; z < city.size; z++) {
          const tile = city.data[x][y][0];
          console.log(tile)
          //const existingBuildingMesh = buildings[x][y][0];

          
          // If the player removes a building, remove it from the scene
          if (!tile.building && existingBuildingMesh) {
            scene.remove(existingBuildingMesh);
            buildings[x][y][0] = undefined;
          }
          

          
          // If the data model has changed, update the mesh
          if (tile.building && tile.building.updated) {
            scene.remove(existingBuildingMesh);
            buildings[x][y] = createAssetInstance(tile.building.id, x, y, 0, tile.building);
            scene.add(buildings[x][y][0]);
            tile.building.updated = false;
          }
            
        //}

       
      }
    }
    */
  }

  function setupLights() {
    const lights = [
      new THREE.AmbientLight(0xffffff, 0.2),
      new THREE.DirectionalLight(0xffffff, 0.3),
      new THREE.DirectionalLight(0xffffff, 0.3),
      new THREE.DirectionalLight(0xffffff, 0.3)
    ];

    lights[1].position.set(0, 1, 0);
    lights[2].position.set(1, 1, 0);
    lights[3].position.set(0, 1, 1);

    scene.add(...lights);
  }

  /**
   * Render the contents of the scene
   */
  function draw() {
    renderer.render(scene, camera.camera);
  }

  /**
   * Starts the renderer
   */
  function start() {
    renderer.setAnimationLoop(draw);
  }

  /**
   * Stops the renderer
   */
  function stop() {
    renderer.setAnimationLoop(null);
  }

  /**
   * Event handler for `onMouseDown` event
   * @param {MouseEvent} event 
   */
  function onMouseDown(event) {
    // Compute normalized mouse coordinates
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera.camera);

    let intersections = raycaster.intersectObjects(scene.children, false);

    if (intersections.length > 0) {
      if (selectedObject) selectedObject.material.emissive.setHex(0);
      selectedObject = intersections[0].object;
      selectedObject.material.emissive.setHex(0x555555);
      console.log(selectedObject.userData);

      if (this.onObjectSelected) {
        this.onObjectSelected(selectedObject);
      }
    }
  }

  /**
   * Event handler for 'onMouseMove' event
   * @param {MouseEvent} event 
   */
  function onMouseMove(event) {
    camera.onMouseMove(event);
  }

  return {
    onObjectSelected,
    initialize,
    update,
    start,
    stop,
    onMouseDown,
    onMouseMove
  }
}