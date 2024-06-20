import { useState, useEffect, useRef } from 'react';

import { createGame } from './components/game';

import './App.css';

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
          <button class="ui-button" onclick="setActiveTool(event,'residential')">RESIDENTIAL</button>
          <button class="ui-button" onclick="setActiveTool(event,'commercial')">COMMERCIAL</button>
          <button class="ui-button" onclick="setActiveTool(event,'industrial')">INDUSTRIAL</button>
          <button class="ui-button" onclick="setActiveTool(event,'road')">ROAD</button>
        </div>
    </div>
  );
}

export default App;
