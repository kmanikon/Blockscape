import * as THREE from 'three';
import { createCamera } from './camera.js';
import { createAssetInstance } from './assets.js';
import { activeToolData } from './game.js';

let selectedObject = undefined;
let highlightedBlocks = [];
let intersections = [];
let terrain = [];

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
        const terrainId = 'foundation';
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

  function isPlaceable(x, y, z) {
    /*
    if (terrain[x][y][z] && terrain[x][y][z].userData.id !== 'sky') {
      return false;
    }
    */

    const neighbors = [
      [x - 1, y, z], [x + 1, y, z],
      [x, y - 1, z], [x, y + 1, z],
      [x, y, z - 1], [x, y, z + 1]
    ];

    for (let [nx, ny, nz] of neighbors) {
      if (nx >= 0 && nx < terrain.length &&
        ny >= 0 && ny < terrain[0].length &&
        nz >= 0 && nz < terrain[0][0].length
        //terrain[nx][ny][nz] && terrain[nx][ny][nz].userData.id !== 'sky'
      ) {
        return true;
      }
    }
    return false;
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

      if (terrain[x][y][z] !== undefined) {
        scene.remove(terrain[x][y][z]);
        terrain[x][y][z] = undefined;
      }

      const newBlock = createAssetInstance(activeToolData.id, x, y, z, { color: activeToolData.color });
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
        scene.remove(intersectedBlock);
        terrain[x][y][z] = undefined;
      }
  }


/*
  HIGHLIGHTING LOGIC HERE
*/

  function placeHighlightBlock(intersection) {
      clearHighlights();

      const intersectedBlock = intersection.object;
      const normal = intersection.face.normal;

      let x = intersectedBlock.userData.x + Math.round(normal.x);
      let y = intersectedBlock.userData.y + Math.round(normal.y);
      let z = intersectedBlock.userData.z + Math.round(normal.z);

      x = Math.max(0, Math.min(x, terrain.length - 1));
      y = Math.max(0, Math.min(y, terrain[0].length - 1));
      z = Math.max(0, Math.min(z, terrain[0][0].length - 1));

      highlightAdjacentFaces(x, y, z);
  }

  function clearHighlights() {
      highlightedBlocks.forEach(highlight => {
        scene.remove(highlight);
      });
      highlightedBlocks = [];
  }

  function highlightAdjacentFaces(x, y, z) {
      const adjacentPositions = [
        {x: x-1, y: y, z: z, face: 'right'},
        {x: x+1, y: y, z: z, face: 'left'},
        {x: x, y: y-1, z: z, face: 'top'},
        {x: x, y: y+1, z: z, face: 'bottom'},
        {x: x, y: y, z: z-1, face: 'front'},
        {x: x, y: y, z: z+1, face: 'back'}
      ];

      adjacentPositions.forEach(pos => {
        if (isValidPosition(pos.x, pos.y, pos.z) && terrain[pos.x][pos.y][pos.z]) {
          highlightBlockFace(terrain[pos.x][pos.y][pos.z], pos.face);
        }
      });
  }

  function isValidPosition(x, y, z) {
      return x >= 0 && x < terrain.length &&
            y >= 0 && y < terrain[0].length &&
            z >= 0 && z < terrain[0][0].length;
  }

  function highlightBlockFace(block, face) {
      const highlightMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide,
        polygonOffset: true,       // Enable polygon offset
        polygonOffsetFactor: -0.5,   // Offset to push the highlight plane forward
        polygonOffsetUnits: -0.5
      });

      const highlightGeometry = new THREE.PlaneGeometry(1, 1);
      const highlightMesh = new THREE.Mesh(highlightGeometry, highlightMaterial);

      positionHighlight(highlightMesh, block, face);

      scene.add(highlightMesh);
      highlightedBlocks.push(highlightMesh);
  }

  function positionHighlight(highlightMesh, block, face) {
      highlightMesh.position.copy(block.position);

      const offset = 0.000; // Slight offset to prevent z-fighting

      
      switch(face) {
        case 'left':
          highlightMesh.rotation.y = Math.PI / 2;
          highlightMesh.position.x -= 0.5 + offset;
          break;
        case 'right':
          highlightMesh.rotation.y = -Math.PI / 2;
          highlightMesh.position.x += 0.5 + offset;
          break;
        case 'top':
          highlightMesh.rotation.x = -Math.PI / 2;
          highlightMesh.position.y += 0.5 + offset;
          break;
        case 'bottom':
          highlightMesh.rotation.x = Math.PI / 2;
          highlightMesh.position.y -= 0.5 + offset;
          break;
        case 'front':
          highlightMesh.position.z += 0.5 + offset;
          break;
        case 'back':
          highlightMesh.rotation.y = Math.PI;
          highlightMesh.position.z -= 0.5 + offset;
          break;
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
      if (activeToolData.id !== 'bulldoze') {
        placeBlock(intersections[0]);
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
      if (selectedObject?.material?.emissive) {
        selectedObject.material.emissive.setHex(0);
      }
      if (selectedObject.userData.isTemporary) {
        const x = selectedObject.userData.x;
        const y = selectedObject.userData.y;
        const z = selectedObject.userData.z;
        terrain[x][z][y] = undefined;
        scene.remove(selectedObject);
      }
      selectedObject = undefined;
    }
  
    
    if (intersections.length > 0 && intersections[0]?.object?.material) {
      if (activeToolData.id === 'bulldoze') {
        selectedObject = intersections[0].object;
        if (selectedObject?.material?.emissive) {
          selectedObject.material.emissive.setHex(0x555555);
        }
      } else {
        

        placeHighlightBlock(intersections[0]);
       
      }
    }
    else if (selectedObject){
      selectedObject.material.emissive.setHex(0);
    }
    
    
  }
  

  return {
    onObjectSelected,
    initialize,
    start,
    stop,
    onMouseDown,
    onMouseMove,
    clearHighlights
  }
}

