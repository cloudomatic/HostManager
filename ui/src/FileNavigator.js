import * as React from 'react';
import Text from './Text.js';

export default function FileNavigator(props) {

  const handleClick = (event) => {
    const newPath = props.currentFilesystemView.split("/").slice(0, parseInt(event.currentTarget.id.replace("path-", "")) + 1).join("/")
    if (newPath == "") props.folderClickedHandler("/")
    else props.folderClickedHandler(newPath)
  }

  return (
        <div id="cli-root-div" style={{ cursor: "pointer"}}>
          <Text fontSize="0.9em" color={window.getTheme().textColor}>
            <span id="path-0" onClick={handleClick}>
            /
            </span>
            {
              (props.currentFilesystemView !== undefined) && props.currentFilesystemView.split("/").slice(1).map((key, index) => (
                <span id={"path-" + (index + 1)} onClick={handleClick} key={"key-" + key}> > {key} </span>
              ))
            }
          </Text>
        </div>
  );

}
