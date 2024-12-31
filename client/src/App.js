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
  TextField,
  ButtonGroup,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import MenuIcon from '@mui/icons-material/Menu';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import CloseIcon from '@mui/icons-material/Close';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getProjects, getProjectById, createProject, editProject, deleteProject, saveProjectTerrain } from './api/supabase.js';
import HoldButton from './components/HoldButton';
import wasd from './assets/wasd.png';

import './App.css';

const colorPalette = [
  "#FF6F61", "#6B5B95", "#88B04B", "#92A8D1", "#DD4124", "#EFC050",
  "#009B77", "#B565A7", "#9B2335", "#45B8AC", "#BC243C", "#5B5EA6",
  "#955251", "#F7CAC9", "#F3D6E4"
];

const isMobile = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768;

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

let s;

function App() {
  const refContainer = useRef(null);
  const theme = useTheme();
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(isMobile ? false : true);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(isMobile ? false : true);
  const [selectedColor, setSelectedColor] = useState();

  const [projects, setProjects] = useState([]);

  const [projectName, setProjectName] = useState('');
  const [selectedProject, setSelectedProject] = useState(-1);
  const [selectedTerrain, setSelectedTerrain] = useState();

  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);

  const [projectModalMode, setProjectModalMode] = useState('create');
  const drawerWidth = 240;

  useEffect(() => {
    const fetchProjects = async () => {
      const projectData = await getProjects();
      setProjects(projectData);
      if (projectData.length > 0) {
        setSelectedProject(projectData[0].id)
      }
    }
    fetchProjects();

  }, []);

  useEffect(() => {
    const fetchTerrain = async () => {
      const data = await getProjectById(selectedProject);
      //sessionStorage.setItem('terrain', data);
      setSelectedTerrain(data);
      if (refContainer.current) {
        while (refContainer.current.firstChild) {
          refContainer.current.removeChild(refContainer.current.firstChild);
        }
      }
      let { game, scene } = createGame('dark', data, setSelectedTerrain);
      window.game = game;
      s = scene;

      // Hook up mouse event handlers to the scene
      document.addEventListener('mousedown', scene.onMouseDown.bind(scene), false);
      document.addEventListener('mousemove', scene.onMouseMove.bind(scene), false);
      document.addEventListener('wheel', scene.onMouseWheel.bind(scene), {passive: false});
      document.addEventListener('contextmenu', (event) => event.preventDefault(), false);    
    }
    
    if (selectedProject !== -1) {
      fetchTerrain();

      return () => {
        document.removeEventListener('mousedown', s.onMouseDown.bind(s), false);
        document.removeEventListener('mousemove', s.onMouseMove.bind(s), false);
        document.removeEventListener('wheel', s.onMouseWheel.bind(s), false);
        document.removeEventListener('contextmenu', (event) => event.preventDefault(), false);
      }
    }

  }, [selectedProject])

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

  const handleCreateProjectOpen = () => {
    setProjectName('');
    setNewProjectModalOpen(true);
    setProjectModalMode('create');
  }

  const handleEditProjectOpen = (project) => {
    setProjectName(project.name);
    setNewProjectModalOpen(true);
    setProjectModalMode('edit');
    setSelectedProject(project.id)
  }

  const handleDeleteProjectOpen = (project) => {
    setNewProjectModalOpen(true);
    setProjectModalMode('delete');
    setSelectedProject(project.id)
  }

  const handleCreateSubmit = async (project) => {
    const data = await createProject(project);
    if (data?.length > 0) {
      setProjects([...projects, { id: data[0].id, name: data[0].name }])
    }
    setNewProjectModalOpen(false);
  }

  const handleEditSubmit = async (oldProject, newProject) => {
    const data = await editProject(oldProject, newProject);
    if (data) {
      setProjects(projects.map((p) => p.id === selectedProject ? { id: p.id, name: newProject.name } : p))
    }
    setNewProjectModalOpen(false);
  }

  const handleDeleteSubmit = async (project) => {
    const data = await deleteProject(project);
    if (data) {
      setProjects(projects.filter((p) => p.id !== selectedProject));
    }
    setNewProjectModalOpen(false);
  }

  const handleSave = async () => {
    const terrainString = selectedTerrain;//sessionStorage.getItem('terrain');
    const data = await saveProjectTerrain({ id: selectedProject, terrain_string: terrainString })
  }

  const clearAll = () => {
    setSelectedTerrain('');
    // clear scene
    handleClearAll();
  }

  const DirectionArrows = () => (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: '1fr auto 1fr',
        gridTemplateColumns: '1fr auto 1fr',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0px', // Adjust spacing between the arrows
        textAlign: 'center',
      }}
    >
      {/* Left Arrow */}
      <div style={{ gridRow: '2', gridColumn: '1' }}>
        <HoldButton action={() => s.shiftCamera(s, -0.5, 0)}>
          <Button
            variant="text"
            disableRipple
            size="small"
            style={{ color: '#777777', background: 'transparent', padding: 0 , marginRight: -45 }}
          >
            <ArrowBackIcon style={{ fontSize: 22, padding: 0}} />
          </Button>
        </HoldButton>
      </div>
  
      {/* Up Arrow */}
      <div style={{ gridRow: '1', gridColumn: '2' }}>
        <HoldButton action={() => s.shiftCamera(s, 0, 0.5)}>
          <Button
            variant="text"
            disableRipple
            size="small"
            style={{ color: '#777777', background: 'transparent', padding: 0, marginBottom: -5}}
          >
            <ArrowUpwardIcon style={{ fontSize: 22 }} />
          </Button>
        </HoldButton>
      </div>
  
      {/* Down Arrow */}
      <div style={{ gridRow: '3', gridColumn: '2' }}>
        <HoldButton action={() => s.shiftCamera(s, 0, -0.5)}>
          <Button
            variant="text"
            disableRipple
            size="small"
            style={{ color: '#777777', background: 'transparent', padding: 0, marginTop: -5}}
          >
            <ArrowDownwardIcon style={{ fontSize: 22 }} />
          </Button>
        </HoldButton>
      </div>
  
      {/* Right Arrow */}
      <div style={{ gridRow: '2', gridColumn: '3' }}>
        <HoldButton action={() => s.shiftCamera(s, 0.5, 0)}>
          <Button
            variant="text"
            disableRipple
            size="small"
            style={{ color: '#777777', background: 'transparent', padding: 0, marginLeft: -45 }}
          >
            <ArrowForwardIcon style={{ fontSize: 22, padding: 0 }} />
          </Button>
        </HoldButton>
      </div>
    </div>
  );
  

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
              Blockscape
            </Typography>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              color="inherit"
              aria-label="open drawer"
              onClick={handleRightDrawerToggle}
              edge="start"
              sx={{ marginRight: 1 }}
              style={{ textTransform: 'none', backgroundColor: 'transparent' }}
            >
              <FormatListBulletedIcon />
              {/*}
              <Typography variant="h6" noWrap style={{ fontWeight: 560, marginLeft: 15, fontSize: 17 }}>
                Projects
              </Typography>
              */}

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
                <div style={{ fontSize: 15, fontWeight: 600 }}>Clear</div>
              </ListItemButton>
            </ListItem>
            {colorPalette.map((color, index) => (
              <ListItem key={index} disablePadding className="drawer-button">
                <ListItemButton onClick={() => swapTool('player_block', color)} style={{ backgroundColor: selectedColor === color ? darkmode.drawerSelect : 'transparent' }}>
                  <ListItemIcon>
                    <CubeSvg cubeColor={color} />
                  </ListItemIcon>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{color}</div>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Drawer>

        {/* right drawer */}
        <Drawer
          anchor="right"
          className="drawer"
          sx={{
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              //width: drawerWidth,
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
            style={{ width: '100%', padding: 0, margin: 5, borderTop: `1px solid ${darkmode.drawerSelect}`, paddingTop: 5 }}
          >
            <ListItem disablePadding className="drawer-button">
              <ListItemButton style={{ backgroundColor: 'transparent' }} onClick={() => handleCreateProjectOpen()}>
                <AddIcon style={{ color: darkmode.buttonAccent, marginRight: 16 }} />
                <div style={{ fontSize: 14, fontWeight: 600 }}>New Project</div>

              </ListItemButton>
            </ListItem>

            {projects.map((project, index) => (
              <ListItem key={index} disablePadding className="drawer-button" style={{ marginTop: 5 }}>
                <ListItemButton
                  onClick={() => setSelectedProject(project.id)}
                  style={{ backgroundColor: selectedProject === project.id ? darkmode.drawerSelect : 'transparent', justifyContent: 'space-between' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ArticleOutlinedIcon style={{ color: darkmode.buttonAccent, marginRight: 16 }} />
                    <div style={{ fontSize: 14, fontWeight: 600, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{project.name}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <DeleteOutlineOutlinedIcon
                      onClick={handleDeleteProjectOpen}
                      className="editProjectIcon"
                      style={{
                        paddingLeft: 12,
                        color: darkmode.buttonAccent,
                        fontSize: 18,
                        display: 'flex',
                        textAlign: 'right'
                      }}
                    />
                    <EditOutlinedIcon
                      onClick={() => handleEditProjectOpen(project)}
                      className="editProjectIcon"
                      style={{
                        paddingLeft: 12,
                        color: darkmode.buttonAccent,
                        fontSize: 18,
                        display: 'flex',
                        textAlign: 'right'
                      }}
                    />
                  </div>
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
            //transition: 'margin-left 0.025s ease', // Transition for the button
          }}
        >
          <Grid container spacing={2}>
            <Grid >
              <Button
                color="success"
                variant="outlined"
                onClick={handleSave}
                style={{ height: 30, whiteSpace: 'nowrap' }}
              >
                <SaveOutlinedIcon style={{ marginRight: 10 }} />
                <div>
                  Save Project
                </div>

              </Button>
            </Grid>
            <Grid >
              <Button
                color="error"
                variant="outlined"
                onClick={clearAll}
                style={{ height: 30 }}
              >
                <HighlightOffIcon style={{ marginRight: 10 }} />
                <div>
                  Clear All
                </div>

              </Button>
            </Grid>
          </Grid>



        </div>
        
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            marginTop: 70,
            marginLeft: leftDrawerOpen ? 200 : 40,
            //transition: 'margin-left 0.175s ease', // Transition for the button
            //backgroundColor: 'transparent'
          }}
        >
          <img src={wasd} className="wasdImg" style={{ width: 120, height: 120 }} />
        </div>
        

        <div
          style={{
            position: 'absolute',
            bottom: 60,
            //right: 40,
            marginTop: 70,
            marginRight: rightDrawerOpen ? 210 : 30,
            //transition: 'margin-left 0.175s ease', // Transition for the button
            //backgroundColor: 'transparent'
          }}
          className="navContainer"
        >
          <div style={{display: 'flex', alignItems: 'center'}}>
          <Grid container spacing={2} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Grid >
              <HoldButton
                action={() => s.onMouseWheelDelta(s, -10)}
              >
                <Button
                  //color="primary"
                  variant="text"
                  disableRipple
                  //onPress={() => s.onMouseWheelDelta(s, 0.9)}
                  style={{  color: '#777777', background: 'transparent', padding: 0, minWidth: 40 }}
                >
                  <ZoomInIcon style={{ fontSize: 26 }} />
                </Button>
              </HoldButton>
            </Grid>

            <Grid >
              <HoldButton
                action={() => s.onMouseWheelDelta(s, 10)}
              >
                <Button
                  //color="primary"
                  variant="text"
                  disableRipple
                  disablePadding
                  size="small"
                  //onPress={() => s.onMouseWheelDelta(s, 0.9)}
                  style={{ color: '#777777', background: 'transparent', padding: 0, minWidth: 40 }}
                >
                  <ZoomOutIcon style={{ fontSize: 26 }} />
                 

                </Button>
              </HoldButton>
            </Grid>

            <Grid>
              <HoldButton
                action={() => s.rotateCameraHorizontally(s, -5)}
              >
                <Button
                  //color="primary"
                  variant="text"
                  disableRipple
                  disablePadding
                  //onPress={() => s.onMouseWheelDelta(s, 0.9)}
                  style={{ color: '#777777', background: 'transparent', padding: 0, minWidth: 40}}
                >
                  <RotateLeftIcon style={{ fontSize: 26 }} />
                 

                </Button>
              </HoldButton>
              </Grid>

              <Grid>
              <HoldButton
                action={() => s.rotateCameraHorizontally(s, 5)}
              >
                <Button
                  //color="primary"
                  variant="text"
                  disableRipple
                  //onPress={() => s.onMouseWheelDelta(s, 0.9)}
                  style={{ color: '#777777', background: 'transparent', padding: 0, minWidth: 40 }}
                >
                  <RotateRightIcon style={{ fontSize: 26 }} />
                 

                </Button>
              </HoldButton>
              </Grid>


              <Grid>

              <DirectionArrows/>
              </Grid>
            </Grid>


              </div>
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
          {projectModalMode !== 'delete' ?
            <>
              <IconButton
                onClick={() => setNewProjectModalOpen(false)}
                sx={{ position: "absolute", top: 8, right: 8 }}
              >
                <CloseIcon />
              </IconButton>
              <h2 style={{ margin: 0 }}>{projectModalMode === 'create' ? 'New Project' : 'Edit Project'}</h2>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                <TextField
                  variant="outlined"
                  placeholder="Enter project name"
                  fullWidth
                  size="small"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                //sx={{ marginTop: 1 }}
                />
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  style={{ height: 40, padding: 0, fontWeight: 600 }}
                  onClick={
                    projectModalMode === 'create' ?
                      () => handleCreateSubmit({ name: projectName })
                      :
                      () => handleEditSubmit(projects.find((p) => p.id === selectedProject), { name: projectName })
                  }
                >
                  Go
                </Button>
              </div>
            </>
            :
            <>
              <IconButton
                onClick={() => setNewProjectModalOpen(false)}
                sx={{ position: "absolute", top: 8, right: 8 }}
              >
                <CloseIcon />
              </IconButton>
              <h2 style={{ margin: 0 }}>Delete Project?</h2>
              <ButtonGroup fullWidth>
                <Button
                  color="warning"
                  onClick={() => handleDeleteSubmit(projects.find((p) => p.id === selectedProject))}
                  style={{ fontWeight: 560 }}
                >
                  yes
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => setNewProjectModalOpen(false)}
                  style={{ fontWeight: 560 }}
                >
                  no
                </Button>
              </ButtonGroup>
            </>
          }

        </Paper>
      </Modal>




      <div id="render-target" ref={refContainer} style={{ position: 'absolute', width: 'calc(100vw)', height: 'calc(100vh)', float: 'right', zIndex: -1 }}>
      </div>
    </>
  );
}

export default App;
