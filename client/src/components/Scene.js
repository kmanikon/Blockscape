import * as THREE from 'three';
import { useEffect, useRef } from 'react';

const Scene = () => {
  const refContainer = useRef(null);

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
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();

    scene.background = new THREE.Color(0x777777);
    camera.position.z = 5;

    renderer.setSize(window.innerWidth, window.innerHeight);
    if (refContainer.current) {
      refContainer.current.appendChild(renderer.domElement);
    }

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x0afdcd });
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const animate = () => {
      requestAnimationFrame(animate);
      mesh.rotation.x += 0.02;
      mesh.rotation.y += 0.00;
      renderer.render(scene, camera);
    };
    animate();

    
    // Cleanup on component unmount
    return () => {
      if (refContainer.current) {
        refContainer.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      /*
      scene = null;
      camera = null;
      mesh = null;
      renderer = null;
      */
    };
    
  }, []);

  return <div ref={refContainer}></div>;
};

export default Scene;
