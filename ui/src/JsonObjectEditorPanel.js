import React from 'react';
/*
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
//import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
*/
import Text from './Text.js';
import './JsonObjectEditorPanel.css';

export default function  JsonObjectEditorPanel(props) {

/*
{
      "system": "test",
      "someOther": "property",
      "address": {
         "number": "2617",
         "street": "rodeo",
         "city": "Dallas",
         "state": "texas"
      },
      "name" : {
        "first": "Dude",
        "last": "perfect"
      }
    }

*/

  // 
  // Attempt to 'flatten' the jsonObject into an object of form:
  //
  // {
  //  "1": {
  //    key: "name",
  //   type: "string",
  //   value: "value",
  //   indentLevel: 0
  // }}
  //
  // where "1" is the line number of the flat object.  This enables a JSON object to be displayed as a 2D table
  //
  const convertJsonObjectToFlatObject = (jsonObject, flatObject, indentLevel) => {
    // debugger
    for (var key in jsonObject) {
      flatObject[flatObject.lineNumber] = {}
      flatObject[flatObject.lineNumber]["key"] = key
      flatObject[flatObject.lineNumber]["type"] = typeof (jsonObject[key])
      if (Object.prototype.toString.call(jsonObject[key]) === '[object Array]') {
        flatObject[flatObject.lineNumber]["type"] = "array"
        flatObject[flatObject.lineNumber]["length"] = jsonObject[key].length
      }
      //debugger
      flatObject[flatObject.lineNumber]["indentLevel"] = indentLevel
      if (flatObject[flatObject.lineNumber]["type"] == "object") {
        flatObject.lineNumber++
        convertJsonObjectToFlatObject(jsonObject[key], flatObject, indentLevel + 1)
      } else if (flatObject[flatObject.lineNumber]["type"] == "array") {
        for (var i = 0; i < jsonObject[key].length; i++) {
          if (i < 1) flatObject.lineNumber++
          var str = key.toString() + "[" + i.toString() + "]"
          convertJsonObjectToFlatObject({ [str]: jsonObject[key][i] }, flatObject, indentLevel + 1)
        }
      } else {
        flatObject[flatObject.lineNumber]["value"] = jsonObject[key]
        flatObject.lineNumber++
      }
    }
    return flatObject
  }


  //
  // Convert the form object data back to a JSON object, using the originalJsonObject as a reference for keys and types
  //
  const convertFlatObjectBackToJsonObject = (_flatObject, originalJsonObject, lineNumber, indentLevel, globalLineNumber) => {
    var response = {}
    while (globalLineNumber.lineNumber !== _flatObject["lineNumber"]) {
      //debugger
      if (_flatObject[globalLineNumber.lineNumber]["indentLevel"] < indentLevel) return response
      if (_flatObject[globalLineNumber.lineNumber]["type"] === "object") {
        response[_flatObject[globalLineNumber.lineNumber]["key"]] = {}
        globalLineNumber.lineNumber++
        response[_flatObject[globalLineNumber.lineNumber - 1]["key"]] = convertFlatObjectBackToJsonObject(
          _flatObject,
          response[_flatObject[globalLineNumber.lineNumber - 1]["key"]],
          globalLineNumber.lineNumber,
          _flatObject[globalLineNumber.lineNumber]["indentLevel"],
          globalLineNumber
        )
      } else if (_flatObject[globalLineNumber.lineNumber]["type"] === "array") {
        var arrayToBuild = []
        response[_flatObject[globalLineNumber.lineNumber]["key"]] = arrayToBuild
        var lengthOfArrayToBuild = _flatObject[globalLineNumber.lineNumber]["length"]
        for (var i = 0; i < lengthOfArrayToBuild; i++) {
          if (i === 0) globalLineNumber.lineNumber++
          if (_flatObject[globalLineNumber.lineNumber]["type"] === "object") {
            globalLineNumber.lineNumber++
            arrayToBuild.push(
              convertFlatObjectBackToJsonObject(
                _flatObject, 
                response[_flatObject[globalLineNumber.lineNumber - 1]["key"]], 
                globalLineNumber.lineNumber, 
                _flatObject[globalLineNumber.lineNumber]["indentLevel"], 
                globalLineNumber
              )
            )
          } else {
            const itemToPush = _flatObject[globalLineNumber.lineNumber]["value"]
            arrayToBuild.push(
              itemToPush
            )
            globalLineNumber.lineNumber++
          }
        }
      }
      else {
        response[_flatObject[globalLineNumber.lineNumber]["key"]] = _flatObject[globalLineNumber.lineNumber]["value"]
        globalLineNumber.lineNumber++
      }
    }
    return response
  }

  const [jsonObject, setJsonObject] = React.useState({
      "system": "test",
      "someOther": "property",
      "mailingAddress": {
         "streetNumber": 2617,
         "streetName": "rodeo",
         "city": "Dallas",
         "state": "Texas"
      },
      "pets": [ {"kind":"dog", "age":2}, {kind:"cat", "age": 10} ],
      "childrensAges": [0, 5],
      "name" : {
        "first": "Dude",
        "last": "perfect"
      }
    }
  )
  const [sourceJsonText, setSourceJsonText] = React.useState(JSON.stringify(jsonObject, null, 2))
  const [flattenedJsonObject, setFlattenedJsonObject] = React.useState(convertJsonObjectToFlatObject(jsonObject, { "lineNumber": 0}, 0))
  const [reconstructedJsonObject, setReconstructedJsonObject] = React.useState(convertFlatObjectBackToJsonObject(flattenedJsonObject, jsonObject, 0, 0, { lineNumber: 0}))

  const handleBaseJsonObjectFieldChange = (event) => {
    setSourceJsonText(event.target.value)
    try {
      setJsonObject(JSON.parse(event.target.value))
      setFlattenedJsonObject(convertJsonObjectToFlatObject(jsonObject, { lineNumber: 0}, 0))
      setReconstructedJsonObject(convertFlatObjectBackToJsonObject(flattenedJsonObject, jsonObject, 0, 0, {lineNumber: 0}))
    } catch (error) { 
      console.log(error)
    }

  }


  const handleTextFieldChange = (event, key) => {
    if (flattenedJsonObject[key]["type"] != "object") {
      var _flattenedJsonObject = JSON.parse(JSON.stringify(flattenedJsonObject))
      _flattenedJsonObject[key]["value"] = "" + event.target.value
      setFlattenedJsonObject(_flattenedJsonObject)
    }
  }

  const handleKeyChange = (event, key) => {
    if (event.key !== undefined && event.key !== "Enter") return
    if (flattenedJsonObject[key]["type"] != "object") {
      var _flattenedJsonObject = JSON.parse(JSON.stringify(flattenedJsonObject))
      _flattenedJsonObject[key]["key"] = "" + event.target.value
        setFlattenedJsonObject(_flattenedJsonObject)
    }
  }

 const getPadding = (spaces) => {
    var html = []
    for (let i = 0; i < spaces; i++) {
      html.push(<span>&nbsp; &nbsp;</span>)
    }
    return html
  }

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

  /*
  const camelCaseConvertor = (word) => {
    return word
    //return(word.replace(/([A-Z/g, $1).replace(/^./, (str) => str.toUpperCase()))
  }
  */


  //const handleAddButtonClick = (event.key) => {
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
    setFlattenedJsonObject(_flattenedJsonObject)
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
    setFlattenedJsonObject(_flattenedJsonObject)
  }


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
        if (flattenedJsonObject[key] !== undefined && flattenedJsonObject[key].hasOwnProperty("value")) {
          const length = (2 * flattenedJsonObject[key]["indentLevel"]) + ((flattenedJsonObject[key]['value'] + "").length / 1)
          if (length > longestString) longestString = length
        }
      }
      return longestString
    }


    const inspectorStyles = {
      grid: {
        display: "table",
        width: "100%",
        borderBottom: "1px solid black",
        backgroundColor: "rgb(236, 235, 242)"
      },
      row: {
        display: "table-row",
        fontSize: "0.6em",
        fontWeight: "normal",
        backgroundColor: "rgb(236, 235, 242)",
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
      <div style={{ width: "25em", height: "10em", overflow: "auto"}}>
        <div style={inspectorStyles.grid}>
          {
            Object.keys(flattenedJsonObject).map( (key, index) => {
              if (key !== "lineNumber") {
                const propertyValue = flattenedJsonObject[key]["key"]
                const cellValue = flattenedJsonObject[key]["value"]
                const indentationPadding =(flattenedJsonObject[key]["indentLevel"] * 1 + 0.5) + "em"
                if (cellValue !== undefined) {
                  return (
                    <div style={inspectorStyles.row}>
                      <div style={{...inspectorStyles.cell, ...inspectorStyles.propertyNameCell, paddingLeft: indentationPadding}}>{getCamelCaseDisplayName(propertyValue)}</div>
                      <div style={{...inspectorStyles.cell, ...inspectorStyles.propertyValueCell, backgroundColor: "white"}}>
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
                    <div style={inspectorStyles.row}>
                      <div style={{...inspectorStyles.cell, ...inspectorStyles.propertyNameCell, borderRight: "none", paddingLeft: indentationPadding}}>{getCamelCaseDisplayName(propertyValue)}</div>
                      <div style={{...inspectorStyles.cell, ...inspectorStyles.propertyValueCell, borderLeft: "none"}}></div>
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


  return (
      <>
        <div className="Input">
        </div>
        <div>
          <div style={{display: "flex", flexWrap: "wrap", backgroundColor: "none", justifyContent: "center"}}>
            <div id="item-1" style={{border: "0px solid black", backgroundColor: "none", height: "20em"}}>
              {
                getPropertyInspector()
              }
              <img src="apigee_table.png" style={{width: "20.0em"}} />
              <pre>
                <textarea id="baseJsonObject"
                  type="text"
                  cols="80"
                  rows="30"
                  value={sourceJsonText}
                  placeholder=""
                  onChange={(event) => handleBaseJsonObjectFieldChange(event)}
                  style={{ paddingLeft: "0.4em", fontFamily: '"Roboto", "Helvetica", "Arial", "sans-serif"', fontSize: "0.9em"}}
                />
              </pre>
            </div>
            <div id="item-1" style={{border: "1px solid black", width: "20em", backgroundColor: "none"}}>
             <pre>
               {JSON.stringify(flattenedJsonObject, null, 2)}
             </pre>
            </div>
            <div id="item-1" style={{border: "1px solid black", width: "20em", backgroundColor: "none"}} >
              <pre>
                {JSON.stringify(reconstructedJsonObject, null, 2)}
              </pre>
            </div>
          </div>
        </div>
        <div style={{padding: "0.2em", border: "1px solid black", textAlign: "left"}}>
        <img src="apigee_table.png" style={{width: "20.0em"}} />
        { 
          getPropertyInspector()
        }
        </div>
      </>
  )

}
