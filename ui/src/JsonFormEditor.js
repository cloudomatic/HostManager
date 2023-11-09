import React from 'react';
import Text from './Text.js';
import './JsonFormEditor.css';

export default function JsonFormEditor({json, view="table", onChangeCallback}) {

  //const [flattenedJsonObject, setFlattenedJsonObject] = React.useState(window.convertJsonObjectToFlatObject(json, { "lineNumber": 0}, 0))
  const flattenedJsonObject = window.convertJsonObjectToFlatObject(json, { "lineNumber": 0}, 0)

  const capitalizeWord = word => word.charAt(0).toUpperCase() + word.slice(1);

  const camelCaseConvertor = str => str.replace(/[A-Z]/g, letter => ` ${letter.toLowerCase()}`);

  function getCamelCaseDisplayName(phrase) {
    var newPhrase = ""
    var tokens = camelCaseConvertor(phrase).split(" ")
    for (var token in tokens) {
      newPhrase += capitalizeWord(tokens[token]) + " "
    }
    return newPhrase.trim()
  }

  const handleAddButtonClick = (key) => {
    var _flattenedJsonObject = JSON.parse(JSON.stringify(flattenedJsonObject))
    if (_flattenedJsonObject[key]["type"] === "object") {
      addFlattenedJsonObject(key)
    }
    else if (_flattenedJsonObject[key]["type"] === "array") {
      addArrayFlattenedJsonObject(key)
    } else alert("line " + key  + "  is a string")
  }

  const addFlattenedJsonObject = (lineNumber) => {
    var _flattenedJsonObject = JSON.parse(JSON.stringify(flattenedJsonObject))
    var _lineNumber = (typeof LineNumber === "string" ? parseInt(lineNumber, 10) + 1 : lineNumber + 1)
    _flattenedJsonObject["lineNumber"] = _flattenedJsonObject['lineNumber'] + 1
    var tempFlattenedJsonObject = JSON.parse(JSON.stringify(_flattenedJsonObject[_lineNumber]))
    if (_flattenedJsonObject[_lineNumber]["type"] === "object") {
      _flattenedJsonObject[_lineNumber]["key"] = "";
      _flattenedJsonObject[_lineNumber]["value"] = "";
      _flattenedJsonObject[_lineNumber]["type"] = "string";
      _flattenedJsonObject[_lineNumber]["indentLevel"] = _flattenedJsonObject[_lineNumber]["indentLevel"]  + 1;
    } else {
      _flattenedJsonObject[_lineNumber]["key"] = ""
      _flattenedJsonObject[_lineNumber]["value"] = ""
    }
    for (var i = _lineNumber + 1; i < _flattenedJsonObject["lineNumber"]; i++) {
      var tempObject = _flattenedJsonObject[i]
      _flattenedJsonObject[i] = tempFlattenedJsonObject
      tempFlattenedJsonObject = tempObject
    }
    //setFlattenedJsonObject(_flattenedJsonObject)
  }


  const addArrayFlattenedJsonObject = (lineNumber) => {
    var _flattenedJsonObject = JSON.parse(JSON.stringify(flattenedJsonObject))
    var _lineNumber = (typeof lineNumber === "string" ? parseInt(lineNumber, 10) : lineNumber)
    _flattenedJsonObject[_lineNumber]["length"] = _flattenedJsonObject[_lineNumber]["length"] + 1
    _lineNumber++
    _flattenedJsonObject["lineNumber"] = _flattenedJsonObject['lineNumber'] + 1
    var tempFlattenedJsonObject = JSON.parse(JSON.stringify(_flattenedJsonObject[_lineNumber]))
    var objectInArrayNum = 0
    for (var i = _lineNumber + 1; i < _flattenedJsonObject["lineNumber"]; i++) {
      var tempObject = flattenedJsonObject[i]
      _flattenedJsonObject[i] = tempFlattenedJsonObject
      if (_flattenedJsonObject[i]['key'].search(/\[(.+?)\]/g, "[" + objectInArrayNum + "]") > 1 ) {
        objectInArrayNum++
        _flattenedJsonObject[i]["key"] = _flattenedJsonObject[i]["key"].replace(/\[(.+?)\]/g, "[" + objectInArrayNum + "]")
      }
      tempFlattenedJsonObject = tempObject
    }
    _lineNumber = (typeof lineNumber === "string" ? parseInt(lineNumber, 10) + 2 : lineNumber + 2)
    _flattenedJsonObject["lineNumber"] = _flattenedJsonObject['lineNumber'] + 1
    var tempFlattenedJsonObject = JSON.parse(JSON.stringify(_flattenedJsonObject[_lineNumber]))
    if (_flattenedJsonObject[_lineNumber]["type"] === "object") {
      _flattenedJsonObject[_lineNumber]["key"] = ""
      _flattenedJsonObject[_lineNumber]["value"] = ""
      _flattenedJsonObject[_lineNumber]["type"] = "string"
      _flattenedJsonObject[_lineNumber]["indentLevel"] = _flattenedJsonObject[_lineNumber]["indentLevel"] + 1
    } else {
      _flattenedJsonObject[_lineNumber]["key"] = ""
      _flattenedJsonObject[_lineNumber]["value"] = ""
    } 
    //setFlattenedJsonObject(_flattenedJsonObject)
  }

       
    //
    // Find out what the longest property's (key, or left-side value in the display)
    // string length is, in order to set the left column width
    //
    const getLeftColumnWidth = (flattenedJsonObject) => {
      var longestString = 0
      for (var key in Object.keys(flattenedJsonObject)) {
        if (flattenedJsonObject[key] !== undefined && flattenedJsonObject[key].hasOwnProperty("key")) {
          const length = (1 * flattenedJsonObject[key]["indentLevel"]) + ((flattenedJsonObject[key]['key'] + "").length / 2)
          if (length > longestString) longestString = length
        }
      }
      return longestString
    }

    const __shadingColors = [
      "rgb(213, 216, 227)",
      "rgb(225, 227, 235)",
      "rgb(240, 241, 245)"
    ]

    const shadingColors = [
      "rgb()",
      "rgb()",
      "rgb()"
    ]

    const _shadingColors = [
      "gray",
      "lightGray",
      "green"
    ]

    const tableViewStyles = {
      notes: "Not all styles are defined here, the <input> element has a setting in JsonObjectEditorPanel.css",
      grid: {
        display: "table",
        width: "100%",
        borderBottom: "1px solid black",
        _backgroundColor: "green",
        inputCellColor: "white",
        shadingColors: [
          "#b1b7cc",
          "#c8ccdb",
          "#d8dbe6"
        ]
      },
      row: {
        display: "table-row",
        fontSize: "0.6em",
        fontWeight: "normal",
        _backgroundColor: "rgb(236, 235, 242)",
        backgroundColor: shadingColors[0],
        _border: "1px solid black",
        fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif"
      },
      cell: {
        border: "1px solid black",
        borderBottom: "none",
        display: "table-cell",
        padding: "0.25em",
      },
      propertyNameCell: {
        display: "table-cell",
        width: (getLeftColumnWidth(flattenedJsonObject) + 1) + "em"
      },
      propertyValueCell: {
        borderLeft: "none"
      },
      textInput: {
        backgroundColor: "white",
        fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif",
        fontSize: "0.8em"
      }
    }

   const handleInspectorPropertyChanged = (event, key) => {
      if (flattenedJsonObject[key]["type"] != "object") {
        var _flattenedJsonObject = JSON.parse(JSON.stringify(flattenedJsonObject))
        _flattenedJsonObject[key]["value"] = "" + event.target.value
        //setFlattenedJsonObject(_flattenedJsonObject)
      }
      onChangeCallback(window.convertFlatObjectBackToJsonObject(_flattenedJsonObject, json, 0, 0, {lineNumber: 0}))
   }

 return (
      <div style={{ width: "30em", height: "20em", overflow: "auto"}}>
        <div style={tableViewStyles.grid}>
          {
            Object.keys(flattenedJsonObject).map( (key, index) => {
              if (key !== "lineNumber") {
                const propertyValue = flattenedJsonObject[key]["key"]
                const cellValue = flattenedJsonObject[key]["value"]
                const indentationPadding =(flattenedJsonObject[key]["indentLevel"] * 1 + 0.5) + "em"
                const cellShading = tableViewStyles.grid.shadingColors[flattenedJsonObject[key]["indentLevel"]]
                if (cellValue !== undefined) {
                  return (
                    <div style={tableViewStyles.row}>
                      <div style={{...tableViewStyles.cell, ...tableViewStyles.propertyNameCell, paddingLeft: indentationPadding, backgroundColor: cellShading}}>{getCamelCaseDisplayName(propertyValue)}</div>
                      <div style={{...tableViewStyles.cell, ...tableViewStyles.propertyValueCell, backgroundColor: tableViewStyles.grid.inputCellColor}}>
                        <input className="Input"
                          id={"row-" + key} 
                          type="text" 
                          value={flattenedJsonObject[key]["value"] !== undefined ? flattenedJsonObject[key]["value"] : ""}
                          onChange={(event) => handleInspectorPropertyChanged(event, key)} 
                          placeholder = "" style={tableViewStyles.textInput} 
                        />
                      </div>
                    </div>
                  )
                } else if (true) { 
                  return  (
                    // We want the left side cell to colspan=2, which is not supported by CSS display: table
                    <div style={tableViewStyles.row}>
                      <div style={{...tableViewStyles.cell, ...tableViewStyles.propertyNameCell, borderRight: "none", paddingLeft: indentationPadding, backgroundColor: cellShading}}>{getCamelCaseDisplayName(propertyValue)}</div>
                      <div style={{...tableViewStyles.cell, ...tableViewStyles.propertyValueCell, borderLeft: "none", backgroundColor: cellShading, textAlign: "right"}}><span></span></div>
                    </div>
                  )
                } else {
                  return  (
                    <div style={{ height: "0.1em", backgroundColor: "black", width: "100%"}}>
                      <div style={{...tableViewStyles.cell, ...tableViewStyles.propertyNameCell, borderRight: "none", backgroundColor: "black", height: "0.1em"}}></div>
                      <div style={{...tableViewStyles.cell, ...tableViewStyles.propertyValueCell, borderLeft: "none", height: "0.1em", backgroundColor: "black"}}></div>
                    </div>
                  )
                }
              }
            })
          }
        </div>
      </div>
    )
  

}
