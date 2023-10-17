import * as React from 'react';
import Icon from './Icon';
import Text from './Text';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

// https://jsfiddle.net/yX3p9/7/

export default function ProfileButton() {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const iconColor = window.getTheme().componentAreaIconColor

  return (
    <span>
      <IconButton
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{ minHeight: 0, minWidth: 0, padding: 0 }}

      >
        <Icon name="Profile" transform="scale(0.9)" color={iconColor} />
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
        <div style={{margin: "0 1.0em 0 1.0em"}}>
          <div>
						<Text fontSize="0.9em" fontWeight="bold" color={window.getTheme().appBarMenuTextColor}>
							Guest User
						</Text>
          </div>
        </div>
      </Menu>
    </span>
  );
}
