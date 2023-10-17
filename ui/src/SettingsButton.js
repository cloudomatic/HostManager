import * as React from 'react';
import Icon from './Icon';
import Text from './Text';
import SimpleToggleSwitch from './SimpleToggleSwitch';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

// https://jsfiddle.net/yX3p9/7/

export default function SettingsButton() {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [showApiCalls, setShowApiCalls] = React.useState(localStorage.getItem("hostmanager.options.showApiCalls") == "true")
  const [showDebugPanel, setShowDebugPanel] = React.useState(localStorage.getItem("hostmanager.options.showDebugPanel") == "true")

  const menuFontSize = "0.9em"
  const menuLineSpacing = "0.2em"

  const toggleShowApiCalls = () => {
    if (showApiCalls) {
      localStorage.removeItem("hostmanager.options.showApiCalls")
      setShowApiCalls(false)
    }
    else {
      localStorage.setItem("hostmanager.options.showApiCalls", "true")  
      setShowApiCalls(true)
    }
  }
 
  const toggleShowDebugPanel = () => {
    if (showDebugPanel) {
      localStorage.removeItem("hostmanager.options.showDebugPanel")
      setShowDebugPanel(false)
    }
    else {
      localStorage.setItem("hostmanager.options.showDebugPanel", "true")
      setShowDebugPanel(true)
    }
  }

  const handleThemeSwitch = (theme) => {
    window.setTheme(theme)
    window.location.href="/"
  }

  return (
    <span>
      <IconButton
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <Icon name="Settings" transform="scale(0.9)" color={window.getTheme().componentAreaIconColor} />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        sx={
          { 
          mt: "1px", "& .MuiMenu-paper": 
          { backgroundColor: window.getTheme().appBarMenuBackgroundColor }, 
         }
        }
      >
        <div style={{margin: "0.8em 1.0em 0.8em 1.0em"}}>
          <div onClick={toggleShowApiCalls}>
						<Text fontSize={menuFontSize} fontWeight="bold" color={window.getTheme().appBarMenuTextColor}>
							<span style={{display: "inline-block", width: "0.9em", backgroundColor: "none" }}>{showApiCalls ? <>&#10003;</> : <>&nbsp;</>}</span> Show API Calls
						</Text>
          </div>
          <div id="spacer" style={{height: menuLineSpacing}} />
          {false && <div onClick={toggleShowDebugPanel}>
						<Text fontSize={menuFontSize} fontWeight="bold" color={window.getTheme().appBarMenuTextColor}>
							<span style={{display: "inline-block", width: "0.9em", backgroundColor: "none" }}>{showDebugPanel ? <>&#10003;</> : <>&nbsp;</>}</span> Show Debug Panel
						</Text>
          </div>}
          <div id="spacer" style={{height: menuLineSpacing}} />
          <div id="div-menu-separator" style={{borderTop: "1px solid lightGray", margin: "0.3em 0 0.3em 1.3em"}} />
          <div id="spacer" style={{height: menuLineSpacing}} />
          <div  style={{margin: "0 0 0 1.3em"}}>
            <Text fontSize={menuFontSize} fontWeight="bold" color={window.getTheme().appBarMenuTextColor}>
              Theme
            </Text>
            <div id="div-theme-switch" style={{margin: menuLineSpacing + " 0em 0em 1.0em"}}>
							<SimpleToggleSwitch mode="leftRight" switchToggledHandler={handleThemeSwitch} selectedOption={window.getTheme().name} options={['default', 'dark']} labels={[
								<Text fontSize="0.8em" fontWeight="normal" color={window.getTheme().appBarMenuTextColor}>Default</Text>,
								<Text fontSize="0.8em" fontWeight="normal" color={window.getTheme().appBarMenuTextColor}>Dark</Text>
							]} />
            </div>
          </div>
        </div>
      </Menu>
    </span>
  );
}
