import * as React from 'react';
import MuiTable from './MuiTable.js';


//
// A dependency wrapper for a third-party table implementation.  Ideally we would do minimal customizations
// inside the (e.g. MuiTable) table implementation, and manage customizations (such as colors here).
//
//
//
export default function NewTable(props) {

const headerShading = window.getTheme().shadedBoxColor

const _data = {
  "/tmp": {
    "/hsperfdata_root": {
      "group": "root",
      "lastModified": "Nov 5 18:37",
      "name": "hsperfdata_root",
      "permissions": "drwxr-xr-x",
      "type": "directory",
      "user": "root"
    },
    "/v8-compile-cache-0": {
      "group": "root",
      "lastModified": "Nov 4 15:33",
      "name": "v8-compile-cache-0",
      "permissions": "drwxr-xr-x",
      "type": "directory",
      "user": "root"
    },
    "/yarn--1699112031805-0.3696591184092892": {
      "group": "root",
      "lastModified": "Nov 4 15:33",
      "name": "yarn--1699112031805-0.3696591184092892",
      "permissions": "drwxr-xr-x",
      "type": "directory",
      "user": "root"
    },
    "/yarn--1699112031805-0.9669363915476075": {
      "group": "root",
      "lastModified": "Nov 4 15:33",
      "name": "yarn--1699112031805-0.9669363915476075",
      "permissions": "drwxr-xr-x",
      "type": "directory",
      "user": "root"
    },
    "/yarn--1699112055878-0.005284089823476501": {
      "group": "root",
      "lastModified": "Nov 4 15:34",
      "name": "yarn--1699112055878-0.005284089823476501",
      "permissions": "drwxr-xr-x",
      "type": "directory",
      "user": "root"
    },
    "core-js-banners": {
      "group": "root",
      "lastModified": "Nov 4 15:33",
      "name": "core-js-banners",
      "permissions": "-rw-r--r--",
      "size": 679,
      "type": "unknown",
      "user": "root"
    }
  }
}


var rows = [
  [1, 'Cupcake', 305, 3.7, 67, 4.3], 
  [2, 'Donut', 452, 25.0, 51, 4.9], 
  [3, 'Eclair', 262, 16.0, 24, 6.0], 
  [4, 'Frozen yoghurt', 159, 6.0, 24, 4.0], 
  [5, 'Gingerbread', 356, 16.0, 49, 3.9], 
  [6, 'Honeycomb', 408, 3.2, 87, 6.5], 
  [7, 'Ice cream sandwich', 237, 9.0, 37, 4.3], 
  [8, 'Jelly Bean', 375, 0.0, 94, 0.0], 
  [9, 'KitKat', 518, 26.0, 65, 7.0], 
  [10, 'Lollipop', 392, 0.2, 98, 0.0], 
  [11, 'Marshmallow', 318, 0, 81, 2.0], 
  [12, 'Nougat', 360, 19.0, 9, 37.0], 
  [13, 'Oreo', 437, 18.0, 63, 4.0], 
];

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

//
// Creates the header columns array needed by the Mui Table
//
function getHeadCells(columns, sampleRow) {
  var headCells = []
  columns.map((column, index) => { headCells.push({
    id: column, 
    disablePadding: !window.isNumeric(sampleRow[index + 1]),
    label: column[0].toUpperCase() + column.slice(1),
    numeric: window.isNumeric(sampleRow[index + 1])
  })})
  headCells[0].disablePadding = true
  return headCells
}


//const _rows = convertJsonDataToTableArray(window.convertJsonChildrenToArrayOfJsonObjects(data[Object.keys(data)[0]]), columns)
const _rows = props.data
const _headCells = getHeadCells(props.columnLabels, _rows[0])

//debugger
/*
var headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Name'
  },
  {
    id: 'calories',
    numeric: true,
    disablePadding: false,
    label: 'Calories',
  },
  {
    id: 'fat',
    numeric: true,
    disablePadding: false,
    label: 'Fat (g)',
  },
  {
    id: 'carbs',
    numeric: true,
    disablePadding: false,
    label: 'Carbs (g)',
  },
  {
    id: 'protein',
    numeric: true,
    disablePadding: false,
    label: 'Protein (g)',
  },
];
*/
  const itemSelectCallback = (id) => {
    props.itemSelectCallback(id)
  }

  return (
    <div id="div-new-table" style={{backgroundColor: "none", margin: "auto"}}>
      <MuiTable 
        rows={_rows}
        headCells={_headCells}
        headerShading={headerShading}
        itemSelectCallback={itemSelectCallback}
      />
    </div>
  );

}
