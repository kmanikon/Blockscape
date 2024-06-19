import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createCamera } from './components/createCamera';
import { createCity } from './components/city';
import './App.css';

function App() {
  const refContainer = useRef(null);
  const Camera = createCamera();

  useEffect(() => {
    let renderer, scene, camera, mesh;

    // Clear existing renderer if any
    if (refContainer.current) {
      while (refContainer.current.firstChild) {
        refContainer.current.removeChild(refContainer.current.firstChild);
      }
    }

    // Initial scene setup
    scene = new THREE.Scene();
    camera = Camera.camera;
    renderer = new THREE.WebGLRenderer();
    scene.background = new THREE.Color(0x777777);
    //camera.position.z = 5;

    renderer.setSize(window.innerWidth, window.innerHeight);
    if (refContainer.current) {
      refContainer.current.appendChild(renderer.domElement);
    }

    /*
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    //const material = new THREE.MeshBasicMaterial({ color: 0x0afdcd });
    const material = new THREE.MeshLambertMaterial();
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    */

    let terrain = [];
    let buildings = [];

    function initialize(city) {
        scene.clear();
        terrain = [];
        buildings = [];
        for (let x = 0; x < city.size; x++) {
          const column = [];
          for (let y = 0; y < city.size; y++) {
            // Grass geometry
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshLambertMaterial({ color: 0x00aa00 });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x, -0.5, y);
            scene.add(mesh);
            column.push(mesh);
          }
          terrain.push(column);
          buildings.push([...Array(city.size)]);
        }

        setupLights();
    }

    function update(city) {
        for (let x = 0; x < city.size; x++) {
          for (let y = 0; y < city.size; y++) {
            // Building geometry
            const tile = city.data[x][y];
            if (tile.building && tile.building.startsWith('building')) {
              const height = Number(tile.building.slice(-1));
              const buildingGeometry = new THREE.BoxGeometry(1, height, 1);
              const buildingMaterial = new THREE.MeshLambertMaterial({ color: 0x777777 });
              const buildingMesh = new THREE.Mesh(buildingGeometry, buildingMaterial);
              buildingMesh.position.set(x, height / 2, y);

              if (buildings[x][y]) {
                scene.remove(buildings[x][y]);
              }

              scene.add(buildingMesh);
              buildings[x][y] = buildingMesh
            }
          }
        }
    }

    setupLights();

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

    const animate = () => {
      //requestAnimationFrame(animate);
      //mesh.rotation.x += 0.0;
      //mesh.rotation.y += 0.0;
      renderer.render(scene, camera);
    };

    function start() {
      renderer.setAnimationLoop(animate);
    }

    animate();



    const city = createCity(16);

    initialize(city);


    // Event listeners for camera controls
    window.addEventListener('mousedown', Camera.onMouseDown);
    window.addEventListener('mouseup', Camera.onMouseUp);
    window.addEventListener('mousemove', Camera.onMouseMove);

    window.addEventListener('wheel', Camera.onMouseWheel);


    const game = {
      update() {
        city.update();
        update(city);
      }
    }

    setInterval(() => {
      game.update();
    }, 1000)

    start();

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('mousedown', Camera.onMouseDown);
      window.removeEventListener('mouseup', Camera.onMouseUp);
      window.removeEventListener('mousemove', Camera.onMouseMove);

      window.removeEventListener('wheel', Camera.onMouseWheel);

      if (refContainer.current) {
        refContainer.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div>
      <div id="render-target" ref={refContainer} style={{ width: '100vw', height: '90vh' }}></div>
    </div>
  );
}

export default App;
