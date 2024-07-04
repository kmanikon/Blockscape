import * as THREE from 'three';
import { createCamera } from './camera.js';
import { createAssetInstance } from './assets.js';
import { activeToolId } from './game.js';

const ymax = 2;

export function createScene() {
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
  let highlightedBlocks = [];

  let intersections = [];

  let onObjectSelected = undefined;

  function initialize(city) {
    scene.clear();
    terrain = [];
    highlightedBlocks = [];

    for (let x = 0; x < city.size; x++) {
      const column = [];
      for (let y = 0; y < city.size; y++) {
        const row = [];
        for (let z = 0; z < city.size; z++) {
          row.push(undefined);
        }
        column.push(row);
      }
      terrain.push(column);
    }

    for (let x = 0; x < city.size; x++) {
      for (let y = 0; y < city.size; y++) {
        const terrainId = 'grass';
        const mesh = createAssetInstance(terrainId, x, 0, y);
        scene.add(mesh);
        terrain[x][0][y] = mesh;
      }
    }

    for (let x = 0; x < city.size; x++) {
      for (let y = 0; y < city.size; y++) {
        const terrainId = 'sky';
        const mesh = createAssetInstance(terrainId, x, 1, y);
        scene.add(mesh);
        terrain[x][1][y] = mesh;
      }
    }

    setupLights();
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
    alert('calling scene update...')
    const x = boundVal(selectedObject.userData.x, 0, city.size);
    const y = boundVal(selectedObject.userData.y + 1, 0, city.size);
    const z = boundVal(selectedObject.userData.z, 0, city.size);

    const previousBlock = terrain[x][z][y];

    if (activeToolId !== 'bulldoze') {
      const newBlock = createAssetInstance(activeToolId, x, y, z, undefined);
      scene.remove(previousBlock);
      scene.add(newBlock);
      terrain[x][z][y] = newBlock;

      clearHighlightedBlocks();
      highlightAdjacentBlocks(x, y, z);
    }
    else {
     
      scene.remove(previousBlock);
      terrain[x][z][y] = undefined;
    }

  }

  function isPlaceable(x, y, z) {
    if (terrain[x][y][z] && terrain[x][y][z].userData.id !== 'sky') {
      return false;
    }

    const neighbors = [
      [x - 1, y, z], [x + 1, y, z],
      [x, y - 1, z], [x, y + 1, z],
      [x, y, z - 1], [x, y, z + 1]
    ];

    for (let [nx, ny, nz] of neighbors) {
      if (nx >= 0 && nx < terrain.length &&
        ny >= 0 && ny < terrain[0].length &&
        nz >= 0 && nz < terrain[0][0].length &&
        terrain[nx][ny][nz] && terrain[nx][ny][nz].userData.id !== 'sky') {
        return true;
      }
    }
    return false;
  }

  function highlightAdjacentBlocks(x, y, z) {
    const neighbors = [
      [x - 1, y, z], [x + 1, y, z],
      [x, y - 1, z], [x, y + 1, z],
      [x, y, z - 1], [x, y, z + 1]
    ];

    for (let [nx, ny, nz] of neighbors) {
      if (nx >= 0 && nx < terrain.length &&
        ny >= 0 && ny < terrain[0].length &&
        nz >= 0 && nz < terrain[0][0].length) {
        const neighborBlock = terrain[nx][ny][nz];
        if (neighborBlock && neighborBlock.userData.id === 'sky') {
          neighborBlock.material.emissive.setHex(0x555555);
          highlightedBlocks.push(neighborBlock);
        }
      }
    }
  }

  function clearHighlightedBlocks() {
    for (let block of highlightedBlocks) {
      block.material.emissive.setHex(0);
    }
    highlightedBlocks = [];
  }

  function placeBlock(intersection) {
    const intersectedBlock = intersection.object;
    const normal = intersection.face.normal;
    const x = intersectedBlock.userData.x + normal.x;
    const y = intersectedBlock.userData.y + normal.y;
    const z = intersectedBlock.userData.z + normal.z;

    if (x >= 0 && x < terrain.length &&
      y >= 0 && y < terrain[0].length &&
      z >= 0 && z < terrain[0][0].length) {
        //alert('hi')

      if (terrain[x][y][z] !== undefined) {
        scene.remove(terrain[x][y][z]);
        terrain[x][y][z] = undefined;
      }
      const newBlock = createAssetInstance(activeToolId, x, y, z);
      scene.add(newBlock);
      terrain[x][y][z] = newBlock;
    }
  }

  function clearBlock(intersection) {
    const intersectedBlock = intersection.object;
    const normal = intersection.face.normal;
    const x = intersectedBlock.userData.x + normal.x;
    const y = intersectedBlock.userData.y + normal.y;
    const z = intersectedBlock.userData.z + normal.z;

    if (x >= 0 && x < terrain.length &&
      y >= 0 && y < terrain[0].length &&
      z >= 0 && z < terrain[0][0].length && 
      isPlaceable(x, y, z)) {
        //const newBlock = createAssetInstance(activeToolId, x, y, z);
        scene.remove(intersectedBlock);
        terrain[x][y][z] = undefined;
      }
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

  function draw() {
    renderer.render(scene, camera.camera);
  }

  function start() {
    renderer.setAnimationLoop(draw);
  }

  function stop() {
    renderer.setAnimationLoop(null);
  }

  function onMouseDown(event) {
    if (intersections.length > 0) {
      if (activeToolId !== 'bulldoze') {
        placeBlock(intersections[0]);
        alert(`Placed Block at [${selectedObject?.userData?.x}, ${selectedObject?.userData?.y}, ${selectedObject?.userData?.z}]`)
      }
      else {
        clearBlock(intersections[0]);
      }
    }
  }

  function onMouseMove(event) {
    camera.onMouseMove(event);
  
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
  
    raycaster.setFromCamera(mouse, camera.camera);
  
    intersections = raycaster.intersectObjects(scene.children, false);
  
    if (selectedObject) {
      selectedObject.material.emissive.setHex(0);
      if (selectedObject.userData.isTemporary) {
        const x = selectedObject.userData.x;
        const y = selectedObject.userData.y;
        const z = selectedObject.userData.z;
        terrain[x][z][y] = undefined;
        scene.remove(selectedObject);
      }
      selectedObject = undefined;
    }
  
    if (intersections.length > 0) {
      if (activeToolId === 'bulldoze') {
        selectedObject = intersections[0].object;
        selectedObject.material.emissive.setHex(0x555555);
      } else {
        // Highlight where the new block would be placed
        const intersectedBlock = intersections[0].object;
        const normal = intersections[0].face.normal;
        const x = intersectedBlock.userData.x + normal.x;
        let y = intersectedBlock.userData.y; //+ normal.y;
        const z = intersectedBlock.userData.z + normal.z;
  
        if (x >= 0 && x < terrain.length &&
          y >= 0 && y < terrain[0].length &&
          z >= 0 && z < terrain[0][0].length) {

            /*
            if (terrain[x][y + 1][z] == undefined) {
              y = y + 1;
            }
            */
          
          // Use a temporary highlight block or existing block to highlight the position
          const highlightBlock = terrain[x][y][z];
          if (highlightBlock) {
            selectedObject = highlightBlock;
          } else {
            selectedObject = createAssetInstance('sky', x, y, z);
            selectedObject.userData.isTemporary = true;
            scene.add(selectedObject);
          }
          selectedObject.material.emissive.setHex(0x555555);
        }
      }
    }
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
