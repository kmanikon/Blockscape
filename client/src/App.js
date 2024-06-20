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
      <div id="render-target" ref={refContainer} style={{ width: '100vw', height: '100vh' }}></div>
    </div>
  );
}

export default App;
