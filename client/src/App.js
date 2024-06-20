import { useState, useEffect, useRef } from 'react';

import { createGame } from './components/game';

import './App.css';

function App() {
  const refContainer = useRef(null);

  let game;
  useEffect(() => {
    window.game = createGame();

  }, []);

  return (
    <div>
      <div id="render-target" ref={refContainer} style={{ width: '100vw', height: '90vh' }}></div>
    </div>
  );
}

export default App;
