import * as React from 'react';
import FileListItem from './FileListItem.js';
import Icon from './Icon.js';
import Text from './Text.js';
import NewTable from './NewTable.js'

export default function ListFileView(props) {

  const folderInfo = props.files !== undefined ? props.files[Object.keys(props.files)[0]] : null

  const handleFileSelect = (filename) => {
    props.fileClickedHandler(filename)
  }

  
  const columns = props.tableSize == "small" ? ["name", "size", "permissions", "lastModified"]  : ["name", "size", "permissions", "user", "group", "lastModified"]

  //
  // Takes only the values of the items in [jsonData] (an array) and creates a 2D array of rows
  // of these values in the order specified in [columns]
  //
  function convertJsonDataToTableArray(jsonData, columns) {
    var _data = []
    jsonData.map((object, index) => {
      // This is a hack to "clean" the data when we're in demo mode, and make the fake data conforming
      if (!object.hasOwnProperty("type") && object['key'].startsWith("/")) object['type'] = "directory"
      if (!object.hasOwnProperty("permissions")) {
        if (object['type'] == "directory") object['permissions'] = "drwxr-xr-x"
        else object['permissions'] = "-rwxr-xr-x"
      }
      if (!object.hasOwnProperty("name")) object['name'] = object['key'].replace("/", "")
      if (!object.hasOwnProperty("user")) {
        object['group'] = "root"
        object['user'] = "root"
        object['lastModified'] = "Nov 4 15:33"
      }
      //   /end hack
      var row = []
      if ("type" in object) {
        if (object["type"] == "text") row.push(<Icon name="TextFile" transform="scale(0.95)" color={window.getTheme().fileManagerIconColor}/>)
        else if (object["type"] == "directory") row.push(<Icon name="Folder" transform="scale(0.95)" color={window.getTheme().fileManagerIconColor}/>)
        else row.push(<Icon name="GenericFile" transform="scale(0.95)" color={window.getTheme().fileManagerIconColor}/>)
      }
      row.push(object['key'])
      columns.map((column) => {
        row.push(object[column])
      })
      _data.push(row)
    })
    return _data
  }

  var rows = convertJsonDataToTableArray(window.convertJsonChildrenToArrayOfJsonObjects(folderInfo), columns)
  
  return (
    <div id="div-list-file-view" style={{justifyContent: "center", width: "100%"}}>
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
