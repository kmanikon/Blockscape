import { createScene } from './scene.js';
import { createCity } from './city.js';

let activeToolData = { id: '', color: 0x000000 };

const setActiveToolData = (toolData) => {
    activeToolData = { id: toolData.id, color: toolData.color };
}

const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export function createGame(mode, initialTerrain, setSelectedTerrain) {
    const scene = createScene(mode, setSelectedTerrain);
    const city = createCity(16);
    scene.initialize(city, initialTerrain);

    const listeners = [];
    
    if (isMobile()) {
        const mobileListeners = [
            ['touchstart', (e) => {
                e.preventDefault();
                scene.onMouseDown(e.touches[0]);
            }],
            ['touchmove', (e) => {
                e.preventDefault();
                scene.onMouseMove(e.touches[0]);
            }],
            ['touchend', (e) => e.preventDefault()],
            ['gesturestart', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                scene.onMouseWheel({ deltaY: touch.scale > 1 ? -100 : 100 });
            }]
        ];
        mobileListeners.forEach(([event, handler]) => {
            document.addEventListener(event, handler, { passive: false });
            listeners.push([event, handler]);
        });
    } else {
        const desktopListeners = [
            ['mousedown', scene.onMouseDown.bind(scene)],
            ['mousemove', scene.onMouseMove.bind(scene)],
            ['wheel', scene.onMouseWheel.bind(scene)],
            ['contextmenu', (event) => event.preventDefault()]
        ];
        desktopListeners.forEach(([event, handler]) => {
            document.addEventListener(event, handler, false);
            listeners.push([event, handler]);
        });
    }

    const game = {
        clearHighlights() {
            scene.clearHighlights();
        },
        destroy() {
            listeners.forEach(([event, handler]) => {
                document.removeEventListener(event, handler, false);
            });
        }
    }

    scene.start();
    return game;
}

export { activeToolData, setActiveToolData };