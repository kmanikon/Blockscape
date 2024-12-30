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

/*
  // Hook up mouse event handlers to the scene
  document.addEventListener('mousedown', scene.onMouseDown.bind(scene), false);
  document.addEventListener('mousemove', scene.onMouseMove.bind(scene), false);
  document.addEventListener('wheel', scene.onMouseWheel.bind(scene), false);
  document.addEventListener('contextmenu', (event) => event.preventDefault(), false);
  */

  let lastTouchDistance = 0;
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    const getTouchDistance = (touches) => {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const getTouchCenter = (touches) => {
      return {
        x: (touches[0].clientX + touches[1].clientX) / 2,
        y: (touches[0].clientY + touches[1].clientY) / 2
      };
    };

    const handleTouchStart = (event) => {
      event.preventDefault();
      isDragging = true;

      if (event.touches.length === 1) {
        // Single touch - equivalent to left mouse button
        lastX = event.touches[0].clientX;
        lastY = event.touches[0].clientY;
        scene.onMouseDown({
          clientX: lastX,
          clientY: lastY,
          button: 0 // Left click
        });
      } else if (event.touches.length === 2) {
        // Two finger touch - prepare for pinch/zoom or right-click equivalent
        lastTouchDistance = getTouchDistance(event.touches);
        const center = getTouchCenter(event.touches);
        lastX = center.x;
        lastY = center.y;
        scene.onMouseDown({
          clientX: center.x,
          clientY: center.y,
          button: 2 // Right click
        });
      }
    };

    const handleTouchMove = (event) => {
      event.preventDefault();
      if (!isDragging) return;

      if (event.touches.length === 1) {
        // Single finger drag
        const touchX = event.touches[0].clientX;
        const touchY = event.touches[0].clientY;
        
        scene.onMouseMove({
          clientX: touchX,
          clientY: touchY,
          movementX: touchX - lastX,
          movementY: touchY - lastY
        });

        lastX = touchX;
        lastY = touchY;
      } else if (event.touches.length === 2) {
        // Handle pinch zoom
        const currentDistance = getTouchDistance(event.touches);
        const delta = currentDistance - lastTouchDistance;
        
        // Simulate mouse wheel with pinch gesture
        scene.onMouseWheel({
          deltaY: -delta, // Negative delta zooms in, positive zooms out
          preventDefault: () => {}
        });

        lastTouchDistance = currentDistance;

        // Update center position for two-finger drag
        const center = getTouchCenter(event.touches);
        scene.onMouseMove({
          clientX: center.x,
          clientY: center.y,
          movementX: center.x - lastX,
          movementY: center.y - lastY
        });

        lastX = center.x;
        lastY = center.y;
      }
    };

    const handleTouchEnd = (event) => {
      event.preventDefault();
      isDragging = false;
      lastTouchDistance = 0;
    };

    // Add touch event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    document.addEventListener('contextmenu', (event) => event.preventDefault(), false);

  const game = {
    clearHighlights() {
      scene.clearHighlights();
    }
  }

  scene.start();

  return game;
}

export { activeToolData, setActiveToolData };