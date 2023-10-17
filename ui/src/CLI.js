import React from 'react';
import Text from './Text.js';
import WarningBox from './WarningBox.js';


// TODO: Up arrow
//       Control-C
//       Error handling

// <input type="text" autofocus/>
export default function Cli(props) {

  // In demo mode, we don't actually call the API service to run commands
  const allowFailToDemoMode = true

  const [screenBuffer, setScreenBuffer] = React.useState([""])
  const [promptBuffer, setPromptBuffer] = React.useState("")
  const [cwd, setCwd] = React.useState("/")
  const [requestInProgress, setRequestInProgress] = React.useState(false);
  const [autoCompleteSuggestions, setAutoCompleteSuggestions] = React.useState([])
  const [commandHistory, setCommandHistory] = React.useState([])
  const [commandHistoryPointer, setCommandHistoryPointer] = React.useState(null)
  const [curlCommand, setCurlCommand] = React.useState(null)
  const [demoMode, setDemoMode] = React.useState(false)
  const [apiServiceErrorMessage, setApiServiceErrorMessage] = React.useState(null)
  const [apiServiceException, setApiServiceException] = React.useState(null)



  const fontFamily = "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace"
  const fontSize = "0.9em"
  const fontColor = window.getTheme().textColor
  const prompt = "$"
  const hostname = "localhost"

  const handleBlur = (event) => {
  }

  const handleKeyDown = (entry) =>  {
    if (entry.key == "c" && entry.ctrlKey) {
      setPromptBuffer("")
      updateScreen("[break]")
    } else if (entry.key == "ArrowUp") {
      if (commandHistoryPointer == null) setCommandHistoryPointer(commandHistory.length - 1)
      else { 
        if (commandHistoryPointer > 0) setCommandHistoryPointer(commandHistoryPointer - 1)
      }
      setPromptBuffer(commandHistory[commandHistoryPointer])
    } else if (entry.key == "Enter") {
      if (promptBuffer == null) {
      } else if (promptBuffer.trim() == "clear") {
        setPromptBuffer("")
        setScreenBuffer([""])
        window.scrollTo(0, 0);
      } else if (promptBuffer.length > 0) {
        //screenBuffer.push(promptBuffer)
        sendCommand(promptBuffer)
        setPromptBuffer("")
      }
      setAutoCompleteSuggestions([])
    } else if (entry.key == "Tab") {
      // This will cause the sendCommand() function to populate the autoCompleteSuggestions hook
      entry.preventDefault()
      // There is a bug here where this doesn't work in demo mode, if you hit up arrow then tab
      if (promptBuffer !== undefined) sendCommand("autoComplete:" + promptBuffer.split(" ")[promptBuffer.split(" ").length - 1])
    } 
  }

  const handleCharacterEntry = (entry) =>  {
    if (!requestInProgress) setPromptBuffer(entry.target.value)
    setAutoCompleteSuggestions([])
  }

  const updateScreen = (text) => {
    var newScreenBuffer  = [...screenBuffer]
    newScreenBuffer.push(prompt + " " + promptBuffer)
    if (text != null) newScreenBuffer.push(text)
    setScreenBuffer(newScreenBuffer)
    var newCommandHistory = [...commandHistory]
    newCommandHistory.push(promptBuffer)
    setCommandHistory(newCommandHistory)
  }

  const sendCommand = (command) => {
    setApiServiceErrorMessage(null)
    setApiServiceException(null)
    setRequestInProgress(true)
    var commandBody = {
                "cwd": cwd,
                "type": "shell",
                "node": "localhost",
    }
    if (command.startsWith("cd ")) commandBody['command'] = "ls " + command.split(" ")[1] + "/"
    else if (command.startsWith("autoComplete:")) {
        commandBody['command'] = "ls " + command.split(":")[1] + "*"
    } else commandBody['command'] = command
    setCurlCommand("curl -ks -X POST \\ -H \"Authorization: Basic ******** \\ -d '" + JSON.stringify(commandBody) + "' \\ " + window.location.host + "/api/v1/commands")
    if (demoMode) {
      updateScreen(window.fakeCommandProcessor(command))
      window.scrollTo(0, document.body.scrollHeight);
      document.querySelector('#prompt').focus()
      setRequestInProgress(false)
    } else {
      fetch("/api/v1/commands",
            {                                                    
              method: "post",
              headers : {
                "Authorization" : "Basic " + window.getDemoCredential()
              },
              body: JSON.stringify(commandBody)
            }
      ).then(
        (response) => {
          return Promise.all([response.status, response.json()]);
        }
      ).then(                                                             
        (response) => {                                                         
          setRequestInProgress(false) 
          const statusCode = response[0]
          const result = response[1]
          if (statusCode != 200) {
            updateScreen("Server error: The shell command API responded with HTTP response code: " + statusCode)
            //if (allowFailToDemoMode && !demoMode) setDemoMode(true)
          } else if ( result !== undefined ) {                               
            try {                                                       
              if (result.hasOwnProperty("response")) {
                if (command.startsWith("autoComplete:")) {
                  const autoCompleteSuggestionResults = result['response'].split("\n").filter(e => e)
                  if (autoCompleteSuggestionResults.length == 0) {
                  } else if (autoCompleteSuggestionResults.length == 1) {
                    setPromptBuffer(promptBuffer.split(" ").slice(0, -1).join(" ") + " " +  autoCompleteSuggestionResults[0])
                  } else setAutoCompleteSuggestions(autoCompleteSuggestionResults)
                } else if (command.startsWith("cd ")) {
                  if (result['result'].toLowerCase().includes("o such file") || result['result'].toLowerCase().includes("ot a directory")) {
                    //updateScreen(result['result'].split(" ").join(" ").replace("ls: ", "cd: "))
                  } else setCwd(command.split(" ")[1])
                } else {
                  updateScreen(result['response'])
                }
                window.scrollTo(0, document.body.scrollHeight);
              } else updateScreen("Server error: The API server returned an unexpected response: " + JSON.stringify(result))
            } catch (exception) {       
              if (allowFailToDemoMode && !demoMode) setDemoMode(true)
              setApiServiceException(exception)       
              setApiServiceErrorMessage("The service responded with an invalid response (expecting a JSON object)")
            }                                                           
          } else {               
            // The response has no body     
            setApiServiceErrorMessage("No content")                                                                
          }                          
        },                             
        (error) => {                   
          if (allowFailToDemoMode && !demoMode) setDemoMode(true)
          setApiServiceErrorMessage("This could be due to a transport layer error such as a CORS error, or a service timeout")
          setApiServiceException(error)               
          setRequestInProgress(false)   
        }                                                               
      )                                           
    }
    window.scrollTo(0, document.body.scrollHeight);
  }


  return (
    <div id="outer-div">
      <div id="inner-div" style={{padding: "0em 0em 1.5em 0em"}}>
        {
          demoMode && (
            <WarningBox text=<a>The Host Manager CLI API is not available, possibly because you are running the demo.  Certain features like [tab] autocompletes and [up arrow] command history are not available. All server responses are simulated when running in demo mode.</a> />
          )
        }
        {
          !demoMode && apiServiceErrorMessage != null && (
            <WarningBox text=<a>{apiServiceException != null && apiServiceException.message}<br />{apiServiceErrorMessage}</a> />
          )
        }
       
        <div id="buffer-div" style={{padding: "0px 0px 2px 0px"}}>
          <font style={{fontFamily: fontFamily, color: fontColor, fontSize: fontSize}}>
            {
              screenBuffer.map( (row, index) => {
                return (
                  <div key={"screen-buffer-line-" + index} style={{whiteSpace: "pre-wrap", padding: "0px 0px 2px 0px"}}>
                    {row}
                  </div>
                )
              })
            }
          </font>
        </div>
        {
          localStorage.getItem("hostmanager.options.showApiCalls") == "true" && curlCommand != null && <div style={{margin: "1.0em 0 1.0em 0"}}>
              <WarningBox
                text=<pre style={{fontSize: "1.4em", textAlign: "left"}}>
                  {
                    curlCommand.split("\\").map( (line, index) => {
                      return (<>{line} \<br /></>)
                    })
                  }
                  {/* serverResponse != null && JSON.stringify(serverResponse) */}
                </pre>
              />
            </div>
        }
        <div id="prompt-div" style={{ display: "flex", alignItems: "left", flexDirection: "row" }} >
            <font style={{fontFamily: fontFamily, fontSize: fontSize, color: fontColor}}>
              {hostname}&nbsp;{cwd}&nbsp;{prompt}
            </font>
          <input
                        id="prompt"
                        type="text"
                        value={promptBuffer}
                        onKeyDown={handleKeyDown}
                        onChange={handleCharacterEntry}
                        onBlur={handleBlur}
                        autoComplete="off"
                        autoFocus
                        style={{ color: fontColor, outline: "none", height: "1.0em", width: "100%", fontFamily: fontFamily,  fontSize: fontSize, padding: "1.5px 0px 0px 5px", border:0, backgroundColor: window.getTheme().componentAreaBackgroundColor}}


          />
        </div>
        <div id="command-status-line-div">
          { autoCompleteSuggestions != undefined && autoCompleteSuggestions.length > 0 && 
             <font style={{fontFamily: fontFamily, color: fontColor, fontSize: fontSize, flexDirection: "row" }}>
               {
                 autoCompleteSuggestions.map( (item, index) => {
                     return (
                       <React.Fragment key={"auto-complete-item-" + index}>{item} &nbsp;</React.Fragment>
                     )
                 })
               }
             </font>
          }
          { requestInProgress && 
             <font style={{fontFamily: fontFamily, color: fontColor, fontSize: fontSize, flexDirection: "row", color: {fontColor} }}>
               {/*<img src="hourglass.svg" style={{ width: "0.8em"}}  />*/} (... pending ...)
             </font>
          }
        </div>
      </div>
    </div>
  )
}
