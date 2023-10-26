import * as React from 'react';
import FileTile from './FileTile.js';
import Icon from './Icon.js';
import Text from './Text.js';

export default function TileFileView(props) {

  const folderInfo = props.files !== undefined ? props.files[Object.keys(props.files)[0]] : null

  const handleFileSelect = (filename, fileType) => {
    //if (fileType == "folder") 
    props.fileClickedHandler(filename)
  }

  if (false) return (
    <div style={{ display: "flex", justifyContent: "left", alignItems: "left", textAlign: "left"}}>
      {
        folderInfo != null && Object.keys(folderInfo).map((key, index) => {
          const fileType = key.startsWith("/") ? "folder" : "other"
          return (
              <span key={"file" + key} id={fileType + "-" + key} onClick={(event) => handleFileSelect(key, fileType)}>
                <FileTile
								  fileType={fileType}
								  filename={key}
							  />
              </span>
           )
        })
      }
    </div>
  );

  return (
    <div id="div-tile-file-view" style={{   display: "flex", flexWrap: "wrap", paddingTop: "0.0em"}}>
      {
        folderInfo != null && Object.keys(folderInfo).length == 0 && 
          <span style={{paddingLeft: "2.1em"}}>
            <Text>
              <i>No files found...</i>
            </Text>
          </span>
      }
      { 
        folderInfo != null && Object.keys(folderInfo).map((key, index) => {
          const fileType = key.startsWith("/") ? "folder" : folderInfo[key].type
          return (
              <div key={"file" + key} id={fileType + "-" + key} onClick={(event) => handleFileSelect(key, fileType)} style={{marginTop: "0.0em", width: "100px", margin: "10px", textAlign: "center", lineHeight: "2.1em"}}>
                <FileTile
                  fileType={fileType}
                  filename={key}
                  thumbnail={folderInfo[key].thumbnail}
                />
              </div>
           )
        })
      }
    </div>
  );


}
