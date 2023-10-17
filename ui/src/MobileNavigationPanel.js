import * as React from 'react';
import Text from './Text';

//
// This component replaces NavigationPanel when the screen width is too small to properly display the left-side drawer
//
export default function MobileNavigationPanel(props) {

  //const panelOpen = props.panelOpen !== undefined ? props.panelOpen : true
  const menuContent = props.menuContent !== undefined ? props.menuContent : []

  const handleMenuItemClick = (event) => {
    const menuItemId = event.currentTarget.id.includes("title-block") ? "dashboard" : event.currentTarget.id.replace("div-menu-item-", "")
    props.navigationController(menuItemId)
  }

  return (
    <div id="navigation-panel-root" style={{
      padding: "2.0em 0em 0em 0.7em",
      margin: "auto"
    }}>
      <div id="div-title-block" style={{ display: "flex", alignItems: "center", cursor: "pointer"}} onClick={handleMenuItemClick}>
          <Text padding="0em 0em 0.0em 0.9em" fontSize="0.9em" color={window.getPrimaryColor()} fontWeight="bold">
              [Home]
          </Text>
      </div>
      <div id="header-spacer" style={{ paddingTop: "0.5em"}}/>
      <div style={{marginBottom: "1.0em"}} >
        { menuContent.map((menuItem, index) => (
          <a key={"a-menu-item-" + menuItem.id} style={{textDecoration: "none"}}>
            <div id={"div-menu-item-" + menuItem.id} style={{marginBottom: "0.5em", display: "flex", alignItems: "center", cursor: "pointer"}} onClick={handleMenuItemClick}>
              <Text padding="0em 0em 0em 0.9em" fontSize="0.9em" color={window.getPrimaryColor()} fontWeight="bold">
                  [{menuItem.name}]
              </Text>
            </div>
          </a>
        ))}
      </div>
    </div>
  );

}
