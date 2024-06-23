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
      z >= 0 && z < terrain[0][0].length && 
      isPlaceable(x, y, z)) {
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
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera.camera);

    let intersections = raycaster.intersectObjects(scene.children, false);

    if (intersections.length > 0) {
      if (selectedObject) selectedObject.material.emissive.setHex(0);
      selectedObject = intersections[0].object;
      selectedObject.material.emissive.setHex(0x555555);
      console.log(selectedObject.userData);

      if (activeToolId !== 'bulldoze') {
        placeBlock(intersections[0]);
      }
      else {
        clearBlock(intersections[0]);
      }

      if (onObjectSelected) {
        onObjectSelected(selectedObject);
      }
    }
  }

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
