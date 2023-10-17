import * as React from 'react';
import FileTile from './FileTile.js';
import Icon from './Icon.js';
import Text from './Text.js';

export default function TileFileView(props) {

  const handleFileSelect = (filename, fileType) => {
    //if (fileType == "folder") 
    props.fileClickedHandler(filename)
  }

  if (false) return (
    <div style={{ display: "flex", justifyContent: "left", alignItems: "left", textAlign: "left"}}>
      {
        props.files !== undefined && Object.keys(props.files).map((key, index) => {
          //const fileType = props.files[key].hasOwnProperty("type") ? props.files[key]["type"] : "folder"
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
        props.files !== undefined && Object.keys(props.files).length == 0 && 
          <span style={{paddingLeft: "2.1em"}}>
            <Text>
              <i>No files found...</i>
            </Text>
          </span>
      }
      { 
        props.files !== undefined && Object.keys(props.files).map((key, index) => {
          const fileType = key.startsWith("/") ? "folder" : props.files[key].type
          return (
              <div key={"file" + key} id={fileType + "-" + key} onClick={(event) => handleFileSelect(key, fileType)} style={{marginTop: "0.0em", width: "100px", margin: "10px", textAlign: "center", lineHeight: "2.1em"}}>
                <FileTile
                  fileType={fileType}
                  filename={key}
                  thumbnail={props.files[key].thumbnail}
                />
              </div>
           )
        })
      }
    </div>
  );


}
