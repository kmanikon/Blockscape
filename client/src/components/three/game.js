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

  const isMobileDevice = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    return (
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent) ||
      // Also check for touch capability as a fallback
      ('ontouchstart' in window || navigator.maxTouchPoints > 0)
    );
  };

  const isMobile = isMobileDevice();
    let lastTouchDistance = 0;
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    // Touch control handlers
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
        lastX = event.touches[0].clientX;
        lastY = event.touches[0].clientY;
        scene.onMouseDown({
          clientX: lastX,
          clientY: lastY,
          button: 0
        });
      } else if (event.touches.length === 2) {
        lastTouchDistance = getTouchDistance(event.touches);
        const center = getTouchCenter(event.touches);
        lastX = center.x;
        lastY = center.y;
        scene.onMouseDown({
          clientX: center.x,
          clientY: center.y,
          button: 2
        });
      }
    };

    const handleTouchMove = (event) => {
      event.preventDefault();
      if (!isDragging) return;

      if (event.touches.length === 1) {
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
        const currentDistance = getTouchDistance(event.touches);
        const delta = currentDistance - lastTouchDistance;
        
        scene.onMouseWheel({
          deltaY: -delta,
          preventDefault: () => {}
        });

        lastTouchDistance = currentDistance;

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

    // Mouse control handlers
    const handleMouseDown = (event) => {
      scene.onMouseDown(event);
    };

    const handleMouseMove = (event) => {
      scene.onMouseMove(event);
    };

    const handleMouseWheel = (event) => {
      scene.onMouseWheel(event);
    };

    const preventContextMenu = (event) => event.preventDefault();

    // Add event listeners based on device type
    if (isMobile) {
      document.addEventListener('touchstart', handleTouchStart, { passive: false });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd, { passive: false });
    } else {
      document.addEventListener('mousedown', handleMouseDown, false);
      document.addEventListener('mousemove', handleMouseMove, false);
      document.addEventListener('wheel', handleMouseWheel, false);
    }
    
    // Context menu should be prevented on both
    document.addEventListener('contextmenu', preventContextMenu, false);


    
  const game = {
    clearHighlights() {
      scene.clearHighlights();
    }
  }

  scene.start();

  return game;
}

export { activeToolData, setActiveToolData };