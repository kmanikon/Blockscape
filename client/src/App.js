import React, { useState, useEffect, useRef } from 'react';
import { createGame, setActiveToolData } from './components/three/game.js';
import { handleClearAll } from './components/three/scene.js';
import CubeSvg from './components/svg/CubeSvg.jsx';
import ClearCubeSvg from './components/svg/ClearCubeSvg.jsx';
import {
  AppBar,
  Toolbar,
  Drawer,
  Box,
  Typography,
  Divider,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Modal,
  Paper,
  TextField
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import CloseIcon from '@mui/icons-material/Close';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { getProjects } from './api/supabase.js';

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
  scrollBackground: '#333333',
  buttonAccent: 'rgba(240, 244, 248, 0.6)'
}

function App() {
  const refContainer = useRef(null);
  const theme = useTheme();
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(true);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(true);
  const [selectedColor, setSelectedColor] = useState();

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(1);

  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      const projectData = await getProjects();
      console.log(projectData)
      setProjects(projectData);
    }
    fetchProjects();
  }, []);

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

  const handleLeftDrawerToggle = () => setLeftDrawerOpen(!leftDrawerOpen);
  const handleRightDrawerToggle = () => setRightDrawerOpen(!rightDrawerOpen);
  //const handleDrawerClose = () => setOpen(false);

  const handleNewProjctModalClose = () => setNewProjectModalOpen(!newProjectModalOpen);

  return (
    <>

      <AppBar 
        position="fixed" 
        sx={{ boxShadow: 'none' }} 
        
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
        onMouseMove={(event) => {
          event.stopPropagation();
        }}
        onWheel={(event) => {
          event.stopPropagation();
        }}
        onContextMenu={(event) => {
          event.stopPropagation();
        }}
        
      >
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
            <Button
              color="inherit"
              aria-label="open drawer"
              onClick={handleLeftDrawerToggle}
              edge="start"
              sx={{ marginRight: 2 }}
            >
              <MenuIcon />
              {leftDrawerOpen ?
                <ChevronLeftIcon />
                :
                <ChevronRightIcon />
              }
            </Button>

            <CubeSvg cubeColor={'#92a8d1'} />

            <Typography variant="h6" noWrap style={{ fontWeight: 560, marginLeft: 15 }}>
              3D Sandbox
            </Typography>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              color="inherit"
              aria-label="open drawer"
              onClick={handleRightDrawerToggle}
              edge="start"
              sx={{ marginRight: 6 }}
              style={{textTransform: 'none', backgroundColor: 'transparent'}}
            >
              <MenuIcon/>
              <Typography variant="h6" noWrap style={{ fontWeight: 560, marginLeft: 15, fontSize: 17 }}>
                Projects
              </Typography>
              
            </Button>
           
          </div>
        </div>
      </AppBar>




      <div style={{ display: 'flex' }}>
        {/* left drawer */}
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
          open={leftDrawerOpen}

          onMouseDown={(event) => {
            event.stopPropagation();
          }}
          onMouseMove={(event) => {
            event.stopPropagation();
          }}
          onWheel={(event) => {
            event.stopPropagation();
          }}
          onContextMenu={(event) => {
            event.stopPropagation();
          }}
        >

          <List 
            onWheel={(event) => {
              event.stopPropagation();
            }}
            style={{ padding: 0, margin: 5, borderTop: `1px solid ${darkmode.drawerSelect}`, paddinTop: 5 }}
          >
            <ListItem disablePadding className="drawer-button">
              <ListItemButton onClick={() => swapTool('bulldoze')} style={{ backgroundColor: selectedColor === 'clear' ? darkmode.drawerSelect : 'transparent' }}>
                <ListItemIcon>
                  <ClearCubeSvg />
                </ListItemIcon>
                <div style={{fontSize: 15, fontWeight: 600}}>Clear</div>
              </ListItemButton>
            </ListItem>
            {colorPalette.map((color, index) => (
              <ListItem key={index} disablePadding className="drawer-button">
                <ListItemButton onClick={() => swapTool('player_block', color)} style={{ backgroundColor: selectedColor === color ? darkmode.drawerSelect : 'transparent' }}>
                  <ListItemIcon>
                    <CubeSvg cubeColor={color} />
                  </ListItemIcon>
                  <div style={{fontSize: 15, fontWeight: 600}}>{color}</div>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Drawer>

        {/* right drawer */}
        <Drawer
          anchor="right"
          sx={{
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              height: 'calc(100vh - 40px)',
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
          open={rightDrawerOpen}

          onMouseDown={(event) => {
            event.stopPropagation();
          }}
          onMouseMove={(event) => {
            event.stopPropagation();
          }}
          onWheel={(event) => {
            event.stopPropagation();
          }}
          onContextMenu={(event) => {
            event.stopPropagation();
          }}
        >
          <List 
            onWheel={(event) => {
              event.stopPropagation();
            }}
            style={{width: '100%', padding: 0, margin: 5, borderTop: `1px solid ${darkmode.drawerSelect}`, paddingTop: 5 }}
          >
            <ListItem disablePadding className="drawer-button">
              <ListItemButton style={{ backgroundColor: 'transparent' }} onClick={() => setNewProjectModalOpen(true)}>
                <AddIcon style={{color: darkmode.buttonAccent, marginRight: 16}}/>
                <div style={{fontSize: 14, fontWeight: 600}}>New Project</div>

              </ListItemButton>
            </ListItem>
            
            {projects.map((project, index) => (
              <ListItem key={index} disablePadding className="drawer-button" style={{marginTop: 5}}>
                <ListItemButton style={{ backgroundColor: selectedProject === project.id ? darkmode.drawerSelect : 'transparent' }}>
                  <ArticleOutlinedIcon style={{color: darkmode.buttonAccent, marginRight: 16}}/>
                  <div style={{fontSize: 14, fontWeight: 600, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{project.name}</div>
                  <EditOutlinedIcon style={{ paddingLeft: 12, color: darkmode.buttonAccent, fontSize: 18, display: 'flex', textAlign: 'right'}}/>
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
            marginLeft: leftDrawerOpen ? 200 : 20,
            transition: 'margin-left 0.175s ease', // Transition for the button
          }}
        >
          <Button
            color="error"
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
            marginLeft: leftDrawerOpen ? 240 : 60,
            transition: 'margin-left 0.175s ease', // Transition for the button
            //backgroundColor: 'transparent'
          }}
        >
          <img src={wasd} style={{width: 120, height: 120}}/>
        </div>
      </div>

      <Modal 
        open={newProjectModalOpen} 
        onClose={() => setNewProjectModalOpen(false)}
        onMouseEnter={(event) => event.stopPropagation()}

        onMouseDown={(event) => {
          event.stopPropagation();
        }}
        onMouseMove={(event) => {
          event.stopPropagation();
        }}
        onWheel={(event) => {
          event.stopPropagation();
        }}
        onContextMenu={(event) => {
          event.stopPropagation();
        }}
      >
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            padding: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            boxShadow: 24,
            borderRadius: 2,
            bgcolor: "background.paper",
          }}
        >
          <IconButton
            onClick={() => setNewProjectModalOpen(false)}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <h2 style={{ margin: 0 }}>New Project</h2>
          <div style={{display: 'flex', alignItems: 'center', marginTop: 10}}>
          <TextField
            variant="outlined"
            placeholder="Enter project name"
            fullWidth
            size="small"
            //sx={{ marginTop: 1 }}
          />
          <Button 
            size="small" 
            variant="contained" 
            color="success"
            style={{height: 40, padding: 0, fontWeight: 600}}
            onClick={() => null}
          >
            Go
          </Button>
          </div>

        </Paper>
      </Modal>




      <div id="render-target" ref={refContainer} style={{ position: 'absolute', width: 'calc(100vw)', height: 'calc(100vh)', float: 'right', zIndex: -1}}>
      </div>
    </>
  );
}

export default App;
