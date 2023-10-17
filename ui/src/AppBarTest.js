import * as React from 'react';
import Icon from './Icon';
import Text from './Text';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

// https://jsfiddle.net/yX3p9/7/

export default function AppBarTest() {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Dashboard
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {/*
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
        */}
        <div style={{margin: "0 1.0em 0 1.0em"}}>
          <div>
						<Text fontSize="0.9em" fontWeight="bold">
							Option 1
						</Text>
          </div>
          <div id="spacer" style={{height: "0.1em"}} />
          <div>
						<Text fontSize="0.9em" fontWeight="bold">
							Option 1
						</Text>
          </div>
        </div>
      </Menu>
    </div>
  );
}
