import { useState, useEffect, useRef } from 'react';

import { createGame, setActiveToolId } from './components/game.js';

import './App.css';

var toolId = 'commercial';

function App() {
  const refContainer = useRef(null);

  let game;
  useEffect(() => {
    if (refContainer.current) {
      while (refContainer.current.firstChild) {
        refContainer.current.removeChild(refContainer.current.firstChild);
      }
    }

    window.game = createGame();

    
  }, []);

    

  return (
    <div>
        <div id="render-target" ref={refContainer} style={{ width: 'calc(100vw)', height: '100vh', float: 'right', zIndex: -1 }}>
          
        </div>
      
        <div id="ui-toolbar">
            <button id='button-bulldoze' className="ui-button selected" onClick={() => setActiveToolId('bulldoze') }>CLEAR</button>
            <button id='button-residential' className="ui-button" onClick={() => setActiveToolId('residential') }>GREEN</button>
            <button id='button-commercial' className="ui-button" onClick={() => setActiveToolId('commercial')}>BLUE</button>
            <button id='button-industrial' className="ui-button" onClick={() => setActiveToolId('industrial')}>YELLOW</button>
            <button id='button-road' className="ui-button" onClick={() => setActiveToolId('road')}>TILE</button>
        </div>
    </div>
  );
}

export default App;

export { toolId };
