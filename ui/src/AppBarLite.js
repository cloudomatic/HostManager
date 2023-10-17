import * as React from 'react';
import Icon from './Icon';
import ProfileButton from './ProfileButton';
import SettingsButton from './SettingsButton';
import Text from './Text';
import AppBar from '@mui/material/AppBar';


// https://jsfiddle.net/yX3p9/7/

export default function AppBarLite() {

  //const iconColor="rgb(139, 139, 143)"
  //const iconColor="rgb(58, 63, 79)"
  //const iconColor="rgb(70, 76, 97)"
  //const iconColor="blue"
  const iconColor=window.getFileManagerIconColor()

  return (
    <AppBar color="transparent" position="fixed" elevation={0} >
    <div id="div-app-bar" style={{display: "table", backgroundColor: window.getTheme().appBarBackgroundColor, width: "100%", margin: "0 0 0 0"}}>
      <div id="div-app-bar-top-row" style={{display: "table-cell", margin: "0 1.9vw 0 0", verticalAlign: "middle"}}>
        <div id="div-left-side-icons" style={{float: "left"}}>
          <span></span>
        </div>
        <div id="div-right-side-icons" style={{float: "right", marginRight: "1vw"}}>
          <span style={{verticalAlign: "middle", marginRight: "0em"}}>
            <SettingsButton />
          </span>
          <span style={{verticalAlign: "middle", marginRight: "0em"}}>
            <ProfileButton />
          </span>
          <span>
            <Text fontSize="0.9em" fontWeight="bold">
            </Text>
          </span>
        </div>
      </div>
    </div>
    </AppBar>
  )

}
