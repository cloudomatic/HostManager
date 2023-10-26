import * as React from 'react';
import Text from './Text.js';

//
// A breadcrumb-like filesystem path navigator
//
export default function FileNavigator(props) {

  const handleClick = (event) => {
    var newPath = props.currentFilesystemPath.split("/").slice(0, parseInt(event.currentTarget.id.replace("path-", "")) + 1).join("/")
    if (newPath == "") newPath = "/"
    newPath.replace("//", "/")
    props.folderClickedHandler(newPath)
  }

  return (
        <div id="cli-root-div" style={{ cursor: "pointer"}}>
          <Text fontSize="0.9em" color={window.getTheme().textColor}>
            <span id="path-0" onClick={handleClick}>
            /
            </span>
            {
              (props.currentFilesystemPath !== undefined) && props.currentFilesystemPath != "/" && props.currentFilesystemPath.split("/").slice(1).map((key, index) => (
                <span id={"path-" + (index + 1)} onClick={handleClick} key={"key-" + key}> > {key} </span>
              ))
            }
          </Text>
        </div>
  );

}
