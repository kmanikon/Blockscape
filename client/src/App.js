import { useState, useEffect, useRef } from 'react';

import { createGame, setActiveToolData } from './components/game.js';

import CubeSvg from './components/CubeSvg';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import Button from '@mui/material/Button';


import { Router, Navigation } from '@toolpad/core';

import './App.css';

const colorPalette = [
  "#FF6F61",  // Coral
  "#6B5B95",  // Royal Purple
  "#88B04B",  // Soft Green
  "#F7CAC9",  // Pale Pink
  "#92A8D1",  // Light Blue
  "#955251",  // Chestnut
  "#B565A7",  // Orchid
  "#009B77",  // Emerald
  "#DD4124",  // Fiery Red
  "#45B8AC",  // Aqua
  "#EFC050",  // Golden Yellow
  "#5B5EA6",  // Indigo
  "#9B2335",  // Crimson
  "#BC243C",  // Claret
  "#F3D6E4"   // Blush
];

/*
const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    kind: 'title',
    segment: 'None',
    title: 'Reports',
    icon: <BarChartIcon />,
    //action: () => null
    //render: <div onClick={() => null}>hi</div>
    
  },
  {
    segment: 'orders',
    title: 'Orders',
    icon: <ShoppingCartIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 
      <Button 
        className="sidebar-clickable"
        fullWidth
        style={{padding: 0, justifyContent: 'left'}}
      >
        <CubeSvg cubeColor="blue"/>
        <div className="sidebar-text">
        hi
        </div>
      </Button>
  },
  {
    kind: 'header',
    title: 
      <Button 
        className="sidebar-clickable"
        fullWidth
        style={{padding: 0, justifyContent: 'left'}}
      >
        <CubeSvg cubeColor="blue"/>
        <div className="sidebar-text">
        hi
        </div>
      </Button>
  },
  {
    segment: 'reports',
    title: 'Reports',
    icon: <BarChartIcon />,
    disabled: true,
    children: [
      {
        segment: 'sales',
        title: 'Sales',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'traffic',
        title: 'Traffic',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: 'integrations',
    title: 'Integrations',
    icon: <LayersIcon />,
  },
];
*/



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

  const demoTheme = createTheme({
    cssVariables: {
      colorSchemeSelector: 'data-toolpad-color-scheme',
    },
    colorSchemes: { light: true, dark: true },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 600,
        lg: 1200,
        xl: 1536,
      },
    },
  });

  
  const NAVIGATION = colorPalette.map((color) => (
    /*
    {
      kind: 'header',
      title: 
        <Button 
          className="sidebar-clickable"
          fullWidth
          style={{padding: 0, justifyContent: 'left'}}
          onClick={() => swapTool('player_block', color)}
        >
          <CubeSvg cubeColor={color}/>
          <div className="sidebar-text">
            {color}
          </div>
        </Button>
    }
    */
   {
    kind: 'title',
    segment: 'None',
    title: <div onClick={() => swapTool('player_block', color)}>{color}</div>,
    icon: 
      <Button 
        className="sidebar-clickable"
        fullWidth
        onClick={() => swapTool('player_block', color)}
        disableRipple
        disableElevation
        sx={{
          ml: 1,
          "&.MuiButtonBase-root:hover": {
            bgcolor: "transparent"
          }
        }}
      >
        <CubeSvg cubeColor={color}/>

      </Button>,
   }
  
  ))
  

  return (
    <div>
        {/* main section*/}
        {/*}
        <div id="render-target" ref={refContainer} style={{ width: 'calc(100vw)', height: '100vh', float: 'right', zIndex: -1 }}>
        </div>
      
        <div id="ui-toolbar">
            {colorPalette.map((color) => 
              <div style={{display: 'flex'}}>
                <CubeSvg cubeColor={color}/>
                glgr
              </div>
            )}
            <button id='button-bulldoze' className="ui-button selected" onClick={() => swapTool('bulldoze') }>CLEAR</button>
            <button id='button-residential' className="ui-button" onClick={() => swapTool('player_block', 0x008000) }>GREEN</button>
            <button id='button-commercial' className="ui-button" onClick={() => swapTool('player_block', 0x0000FF)}>BLUE</button>
            <button id='button-industrial' className="ui-button" onClick={() => swapTool('player_block', 0xFFFF00)}>YELLOW</button>
            <button id='button-industrial' className="ui-button" onClick={() => swapTool('player_block', 0x00000A)}>BLACK</button>
        </div>
        */}
        <AppProvider
          navigation={NAVIGATION}  // Pass an empty array instead of NAVIGATION
          theme={demoTheme}
          //sidebar={false}  // Set sidebar to false to attempt to hide it
          branding={{
            kind: 'header',
            title: '3D Sandbox'
          }}
          router={{
            navigate: () => null
          }}
      >
        <DashboardLayout>
          
        </DashboardLayout>
        <div id="render-target" ref={refContainer} style={{ width: 'calc(100vw)', height: 'calc(100vh - 65px)', float: 'right', zIndex: -1 }}>
          </div>
      </AppProvider>
    </div>
  );
}

export default App;
