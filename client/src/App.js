import React, { useState, useEffect, useRef } from 'react';
import { createGame, setActiveToolData } from './components/game.js';
import { handleClearAll } from './components/scene.js';
import CubeSvg from './components/CubeSvg';
import ClearCubeSvg from './components/ClearCubeSvg';
import {
  AppBar,
  Toolbar,
  Drawer,
  Box,
  Typography,
  CssBaseline,
  Divider,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { styled, useTheme, createTheme, ThemeProvider } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';

import wasd from './assets/wasd.png';

import './App.css';

const drawerWidth = 240;

const colorPalette = [
  "#FF6F61", "#6B5B95", "#88B04B", "#92A8D1", "#DD4124", "#EFC050",
  "#009B77", "#B565A7", "#9B2335", "#45B8AC", "#BC243C", "#5B5EA6",
  "#955251", "#F7CAC9", "#F3D6E4"
];

const darkmode = {
  navbar: '#222222',
  offWhiteText: '#F5F5F5',
  drawerBackground: '#2B2B2B',
  drawerSelect: '#444444',
  drawerHightlight: '#333333',
  scrollThumb: '#666666',
  scrollBackground: '#333333'
}

function App() {
  const refContainer = useRef(null);
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [selectedColor, setSelectedColor] = useState();


  useEffect(() => {
    if (refContainer.current) {
      while (refContainer.current.firstChild) {
        refContainer.current.removeChild(refContainer.current.firstChild);
      }
    }
    window.game = createGame('dark');
  }, []);

  const swapTool = (toolId, toolColor) => {
    const newTool = { id: toolId, color: toolColor || 0x000000 };
    setActiveToolData(newTool);
    setSelectedColor(toolColor || 'clear');
    window.game.clearHighlights();
  };

  const handleDrawerToggle = () => setOpen(!open);
  //const handleDrawerClose = () => setOpen(false);

  return (
    <>

      <AppBar position="fixed" sx={{ boxShadow: 'none' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: darkmode.navbar,
            height: 55,
            paddingLeft: 20
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              edge="start"
              sx={{ marginRight: 2 }}
            >
              <MenuIcon />
              {open ?
                <ChevronLeftIcon />
                :
                <ChevronRightIcon />
              }
            </IconButton>

            <CubeSvg cubeColor={'#92a8d1'} />

            <Typography variant="h6" noWrap style={{ fontWeight: 560, marginLeft: 15 }}>
              3D Sandbox
            </Typography>
          </div>
        </div>
      </AppBar>




      <div style={{ display: 'flex' }}>
        <Drawer
          sx={{
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              height: 'calc(100vh - 55px)',
              marginTop: '55px',
              color: darkmode.offWhiteText,
              backgroundColor: darkmode.drawerBackground, // Drawer background
              // Customizing the scrollbar to match the background while keeping it visible
              '&::-webkit-scrollbar': {
                width: '8px', // Scrollbar width
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: darkmode.scrollThumb, // Scrollbar thumb color, lighter shade to remain visible
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: darkmode.scrollBackground, // Match the drawer background color for track
              },
            },
          }}
          variant="persistent"
          open={open}
        >

          <List 
            onWheel={(event) => {
              event.stopPropagation();
            }}
            style={{ padding: 0, margin: 5 }}
          >
            <ListItem disablePadding className="drawer-button">
              <ListItemButton onClick={() => swapTool('bulldoze')} style={{ backgroundColor: selectedColor === 'clear' ? darkmode.drawerSelect : 'transparent' }}>
                <ListItemIcon>
                  <ClearCubeSvg />
                </ListItemIcon>
                <ListItemText primary="Clear" />
              </ListItemButton>
            </ListItem>
            {colorPalette.map((color, index) => (
              <ListItem key={index} disablePadding className="drawer-button">
                <ListItemButton onClick={() => swapTool('player_block', color)} style={{ backgroundColor: selectedColor === color ? darkmode.drawerSelect : 'transparent' }}>
                  <ListItemIcon>
                    <CubeSvg cubeColor={color} />
                  </ListItemIcon>
                  <ListItemText primary={color} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Drawer>
        <div 
          style={{
            position: 'absolute',
            marginTop: 70,
            marginLeft: open ? 200 : 20,
            transition: 'margin-left 0.175s ease', // Transition for the button
          }}
        >
          <Button
            color="error"
            loadingPosition="start"
            variant="outlined"
            onClick={handleClearAll}
            style={{height: 30 }}
          >
            <HighlightOffIcon style={{marginRight: 10}}/>
            <div>
              Clear All
            </div>
            
          </Button>
        </div>
        <div 
          style={{
            position: 'absolute',
            bottom: 40,
            marginTop: 70,
            marginLeft: open ? 240 : 60,
            transition: 'margin-left 0.175s ease', // Transition for the button
            //backgroundColor: 'transparent'
          }}
        >
          <img src={wasd} style={{width: 120, height: 120}}/>
        </div>
      </div>




      <div id="render-target" ref={refContainer} style={{ width: 'calc(100vw)', height: 'calc(100vh - 55px)', float: 'right', zIndex: -1, marginTop: 55 }}>
      </div>
    </>
  );
}

export default App;
