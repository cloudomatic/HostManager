import * as React from 'react';
import FileListItem from './FileListItem.js';
import Icon from './Icon.js';
import Text from './Text.js';

export default function ListFileView(props) {

  const folderInfo = props.files !== undefined ? props.files[Object.keys(props.files)[0]] : null

  const handleFileSelect = (filename, fileType) => {
    //if (fileType == "folder") 
    props.fileClickedHandler(filename)
  }

  return (
    <div id="div-tile-file-view" style={{   paddingTop: "0.0em"}}>
      {
        folderInfo !== undefined && Object.keys(folderInfo).length == 0 && 
          <span style={{paddingLeft: "2.1em"}}>
            <Text>
              <i>No files found...</i>
            </Text>
          </span>
      }
      { 
        folderInfo !== undefined && Object.keys(folderInfo).map((key, index) => {
          const fileType = key.startsWith("/") ? "folder" : folderInfo[key].type
          return (
              <div key={"file" + key} id={fileType + "-" + key} onClick={(event) => handleFileSelect(key, fileType)} style={{margin: "0px"}}>
                <FileListItem
                  fileType={fileType}
                  filename={key}
                  fileSize={folderInfo[key].size}
                  fileClickedHandler={handleFileSelect}
                />
              </div>
           )
        })
      }
    </div>
  );


}
