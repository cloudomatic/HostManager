import * as React from 'react';
import MuiTable from './MuiTable.js';


//
// A dependency wrapper for a third-party table implementation.  Ideally we would do minimal customizations
// inside the (e.g. MuiTable) table implementation, and manage customizations (such as colors here).
//
// The input data is an array of rows, where the row is:
//
//        [ <Icon />, id, column1, column2, etc... ]
//
// <Icon /> will be rendered if present in the left-most column, [id] will be passed in the itemSelectCallback() function
//
export default function NewTable(props) {

  const headerShading = window.getTheme().shadedBoxColor

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

  const itemSelectCallback = (id) => {
    props.itemSelectCallback(id)
  }

  return (
    <div id="div-new-table" style={{backgroundColor: "none", margin: "auto"}}>
      <MuiTable 
        rows={props.data}
        headCells={getHeadCells(props.columnLabels, props.data[0])}
        headerShading={headerShading}
        itemSelectCallback={itemSelectCallback}
      />
    </div>
  );

}
