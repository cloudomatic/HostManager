import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import NavigationPanel from './NavigationPanel';

const drawerWidth = 200;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  background: window.getTheme().primaryColor
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  background: window.getTheme().primaryColor,
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(6)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function NavigationDrawer(props) {
  const theme = useTheme();
  
  const {
    parentFormDrawerPinnedOpenState: [keepDrawerOpen, setKeepDrawerOpen]
  } = {
    parentFormDrawerPinnedOpenState: React.useState(0),
    ...(props.drawerPinnedOpenState || false)
  };

  const {
    parentFormDrawerState: [open, setOpen]
  } = {
    parentFormDrawerState: React.useState(0),
    ...(props.drawerState || false)
  };

  const handleDrawerOpen = () => {
    if (!open) setOpen(true);
  };

  const handleDrawerClose = () => {
    if (open) setOpen(false);
  };

  const toggleDrawer = () => {
    if (open) setOpen(false)
    else if (!open) setOpen(true)
  };

  const handleKeepOpen = () => {
    if (!keepDrawerOpen) setKeepDrawerOpen(true)
  }

  const handleDontKeepOpen = () => {
    if (keepDrawerOpen) {
      setKeepDrawerOpen(false)
    }
  }

  const doNothing = () => {
    debugger
  };

  return (
      <Drawer id="drawer-root" 
        variant="permanent" 
        open={open || keepDrawerOpen} 
        onMouseOut={handleDrawerClose}
        onMouseOver={handleDrawerOpen}
        PaperProps_={{
          sx: {
            backgroundColor: "pink",
            color: "red",
          }
        }}
      >
        <div id="div-navigation-panel" style={{ 
                height: "90%",
        }}>
         
          <NavigationPanel 
            panelOpen={open} 
            menuContent={props.menuContent}
            navigationController={props.navigationController}
          />
          
        </div>
        <div
          id="div-pin-open-closed"
          style={{ 
                paddingTop: "100%",
                paddingLeft: "83%",
                paddingBottom: "4em"
          }}
        >
        {
          keepDrawerOpen ? 
            <ChevronLeftIcon 
              style={{ 
                color: window.getTheme().primaryColorComplement,
              }}
              onClick={handleDontKeepOpen}
            />
            :
            <ChevronRightIcon
              style={{
                color: open ? window.getTheme().primaryColorComplement : window.getTheme().primaryColorComplement,
              }}
              onClick={handleKeepOpen}
            />
        }
        </div>
      </Drawer>
  );
}
