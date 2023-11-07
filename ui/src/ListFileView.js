import * as React from 'react';
import FileListItem from './FileListItem.js';
import Icon from './Icon.js';
import Text from './Text.js';
import NewTable from './NewTable.js'

export default function ListFileView(props) {

  const folderInfo = props.files !== undefined ? props.files[Object.keys(props.files)[0]] : null

  const handleFileSelect = (filename, fileType) => {
    //if (fileType == "folder") 
    debugger
    props.fileClickedHandler(filename)
  }

  const columns = ["name", "size", "permissions", "user", "group", "lastModified"]
  //
  // Takes only the values of the items in [jsonData] (an array) and creates a 2D array of rows
  // of these values in the order specified in [columns]
  //
  function convertJsonDataToTableArray(jsonData, columns) {
    var _data = []
    jsonData.map((object, index) => {
      var row = [object['name']]
      columns.map((column) => {
        row.push(object[column])
      })
      _data.push(row)
    })
    return _data
  }

  const rows = convertJsonDataToTableArray(window.convertJsonChildrenToArrayOfJsonObjects(folderInfo), columns)

  return (
    <div id="div-list-file-view" style={{justifyContent: "center", width: "100%"}}>
      {
        folderInfo !== undefined && Object.keys(folderInfo).length == 0 &&
          <span style={{paddingLeft: "2.1em"}}>
            <Text>
              <i>No files found...</i>
            </Text>
          </span>
      }
      {
        folderInfo !== undefined && Object.keys(folderInfo).length > 0 && <div style={{}}>
          <NewTable
            data={rows}
            columnLabels={columns}
            itemSelectCallback={handleFileSelect}
          />
        </div>
      }
    </div>
  )



}
