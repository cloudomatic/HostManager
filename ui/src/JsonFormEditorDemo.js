import React from 'react';
import JsonFormEditor from './JsonFormEditor.js';

export default function  JsonFormEditorDemo(props) {

  const [jsonObject, setJsonObject] = React.useState({
      "customer": "dudeperfect-01293",
      "knownAliases": ["the dude", "his dudeness", "dudikoff"],
      "mailingAddress": {
         "streetNumber": 2617,
         "streetName": "Rodeo Drive",
         "city": "Dallas",
         "state": "Texas"
      },
      "pets": [ {"kind":"dog", "age":2}, {kind:"cat", "age": 10} ],
      "agesOfAnyAdultChildren": [31, 24],
      "name" : {
        "first": "Dude",
        "last": "Perfect"
      }
    }
  )

  const [sourceJsonText, setSourceJsonText] = React.useState(JSON.stringify(jsonObject, null, 2))


  const handleBaseJsonObjectFieldChange = (event) => {
    setSourceJsonText(event.target.value)
    try {
      setJsonObject(JSON.parse(event.target.value))
      //setFlattenedJsonObject(window.convertJsonObjectToFlatObject(jsonObject, { lineNumber: 0}, 0))
      //setReconstructedJsonObject(window.convertFlatObjectBackToJsonObject(flattenedJsonObject, jsonObject, 0, 0, {lineNumber: 0}))
    } catch (error) { 
      debugger
      console.log(error)
    }

  }


/*
  const getSwankyForm = () => {
          Object.keys(flattenedJsonObject).map((key) => {
            if (key != "lineNumber") return (
              <React.Fragment>
                <div style={{ paddingLeft: "0.4em"}}>
                  {
                    flattenedJsonObject[key]['key'] != "" ?
                      <>
                      {getPadding(flattenedJsonObject[key].indentLevel)}
                      {camelCaseConvertor(flattenedJsonObject[key]['key'])}
                      <input id={"row-key-" + key} type="text" onBlur={(event) => handleKeyChange(event, key)}
                             placeholder = "" style={{paddingLeft: "0.4em", fontFamily: '"Roboto"', fontSize: "0.9em", border: "none", height: "1.4em", width: "100%", padding: "none"}}
                      />
                      </>
                      : <div></div>
                  }
                </div>
                <div style={{ border: "1px solid #e6e6e6"}}>
                  {
                    flattenedJsonObject[key].value !== undefined ?
                    <input id={"row-" + key} type="text" value={flattenedJsonObject[key]["value"] !== undefined ? flattenedJsonObject[key]["value"] : ""}
                              onChange={(event) => handleTextFieldChange(event, key)} className=""
                              placeholder = "" style={{paddingLeft: "0.4em", fontFamily: '"Roboto"', fontSize: "0.9em", border: "none", height: "1.4em", width: "100%", padding: "none"}}
                    />
                    :
                    <div>
                      {
                        (false) ? (
                          <div>
                            <img onClick={(event) => handleAddButtonClick(event, key)} src="tiny-add-button.png" style={{ height: "0.9em", width: "0.9em"}} />
                          </div>
                        ) : <div></div>
                      }
                    </div>
                  }
                </div>
              </React.Fragment>
            )
          })
  }

  //
  // Build a form that looks like your typical IDE property inspector
  //
  const getPropertyInspector = () => {
       
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


    const inspectorStyles = {
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
        setFlattenedJsonObject(_flattenedJsonObject)
      }
    }

    if (true) return (
      <div style={{ width: "30em", height: "20em", overflow: "auto"}}>
        <div style={inspectorStyles.grid}>
          {
            Object.keys(flattenedJsonObject).map( (key, index) => {
              if (key !== "lineNumber") {
                const propertyValue = flattenedJsonObject[key]["key"]
                const cellValue = flattenedJsonObject[key]["value"]
                const indentationPadding =(flattenedJsonObject[key]["indentLevel"] * 1 + 0.5) + "em"
                const cellShading = inspectorStyles.grid.shadingColors[flattenedJsonObject[key]["indentLevel"]]
                if (cellValue !== undefined) {
                  return (
                    <div style={inspectorStyles.row}>
                      <div style={{...inspectorStyles.cell, ...inspectorStyles.propertyNameCell, paddingLeft: indentationPadding, backgroundColor: cellShading}}>{getCamelCaseDisplayName(propertyValue)}</div>
                      <div style={{...inspectorStyles.cell, ...inspectorStyles.propertyValueCell, backgroundColor: inspectorStyles.grid.inputCellColor}}>
                        <input className="Input"
                          id={"row-" + key} 
                          type="text" 
                          value={flattenedJsonObject[key]["value"] !== undefined ? flattenedJsonObject[key]["value"] : ""}
                          onChange={(event) => handleInspectorPropertyChanged(event, key)} 
                          placeholder = "" style={inspectorStyles.textInput} 
                        />
                      </div>
                    </div>
                  )
                } else if (true) { 
                  return  (
                    // We want the left side cell to colspan=2, which is not supported by CSS display: table
                    <div style={inspectorStyles.row}>
                      <div style={{...inspectorStyles.cell, ...inspectorStyles.propertyNameCell, borderRight: "none", paddingLeft: indentationPadding, backgroundColor: cellShading}}>{getCamelCaseDisplayName(propertyValue)}</div>
                      <div style={{...inspectorStyles.cell, ...inspectorStyles.propertyValueCell, borderLeft: "none", backgroundColor: cellShading}}></div>
                    </div>
                  )
                } else {
                  return  (
                    <div style={{ height: "0.1em", backgroundColor: "black", width: "100%"}}>
                      <div style={{...inspectorStyles.cell, ...inspectorStyles.propertyNameCell, borderRight: "none", backgroundColor: "black", height: "0.1em"}}></div>
                      <div style={{...inspectorStyles.cell, ...inspectorStyles.propertyValueCell, borderLeft: "none", height: "0.1em", backgroundColor: "black"}}></div>
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
*/

  const jsonPropertyInspectorChanged = (json) => {
    setJsonObject(json)
  }

  return (
      <>
        <div>
          <div style={{display: "flex", flexWrap: "wrap", backgroundColor: "none", justifyContent: "center"}}>
            <div id="source-json-input" style={{border: "1px solid black", backgroundColor: "none", fontSize: "0.8em"}}>
              <div style={{padding: "0.5em", backgroundColor: "lightGray"}}>Source JSON</div>
              <pre>
                <textarea id="baseJsonObject"
                  type="text"
                  cols="80"
                  rows="30"
                  value={sourceJsonText}
                  placeholder=""
                  onChange={(event) => handleBaseJsonObjectFieldChange(event)}
                  style={{ paddingLeft: "0.4em", fontFamily: '"Roboto", "Helvetica", "Arial", "sans-serif"', fontSize: "0.9em", border: "none"}}
                />
              </pre>
            </div>
            &nbsp;
            <div style={{ width: "20em", height: "20em"}}>
              <JsonFormEditor json={jsonObject} onChangeCallback={jsonPropertyInspectorChanged} defaultView="table" />
            </div>
            &nbsp;
            <div id="item-1" style={{border: "1px solid black",fontSize: "0.8em", width: "20em", backgroundColor: "none"}} >
              <div style={{padding: "0.5em", backgroundColor: "lightGray"}}>JSON as modified by the form</div>
              <pre>
                {JSON.stringify(jsonObject, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </>
  )

}
