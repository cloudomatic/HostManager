import * as React from 'react';

import AppBarLite from './AppBarLite'
import CLI from './CLI'
import EmptyComponent from './EmptyComponent'
import FileManager from './FileManager'
import FetchExample from './FetchExample'
import HostDashboard from './HostDashboard'
import MobileNavigationPanel from './MobileNavigationPanel'
import NavigationDrawer from './NavigationDrawer'
import SampleExtension from './SampleExtension'
import XComponent from './XComponent'

/*
  Issues:

    After the CLI has returned a response, you have to keydown to drop the scrollbar to the prompt

    File preview window has responsiveness problems, doesn't drop below the file tile/list panel
*/

export default function HostManager() {

  var username = "NOT_AUTHENTICATED"
  var drawerIntentionallyOpen = window.getDisplaySetting("drawerPinnedOpen")
  var displaySettings = window.getDisplaySettings()

  const [drawerOpen, setDrawerOpen] = React.useState( false )
  const [currentlySelectedPage, setCurrentlySelectedPage] = React.useState(null)
  const [drawerPinnedOpen, setDrawerPinnedOpen] = React.useState(false)
  const [windowDimensions, setWindowDimensions] = React.useState(window.getWindowDimensions());
  const pageNameFromUrl = window.getParameter(window.location.search, "c")

  // Content for the left side menu bar.  The id property is the text on the menu item as well
  // as the component name.  Icons are implemented in Icon.js
  const menuContent = [
    {
      "name" : "Command Prompt",
      "id" : "CLI",
      "icon" : "<TerminalIcon>",
      "children" : null
    },
    {
      "name" : "File System",
      "id" : "FileManager",
      "icon" : "<FolderOpenIcon>",
      "children" : null
    },
    {
      "name" : "Sample Extension",
      "id" : "SampleExtension",
      "icon" : "<ExtensionIcon>",
      "children" : null
    }
  ]

  //
  // The navigation controller function.  Sets the main component area to the selected component
  //
  const navigationController = (componentName) => {
    setCurrentlySelectedPage(componentName)
  }

  // Set the active component in the main view
  var activeComponent = null
  //if (currentlySelectedPage != "ShowSettings") setCurrentlySelectedPage("ShowSettings")

  if ((currentlySelectedPage == null) && (pageNameFromUrl == null)) {
    activeComponent=null
    // If this is a "normal" homepage, hide the navigators
    // hideAppBar = true
    // hideDrawer = true
  } else if ((currentlySelectedPage == null) && (pageNameFromUrl != null)) {
    setCurrentlySelectedPage(pageNameFromUrl)
  }

  if (currentlySelectedPage == "EmptyComponent") { activeComponent = <EmptyComponent /> }
  else if (currentlySelectedPage == "CLI") { activeComponent = <CLI /> }
  else if (currentlySelectedPage == "FileManager") { activeComponent = <FileManager /> }
  else if (currentlySelectedPage == "HostDashboard") { activeComponent = <HostDashboard /> }
  else if (currentlySelectedPage == "SampleExtension") { activeComponent = <SampleExtension /> }
  else if (currentlySelectedPage == "FetchExample") { activeComponent = <FetchExample /> }
  else if (currentlySelectedPage == "X") { activeComponent = <XComponent /> }
  else { activeComponent = <HostDashboard /> }

  if ((currentlySelectedPage != null) && (pageNameFromUrl != currentlySelectedPage)) {
    var existingQueryString = ""
    window.history.pushState(null, null, "?c=" + currentlySelectedPage + existingQueryString)
  }


  // We need to set the width of the main component area based on whether the left-side navigation drawer
  // is open or closed.
  var appBarSpacerHeight="3em"
  var mainComponentAreaWidth = "94%"
  var marginLeft = "1.0em"

  if (drawerOpen || drawerPinnedOpen) {
    // Shift the component so the drawer doesn't cover it
    mainComponentAreaWidth = "84%"
    marginLeft = "6.66em"
  } else marginLeft = "1.0em"

  var mainComponentAreaHeight = "800px"
  /*
  if (displaySettings.hasOwnProperty("appBar") && displaySettings.appBar == "lightweight") {
    appBarSpacerHeight = "3em"
  }
  */

  //const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)

  React.useEffect(() => {
    function handleResize() {
      setWindowDimensions(window.getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  document.body.style.backgroundColor=window.getTheme().componentAreaBackgroundColor
  return (
        <div id="app-root-div" style={{backgroundColor: window.getTheme().componentAreaBackgroundColor}}>
            {
              !window.getDisplaySetting("fullscreenMode") && (windowDimensions.width > 700) && 
                                  <NavigationDrawer
                                    menuContent={menuContent}
                                    navigationController={navigationController}
                                    drawerState={{ parentFormDrawerState: [ drawerOpen, setDrawerOpen ] }}
                                    drawerPinnedOpenState={{ parentFormDrawerPinnedOpenState: [ drawerPinnedOpen, setDrawerPinnedOpen ] }}
                                  />
            }
          <div id="div-app-bar">
            <AppBarLite />
          </div>
          <div id="active-component-container-parent" style={{ backgroundColor: window.getDisplaySetting("backgroundColor"), width : mainComponentAreaWidth, height : mainComponentAreaHeight, margin: "auto", transition: "width 0.25s" }}>
            {(windowDimensions.width > 700) && <div id="spacer-to-force-content-below-app-bar" style={{ height : appBarSpacerHeight }} />}
            {
              (windowDimensions.width < 700) &&
                <div>
                  <MobileNavigationPanel
                    menuContent={menuContent}
                    navigationController={navigationController}
                  />
                </div>
            }
            {/*
            <div style={{marginLeft: "200px"}}>
              {windowDimensions.width}
            </div>
            */}
            <div id="active-component-container" style={{ height: "100%", width: "99%", "paddingTop": "0", paddingRight: "5px", paddingBottom: "0px", paddingLeft: "1.2em", marginLeft: marginLeft }} >
                {activeComponent}
            </div>
          </div>
        </div>
  );

}
