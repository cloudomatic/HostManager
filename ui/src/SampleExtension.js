import * as React from 'react';
import Text from "./Text.js";
import ExpandingTileSet from "./ExpandingTileSet.js";
import SpinningNumbers from "./SpinningNumbers.js";
import SiteFooter from './SiteFooter.js';

export default function FileManager() {

  const [ fileSystem, setFileSystem ] = React.useState({ 
    "/" : {   
      "/var" : { },
      "/home" : { 
        "/guest": {
          "File.png" : {
          }
        }
      }
    } 
  })

  const sampleJSON = [
    {
      "name" : "Command Prompt",
      "id" : "CLI",
      "icon" : "TerminalIcon",
      "children" : null
    },
    {
      "name" : "File System",
      "id" : "FileManager",
      "icon" : "FolderOpenIcon",
      "children" : null
    },
    {
      "name" : "Sample Extension",
      "id" : "SampleExtension",
      "icon" : "ExtensionIcon",
      "children" : null
    }
  ]

  const preformattedHTML = <pre style={{whiteSpace: "break-word", marginLeft: "4.0em"}}>
  const menuContent = [
    &#123;
      "name" : "Command Prompt",
      "id" : "CLI",
      "icon" : "TerminalIcon",
    &#125;,
    &#123;
      "name" : "File System",
      "id" : "FileManager",
      "icon" : "FolderOpenIcon",
    &#125;,
    &#123;
      "name" : "Sample Extension",
      "id" : "SampleExtension",
      "icon" : "ExtensionIcon",
    &#125;
  ]
          </pre>


  return (
        <div id="extension-root-div">
          <Text fontSize="1.0em" padding="0em 0em 2.0em 0em" fontWeight="bold">
            Creating a UI Extension
          </Text>
          <div id="spacer" style={{ height: "2.0em" }} />
          <Text padding="1.0em 0.0em 0em 2.0em" fontSize="0.8em">
            The UI supports custom components written in React.
          </Text>
          <br /><br />
          <Text padding="1.0em 0.0em 0em 2.0em" fontSize="0.8em">
            Add the component to ui/src/*.js and &#60;HostManagerUI /&#62;, selecting a suitable icon from Icon.js (or adding one from the <a href="https://mui.com/material-ui/material-icons/" target="_mui">MUI library</a>), e.g.
          </Text>
          <pre style={{whiteSpace: "break-word", marginLeft: "4.0em", color: window.getTheme().textColor}}>
            {JSON.stringify(sampleJSON, null, 2)}
          </pre>
        </div>
  );

}
