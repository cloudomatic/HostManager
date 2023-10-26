import * as React from 'react';
import Icon from './Icon';
import Text from './Text';

export default function FileTile(props) {

  const fileDisplayName = props.filename !== "undefined" ? 
                          (
                            props.filename.startsWith("/") ? props.filename.substring(1, props.filename.length) : props.filename
                          )
                          : 
                          "unknown"

  const iconColor=window.getTheme().fileManagerIconColor

  const renderTileImage = (fileType, thumbnail) => {
          switch (fileType) {
            case 'image': 
              return <img 
                src={thumbnail}
                style={{margin: "auto", padding: "none", display: "block", maxWidth: "5.7em", justifyContent: "center", maxHeight: "2.3em"}}
              /> 
            case 'folder':
              return <span style={{marginTop: "0.2em", padding: "none", display: "block"}}>
                       <Icon
                         name="Folder"
                         transform="scale(2.7)"
                         color={iconColor}
                       />
                     </span>
            case 'text':
              return <span style={{marginTop: "0.2em",  padding: "none", display: "block"}}>
                       <Icon
                         name="TextFile"
                         transform="scale(2.2)"
                         color={iconColor}
                       />
                     </span>
            default: 
              return <span style={{marginTop: "0.2em",  padding: "none", display: "block"}}>
                       <Icon 
                         name="GenericFile"
                         transform="scale(2.2)"
                         color={iconColor}
                       />
                     </span>
          }
  }


  return (
    <div id="div-file-tile" style={{cursor: "pointer"}}>
      <div id="div-file-icon" style={{padding: "0em 0em 0em 0em"}}>
        {(props.fileType !== undefined) && renderTileImage(props.fileType, props.thumbnail)}
      </div>
      <div id="div-file-name" style={{ padding: "0em 0em 0em 0em", margin: "none"}}>
        <Text fontSize="0.8em">
          {window.truncateText(fileDisplayName, 12)}
        </Text>
      </div>
    </div>
  );

}
