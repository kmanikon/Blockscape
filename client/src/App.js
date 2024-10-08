import { useState, useEffect, useRef } from 'react';

import { createGame, setActiveToolData } from './components/game.js';

import CubeSvg from './components/CubeSvg';

import './App.css';

function App() {
  const refContainer = useRef(null);

  useEffect(() => {
    if (refContainer.current) {
      while (refContainer.current.firstChild) {
        refContainer.current.removeChild(refContainer.current.firstChild);
      }
    }

    window.game = createGame();

  }, []);


  const swapTool = (toolId, toolColor) => {
    const newTool = { id: toolId, color: toolColor || 0x000000 }
    setActiveToolData(newTool)
    window.game.clearHighlights();
  }


  return (
    <div>
        <div id="render-target" ref={refContainer} style={{ width: 'calc(100vw)', height: '100vh', float: 'right', zIndex: -1 }}>
          
        </div>
      
        <div id="ui-toolbar">
          <CubeSvg cubeColor="green"/>
            <button id='button-bulldoze' className="ui-button selected" onClick={() => swapTool('bulldoze') }>CLEAR</button>
            <button id='button-residential' className="ui-button" onClick={() => swapTool('player_block', 0x008000) }>GREEN</button>
            <button id='button-commercial' className="ui-button" onClick={() => swapTool('player_block', 0x0000FF)}>BLUE</button>
            <button id='button-industrial' className="ui-button" onClick={() => swapTool('player_block', 0xFFFF00)}>YELLOW</button>
            <button id='button-industrial' className="ui-button" onClick={() => swapTool('player_block', 0x00000A)}>BLACK</button>
        </div>
    </div>
  );
}

export default App;
