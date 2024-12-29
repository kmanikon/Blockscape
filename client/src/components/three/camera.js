import * as THREE from 'three';

export function createCamera(gameWindow) {
  // -- Constants --
  const DEG2RAD = Math.PI / 180.0;

  const LEFT_MOUSE_BUTTON = 1;
  const MIDDLE_MOUSE_BUTTON = 4;
  const RIGHT_MOUSE_BUTTON = 2;

  // Camera constraints
  const MIN_CAMERA_RADIUS = 10;
  const MAX_CAMERA_RADIUS = 50;
  const MIN_CAMERA_ELEVATION = 30;
  const MAX_CAMERA_ELEVATION = 90;

  // Camera sensitivity
  const ROTATION_SENSITIVITY = 0.2;
  const PAN_SENSITIVITY = -0.01;
  const ZOOM_SENSITIVITY = 0.2;  // Adjust zoom speed here
  const MOVE_SENSITIVITY = 0.1; // Adjust WASD movement speed here

  const Y_AXIS = new THREE.Vector3(0, 1, 0);

  // -- Variables --
  const camera = new THREE.PerspectiveCamera(45, gameWindow.offsetWidth / gameWindow.offsetHeight, 0.1, 1000);
  let cameraOrigin = new THREE.Vector3(8, 0, 8);
  let cameraRadius = (MIN_CAMERA_RADIUS + MAX_CAMERA_RADIUS) / 2;
  let cameraAzimuth = 135;
  let cameraElevation = 45;

  const movement = {
    forward: false,
    backward: false,
    left: false,
    right: false,
  };

  updateCameraPosition();

  /**
   * Event handler for `keydown` event
   * @param {KeyboardEvent} event
   */
  function onKeyDown(event) {
    switch (event.code) {
      case 'KeyW':
        movement.forward = true;
        break;
      case 'KeyS':
        movement.backward = true;
        break;
      case 'KeyA':
        movement.left = true;
        break;
      case 'KeyD':
        movement.right = true;
        break;
    }
  }

  /**
   * Event handler for `keyup` event
   * @param {KeyboardEvent} event
   */
  function onKeyUp(event) {
    switch (event.code) {
      case 'KeyW':
        movement.forward = false;
        break;
      case 'KeyS':
        movement.backward = false;
        break;
      case 'KeyA':
        movement.left = false;
        break;
      case 'KeyD':
        movement.right = false;
        break;
    }
  }

  /**
   * Update the camera position based on pressed keys
   */
  function updateCameraMovement() {
    const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(Y_AXIS, cameraAzimuth * DEG2RAD);
    const left = new THREE.Vector3(1, 0, 0).applyAxisAngle(Y_AXIS, cameraAzimuth * DEG2RAD);

    if (movement.forward) {
      cameraOrigin.add(forward.multiplyScalar(-MOVE_SENSITIVITY));
    }
    if (movement.backward) {
      cameraOrigin.add(forward.multiplyScalar(MOVE_SENSITIVITY));
    }
    if (movement.left) {
      cameraOrigin.add(left.multiplyScalar(-MOVE_SENSITIVITY));
    }
    if (movement.right) {
      cameraOrigin.add(left.multiplyScalar(MOVE_SENSITIVITY));
    }

    updateCameraPosition();
  }


  /**
   * Event handler for `mousemove` event
   * @param {MouseEvent} event Mouse event arguments
   */
  function onMouseMove(event) {
    // Handles the rotation of the camera
    if (event.buttons & LEFT_MOUSE_BUTTON) {
      cameraAzimuth += -(event.movementX * ROTATION_SENSITIVITY);
      cameraElevation += (event.movementY * ROTATION_SENSITIVITY);
      cameraElevation = Math.min(MAX_CAMERA_ELEVATION, Math.max(MIN_CAMERA_ELEVATION, cameraElevation));
      updateCameraPosition();
    }

    // Handles the panning of the camera
    if (event.buttons & MIDDLE_MOUSE_BUTTON) {
      const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(Y_AXIS, cameraAzimuth * DEG2RAD);
      const left = new THREE.Vector3(1, 0, 0).applyAxisAngle(Y_AXIS, cameraAzimuth * DEG2RAD);
      cameraOrigin.add(forward.multiplyScalar(PAN_SENSITIVITY * event.movementY));
      cameraOrigin.add(left.multiplyScalar(PAN_SENSITIVITY * event.movementX));
      updateCameraPosition();
    }

    // Handles the zoom of the camera
    if (event.buttons & RIGHT_MOUSE_BUTTON) {
      cameraRadius += event.movementY * ZOOM_SENSITIVITY;
      cameraRadius = Math.min(MAX_CAMERA_RADIUS, Math.max(MIN_CAMERA_RADIUS, cameraRadius));
      updateCameraPosition();
    }
  }

  // Scroll event handler for zooming
  function onMouseWheel(event) {
    const delta = event.deltaY || event.detail || -event.wheelDelta;
    cameraRadius += delta * ZOOM_SENSITIVITY;

    // Clamping zoom limits
    cameraRadius = Math.min(MAX_CAMERA_RADIUS, Math.max(MIN_CAMERA_RADIUS, cameraRadius));

    updateCameraPosition();
  }

  function updateCameraPosition() {
    camera.position.x = cameraRadius * Math.sin(cameraAzimuth * DEG2RAD) * Math.cos(cameraElevation * DEG2RAD);
    camera.position.y = cameraRadius * Math.sin(cameraElevation * DEG2RAD);
    camera.position.z = cameraRadius * Math.cos(cameraAzimuth * DEG2RAD) * Math.cos(cameraElevation * DEG2RAD);
    camera.position.add(cameraOrigin);
    camera.lookAt(cameraOrigin);
    camera.updateMatrix();
  }

  // Add event listeners
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  // Animation loop for smooth movement
  function animate() {
    updateCameraMovement();
    requestAnimationFrame(animate);
  }

  animate();

  return {
    camera,
    onMouseMove,
    onMouseWheel
  };
}




/*
import * as THREE from 'three';

export function createCamera(gameWindow) {
  // -- Constants --
  const DEG2RAD = Math.PI / 180.0;

  const LEFT_MOUSE_BUTTON = 1;
  const MIDDLE_MOUSE_BUTTON = 4;
  const RIGHT_MOUSE_BUTTON = 2;

  // Camera constraints
  const MIN_CAMERA_RADIUS = 10;
  const MAX_CAMERA_RADIUS = 50;
  const MIN_CAMERA_ELEVATION = 30;
  const MAX_CAMERA_ELEVATION = 90;

  // Camera sensitivity
  const ROTATION_SENSITIVITY = 0.2;
  const ZOOM_SENSITIVITY = 0.02;
  const PAN_SENSITIVITY = -0.01;

  const Y_AXIS = new THREE.Vector3(0, 1, 0);

  // -- Variables --
  const camera = new THREE.PerspectiveCamera(45, gameWindow.offsetWidth / gameWindow.offsetHeight, 0.1, 1000);
  let cameraOrigin = new THREE.Vector3(8, 0, 8);
  let cameraRadius = (MIN_CAMERA_RADIUS + MAX_CAMERA_RADIUS) / 2;  
  let cameraAzimuth = 135;
  let cameraElevation = 45;

  updateCameraPosition();


  function onMouseMove(event) {
    // Handles the rotation of the camera
    if (event.buttons & LEFT_MOUSE_BUTTON) {
      cameraAzimuth += -(event.movementX * ROTATION_SENSITIVITY);
      cameraElevation += (event.movementY * ROTATION_SENSITIVITY);
      cameraElevation = Math.min(MAX_CAMERA_ELEVATION, Math.max(MIN_CAMERA_ELEVATION, cameraElevation));
      updateCameraPosition();
    }

    // Handles the panning of the camera
    if (event.buttons & MIDDLE_MOUSE_BUTTON) {
      const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(Y_AXIS, cameraAzimuth * DEG2RAD);
      const left = new THREE.Vector3(1, 0, 0).applyAxisAngle(Y_AXIS, cameraAzimuth * DEG2RAD);
      cameraOrigin.add(forward.multiplyScalar(PAN_SENSITIVITY * event.movementY));
      cameraOrigin.add(left.multiplyScalar(PAN_SENSITIVITY * event.movementX));
      updateCameraPosition();
    }

    // Handles the zoom of the camera
    if (event.buttons & RIGHT_MOUSE_BUTTON) {
      cameraRadius += event.movementY * ZOOM_SENSITIVITY;
      cameraRadius = Math.min(MAX_CAMERA_RADIUS, Math.max(MIN_CAMERA_RADIUS, cameraRadius));
      updateCameraPosition();
    }
  }

  // Scroll event handler for zooming
  function onMouseWheel(event) {
    const delta = event.deltaY || event.detail || -event.wheelDelta;
    cameraRadius += delta * ZOOM_SENSITIVITY;

    // Clamping zoom limits
    cameraRadius = Math.min(MAX_CAMERA_RADIUS, Math.max(MIN_CAMERA_RADIUS, cameraRadius));

    updateCameraPosition();
  }

  function updateCameraPosition() {
    camera.position.x = cameraRadius * Math.sin(cameraAzimuth * DEG2RAD) * Math.cos(cameraElevation * DEG2RAD);
    camera.position.y = cameraRadius * Math.sin(cameraElevation * DEG2RAD);
    camera.position.z = cameraRadius * Math.cos(cameraAzimuth * DEG2RAD) * Math.cos(cameraElevation * DEG2RAD);
    camera.position.add(cameraOrigin);
    camera.lookAt(cameraOrigin);
    camera.updateMatrix();
  }

  return {
    camera,
    onMouseMove,
    onMouseWheel
  }
}
*/