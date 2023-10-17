import * as React from 'react';
import Icon from './Icon';
import Text from './Text';

export default function FileListItem({fileType = "unknown", filename = "unknown", fileSize = "0 KB", fileClickedHandler}) {

  const iconColor=window.getTheme().fileManagerIconColor

  var fileDisplayName = "Unknown"
  if (filename !== "undefined") {
    if (filename.startsWith("/")) fileDisplayName = filename.substring(1, filename.length)
    else fileDisplayName = filename
  }
  
  const renderTileImage = (fileType) => {
          switch (fileType) {
            case 'folder':
              return <span style={{ margin: "auto", padding: "none", display: "block"}}>
                       <Icon
                         name="Folder"
                         transform="scale(1.0)"
                         color={iconColor}
                       />
                     </span>
            case 'text':
              return <span id="icon" style={{margin: "auto",  padding: "0em 0em 0em 0em", display: "block"}}>
                       <Icon
                         name="TextFile"
                         transform="scale(1.0)"
                         color={iconColor}
                       />
                     </span>
            default: 
              return <span style={{margin: "auto",  padding: "none", display: "block"}}>
                       <Icon 
                         name="GenericFile"
                         transform="scale(1.0)"
                         color={iconColor}
                       />
                     </span>
          }
  }

  return (
    <div>
       <div id="div-inner-margin" style={{marginLeft: "2.7em" }}>
          <div id="div-row" style={{display: "table",  padding: "0em"}}>
            <div style={{display: "table-row", padding: "0em" }}>
              <div id="div-file-icon" style={{padding: "none", textAlign: "left", width: "1.5em", display: "table-cell", verticalAlign: "middle", cursor: "pointer"}} onClick={(event) => fileClickedHandler(filename, fileType)}>
                {(fileType !== undefined) && renderTileImage(fileType)}
              </div>
              <div id="div-list" style={{display: "table-cell", width: "8.4em", padding: "0em 0em 0.3em 0.2em",  textAlign: "left", verticalAlign: "middle"}}>
                <Text fontSize="0.8em">
                  {window.truncateText(fileDisplayName, 20)}
                </Text>
              </div>
              {
                fileType != "folder" && (
                  <div id="div-size" style={{display: "table-cell", padding: "0em 0em 0.3em 0.2em",  textAlign: "left", verticalAlign: "middle"}}>
                    <Text fontSize="0.8em">
                      {fileSize}
                    </Text>
                  </div>
              )}
            </div>
          </div>
       </div>
    </div>
  )

}
