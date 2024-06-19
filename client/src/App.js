import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createCamera } from './components/createCamera';
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

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    //const material = new THREE.MeshBasicMaterial({ color: 0x0afdcd });
    const material = new THREE.MeshLambertMaterial();
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

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
      requestAnimationFrame(animate);
      mesh.rotation.x += 0.0;
      mesh.rotation.y += 0.0;
      renderer.render(scene, camera);
    };
    animate();

    // Event listeners for camera controls
    window.addEventListener('mousedown', Camera.onMouseDown);
    window.addEventListener('mouseup', Camera.onMouseUp);
    window.addEventListener('mousemove', Camera.onMouseMove);

    window.addEventListener('wheel', Camera.onMouseWheel);

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
