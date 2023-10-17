import * as React from 'react';
import StorageIcon from '@mui/icons-material/Storage';
import Icon from './Icon';
import Text from './Text';

export default function NavigationPanel(props) {

  const panelOpen = props.panelOpen !== undefined ? props.panelOpen : true
  const menuContent = props.menuContent !== undefined ? props.menuContent : []

  const handleMenuItemClick = (event) => {
    const menuItemId = event.currentTarget.id.includes("title-block") ? "dashboard" : event.currentTarget.id.replace("div-menu-item-", "")
    props.navigationController(menuItemId)
  }

  // href={"/?c=" + menuItem.id}

  return (
    <div id="navigation-panel-root" style={{
      padding: "2.0em 0em 0em 0.7em",
      margin: "auto"
    }}>
      <div id="div-title-block" style={{ display: "flex", alignItems: "center", cursor: "pointer"}} onClick={handleMenuItemClick}>
          <StorageIcon sx={{
                      transform: "scale(1.0)",
                      color: window.getTheme().primaryColorComplement,
                      minWidth: 0,
                      justifyContent: 'center',
          }}/>
          <Text padding="0em 0em 0.0em 0.9em" fontSize="1.1em" color={window.getTheme().primaryColorComplement} fontWeight="bold">
              Host Manager
          </Text>
      </div>
      <div id="header-spacer" style={{ paddingTop: "3.0em"}}/>
      <div>
        { menuContent.map((menuItem, index) => (
          <a key={"a-menu-item-" + menuItem.id} style={{textDecoration: "none"}}>
            <div id={"div-menu-item-" + menuItem.id} style={{marginBottom: "0.9em", display: "flex", alignItems: "center", cursor: "pointer"}} onClick={handleMenuItemClick}>
              <Icon name={menuItem.icon} color={window.getTheme().primaryColorComplement} />
              <Text padding="0em 0em 0em 0.9em" fontSize="0.9em" color={window.getTheme().primaryColorComplement} fontWeight="bold">
                  {menuItem.name}
              </Text>
            </div>
          </a>
        ))}
      </div>
    </div>
  );

}
