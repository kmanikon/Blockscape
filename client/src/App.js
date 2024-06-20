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
            <button id='button-bulldoze' class="ui-button selected" onClick={() => setActiveToolId('bulldoze') }>BULLDOZE</button>
            <button id='button-residential' class="ui-button" onClick={() => setActiveToolId('residential') }>RESIDENTIAL</button>
            <button id='button-commercial' class="ui-button" onClick={() => setActiveToolId('commercial')}>COMMERCIAL</button>
            <button id='button-industrial' class="ui-button" onClick={() => setActiveToolId('industrial')}>INDUSTRIAL</button>
            <button id='button-road' class="ui-button" onClick={() => setActiveToolId('road')}>ROAD</button>
        </div>
    </div>
  );
}

export default App;

export { toolId };
