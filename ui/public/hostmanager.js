function nothing() {
  return ""
}

function getDrawerColor() {
  return blueColorCode()
}

function getFileManagerIconColor() {
  return "rgb(114, 148, 194)"
}

//
// Fetch call to a REST API with validation of the expected JSON response,
// and error handling for non 2xx responses
//
//     serviceHttpRequest = An object containing {headers}, {method}, and request {body}
//     serviceResponseCallback = A method to invoke when the response is received
//
function fetchRestApi(url, method, headers, body,  serviceResponseCallback) {
    var request = {
      method: method,
      headers: headers == null ? {} : {...headers}
    }
    if (body != null && method.toLowerCase() != "get") {
      request.headers['Content-type'] = "application/json"
      request.body = JSON.stringify(body)
    }
    var serviceResponse = {
      statusCode: 0,            // The HTTP response code
      responseBody: null,       // The HTTP response body on 2xx (JSON Only)
      errorMessage: null,       // A descriptive error message on the result
      errorResponseBody: null,  // The HTTP response body on non-2xx (Can be text or JSON)
      exception: null           // An exception thrown by the fetch() call itself
    }
    fetch(url, request).then(
        (response) => {
          serviceResponse.statusCode = response.status
          return response.text()
        }
    ).then(
        (response) => {
          try {
						if (199 < serviceResponse.statusCode && serviceResponse.statusCode < 299) {
							try {
								 const json = JSON.parse(response)
								 serviceResponse.responseBody = json
							} catch (exception) {
									serviceResponse.errorMessage = "(HTTP " + serviceResponse.statusCode + "): Expected a JSON response, received: " + window.truncateText(response, 50)
									serviceResponse.errorResponseBody = response
									// Optionally also preserve the exception
									exception = exception
							}
						} else {
								serviceResponse.errorMessage = "HTTP " + serviceResponse.statusCode
								if ( response == null || response == "") serviceResponse.errorResponseBody = "(no content)"
								else serviceResponse.errorResponseBody = response
						}
            serviceResponseCallback(serviceResponse)
          } catch (exception) {
            serviceResponse.errorMessage = exception['message']
            serviceResponse.exception = exception
            serviceResponseCallback(serviceResponse)
          }
        },
        (error) => {
          serviceResponse.errorMessage = "This could be due to a transport layer error such as a CORS error, or a service timeout"
          serviceResponse.exception = error
          serviceResponseCallback(serviceResponse)
        }
    )
}


//
// Credential is set on the API server's container as 
//
//    ADMIN_USERNAME=admin
//    ADMIN_PASSWORD=admin
//
function getDemoCredential() {
  return "YWRtaW46YWRtaW4="
}

function setTheme(theme) {
  if (localStorage.getItem("hostmanager.options.theme") != theme) {
    if (theme == 'default') localStorage.removeItem("hostmanager.options.theme")
    else localStorage.setItem("hostmanager.options.theme", theme)
  }
}

function getTheme() {
  if (localStorage.getItem("hostmanager.options.theme") == "dark") {
    return {
      name: 'dark',
			primaryColor: 'black',
			primaryColorComplement: 'darkGray',
			textColor: 'darkGray',
			appBarBackgroundColor: 'none',
			appBarMenuBackgroundColor: 'rgb(62, 70, 89)',
			appBarMenuIconColor: 'rgb(45, 47, 54)',
			appBarMenuTextColor: 'darkGray',
			appBarMenuAntSwitchColor: '#fff',
			appBarMenuAntSwitchBackgroundColor: '',
			appBarMenuAntSwitchColorDisabled: '',
			appBarMenuAntSwitchBackgroundColorDisabled: '',
			componentAreaBackgroundColor: 'rgb(35, 35, 36)',
			_warningLabelBackgroundColor: 'rgb(247, 170, 37)',
      warningLabelBackgroundColor: 'gray',
			warningLabelTextColor: 'black',
			componentViewSwitchSelectedColor: 'rgb(45, 47, 54)',
			componentViewSwitchNotSelectedColor: 'rgb(139, 139, 143)',
			fileManagerIconColor: 'rgb(70, 83, 115)',
			shadedBoxColor: 'rgb(45, 45, 46)',
			componentAreaIconColor_blue: 'rgb(114, 148, 194)',
			componentAreaIconColorUnselected_blue: 'rgb(139, 139, 143)',
			componentAreaIconColor_: 'rgb(45, 47, 54)',
			componentAreaIconColor: 'rgb(70, 83, 115)',
			componentAreaIconColorUnselected: 'rgb(139, 139, 143)'
		}
  } else return {
    name: 'default',
    primaryColor: '#0063b2ff',
    _primaryColor: "red",
    primaryColorComplement: 'white',
    textColor: 'rgb(45, 47, 54)',
    appBarBackgroundColor: 'none',
    appBarMenuBackgroundColor: 'white', 
    appBarMenuIconColor: 'rgb(45, 47, 54)',
    appBarMenuTextColor: 'rgb(45, 47, 54)',
    appBarMenuAntSwitchColor: '#fff',
    appBarMenuAntSwitchBackgroundColor: '',
    appBarMenuAntSwitchColorDisabled: '',
    appBarMenuAntSwitchBackgroundColorDisabled: '',
    componentAreaBackgroundColor: 'white',
    warningLabelBackgroundColor: 'yellow',
    warningLabelTextColor: 'black',
    componentViewSwitchSelectedColor: 'rgb(45, 47, 54)',
    componentViewSwitchNotSelectedColor: 'rgb(139, 139, 143)',
    fileManagerIconColor: 'rgb(114, 148, 194)',
    shadedBoxColor: 'rgb(227, 236, 250)',
    componentAreaIconColor_blue: 'rgb(114, 148, 194)',
    componentAreaIconColorUnselected_blue: 'rgb(139, 139, 143)',
    componentAreaIconColor_: 'rgb(45, 47, 54)',
    componentAreaIconColor_: '#014580',
    componentAreaIconColor: 'rgb(114, 148, 194)',
    componentAreaIconColorUnselected: 'rgb(139, 139, 143)'
  }
}

function getShadedBackgroundColor() {
  //return "rgb(237, 241, 247)"
  //return "rgb(230, 238, 250)"
  return "rgb(227, 236, 250)"
}

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

function truncateText(text, characters) {
    if (text != null && text.length > characters) {
      return text.substring(0, characters) + "..."
    } else return text
}

function getPrimaryColor() {
  return blueColorCode()
}

function getDrawerIconColor() {
  //return "#ffffff"
  return "rgb( 223, 225, 232)"
}

//
// A demo filesystem we can use when the API isn't returning any data from the host.  This will enable the UI to run in a demonstration mode.
//
function getDemoHostFileSystem() {
  return {
    "/" : {
      "/var" : { },
      "/home" : {
        "/guest": {
          "/SecurityCamera001": {
            "data.log": {
              "type": "text",
              "size": "8k"
            },
            "2021-09-01.png": {
              "type": "image",
              "thumbnail": "2021-09-01.png",
              "size": "8k"
            }
          },
          "/SecurityCamera002": {
            "2021-09-02.png": {
              "type": "image",
              "thumbnail": "2021-09-02.png",
              "size": "192k"
            },
            "2021-09-03.png": {
              "type": "image",
              "thumbnail": "2021-09-03.png",
              "size": "163k"
            }
          },
          "/EmptyFolder" : {
          },
          "/Lex" : {
            "Carmack.001.png": {
              "type": "image",
              "thumbnail": "Carmack.001.png",
              "size": "958k"
            },
            "Carmack.002.png": {
              "type": "image",
              "thumbnail": "Carmack.002.png",
              "size": "958k"
            },
            "Carmack.003.png": {
              "type": "image",
              "thumbnail": "Carmack.003.png",
              "size": "958k"
            },
            "Carmack.004.png": {
              "type": "image",
              "thumbnail": "Carmack.004.png",
              "size": "958k"
            },
            "Lex.001.png": {
              "type": "image",
              "thumbnail": "Lex.001.png"
            },
            "Lex.002.png": {
              "type": "image",
              "thumbnail": "Lex.002.png",
              "size": "958k"
            },
            "transcript.txt": {
              "type": "text",
              "text": "The transcript begins with a discussion on the importance of interdisciplinary collaboration in architecture. The speaker emphasizes the need for people who have expertise and creativity across multiple disciplines. They share their approach to finding interesting people to work with, which involves manifesting desires and looking at the cracks between disciplines and scales. The dean of a well-known architectural school shares their perspective on today's architects and the role of star architects. The speaker shares their preference for individuals who are dreamers addicted to reality rather than realists addicted to dreams. They look for people with industry experience, knowledge of the real world, and translational design ability.",
              "size": "958k"
            }
          },
          "welcome.txt" : {
            "type": "text",
            "text": "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
              "size": "958k"
          },
          "volume.dat" : {
            "type": "unknown",
            "size": "958k"
          },
          "this_is_a_really_long_file_namerun.sh": {
            "type": "text",
            "size": "30k",
            "text": "#!/bin/sh\n\necho \"Hello \"World"
          }, 
          "readme.txt" : {
            "type": "text",
            "text": "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.",
            "size": "958k"
          },
          "icon.png" : {
            "type": "image",
            "thumbnail": "globe.png",
            "size": "958k"
          }
        }
      }
    }
  }
}


//
// When in demo mode, we won't attempt to run an API server.  This function
// will enable a user to see what the CLI function looks like
//
function fakeCommandProcessor(command) {
  if (command.startsWith("pwd")) return "/\n"
  else if (command.startsWith("echo ")) return command.substring(5, command.length)
  else if (command == "") return "\n"
  else if (command.startsWith("ps")) {
    return "PID   USER     TIME  COMMAND\n" +
    "    1 root      0:00 sh\n" +
    "   13 root      0:00 {build} /bin/bash ./build setup_development_container\n" +
    "  198 root      0:00 sh\n" +
    "  271 root      0:00 {build} /bin/bash ./build start_development_container_services\n" +
    "  272 root      0:00 {build} /bin/bash ./build start_development_container_services\n" +
    "  273 root      0:57 node /usr/share/node_modules/yarn/bin/yarn.js start\n" +
    "  274 root      3:50 java -jar /src/server/target/server-1.0.jar\n" +
    "  311 root      0:00 /usr/bin/node /src/ui/node_modules/.bin/react-scripts start\n" +
    "  319 root      6:41 /usr/bin/node /node_modules/react-scripts/scripts/start.js\n" +
    "  502 root      0:00 ps\n" 

  } else if (command == "ls") {
    return "bin           err           home          media         node_modules  out           root          sbin          srv           tmp           var\n" + 
           "dev           etc           lib           mnt           opt           proc          run           src           sys           usr"
  } else if (command.startsWith("ls") || command.startsWith("dir")) {
    return "total 112\n" + 
           "drwxr-xr-x    1 root     root          4096 Sep 17 12:57 bin\n" + 
           "drwxr-xr-x    5 root     root           360 Sep 17 12:57 dev\n" + 
           "-rw-r--r--    1 root     root            39 Sep 17 13:06 err\n" +
           "drwxr-xr-x    1 root     root          4096 Sep 17 13:05 etc\n" +
           "drwxr-xr-x    2 root     root          4096 Jun 14 15:05 home\n" +
           "drwxr-xr-x    1 root     root          4096 Jun 14 15:05 lib\n" +
           "drwxr-xr-x    5 root     root          4096 Jun 14 15:05 media\n" +
           "drwxr-xr-x    2 root     root          4096 Jun 14 15:05 mnt\n" +
           "drwxr-xr-x  850 root     root         36864 Sep 17 13:08 node_modules\n" +
           "drwxr-xr-x    2 root     root          4096 Jun 14 15:05 opt\n" +
           "-rw-r--r--    1 root     root             0 Sep 17 13:06 out\n" +
           "dr-xr-xr-x  212 root     root             0 Sep 17 12:57 proc\n" +
           "drwx------    1 root     root          4096 Sep 17 13:06 root\n" +
           "drwxr-xr-x    2 root     root          4096 Jun 14 15:05 run\n" +
           "drwxr-xr-x    2 root     root          4096 Jun 14 15:05 sbin\n" +
           "drwxrwxrwx   13 root     root           416 Sep 18 15:21 src\n" +
           "drwxr-xr-x    2 root     root          4096 Jun 14 15:05 srv\n" +
           "dr-xr-xr-x   13 root     root             0 Sep 17 12:57 sys\n" +
           "drwxrwxrwt    1 root     root          4096 Sep 17 13:08 tmp\n" +
           "drwxr-xr-x    1 root     root          4096 Sep 17 13:05 usr\n" +
           "drwxr-xr-x    1 root     root          4096 Sep 17 13:04 var\n"
  } else {
    return "Unknown command: [" + command + "].  Note that when running in DEMO mode, there is no host runnning the command line API service.  Try commands like \"pwd\", \"ls\", etc."
  }
  
}


function blueColorCode() {
  return "#0063b2ff"
}

//
// Show just the user's Avatar and misc icons at the upper right
//
function switchToLightweightAppBar() {
  setDisplaySetting("appBar", "lightweight")
  setDisplaySetting("appBarTextColor", "rgb(77, 79, 82)")
  setDisplaySetting("appBarBackgroundColor", "white")
  setDisplaySetting("navigationBackgroundColor", blueColorCode())
  setDisplaySetting("navigationTextColor", "white")
  setDisplaySetting("softHighlightColor", "gray")
  setDisplaySetting("brightHighlightColor", "rgb(61, 59, 53)")
  setDisplaySetting("buttonColor", blueColorCode())
  setDisplaySetting("buttonSecondaryColor", "#395ead")
  setDisplaySetting("buttonTextColor", "white")
  setDisplaySetting("highlightedTextColor", blueColorCode())
}

//
// An experimental setting to switch to full screen mode,
// with an "x" at the upper-right to exit fullscree mode
//
function fullscreenMode() {
  setDisplaySetting("fullscreenMode", true)
  window.location.href="/"
}

function exitFullscreenMode() {
  setDisplaySetting("fullscreenMode", false)
  window.location.href="/"
}

//
// A function for dummy data
//
function getFunctionObjectFromLocalStorage(functionName) {
  const _functions = JSON.parse(localStorage.getItem("functions"))
  for (var i=0; i < _functions.length; i++) if (_functions[i].name == functionName) return _functions[i]
  return null
}

//
// A function for dummy data
//
function getFunctionRevisionObjectFromLocalStorage(functionName, revisionNumber) {
  const _functions = JSON.parse(localStorage.getItem("functions"))
  for (var i=0; i < _functions.length; i++) if (_functions[i].name == functionName) return _functions[i][revisionNumber + ""]
  return null
}

//
// A function for dummy data
//
function storeNewFunctionRevision(functionName, revisionNumber, revisionObject) {
    var newFunctionObject = window.getFunctionObjectFromLocalStorage(functionName)
    newFunctionObject[revisionNumber] = revisionObject
    newFunctionObject.revisions.push(revisionNumber)
    updateFunctionInLocalStorage(functionName, newFunctionObject)
}

function deleteFunctionRevision(functionName, revisionNumber) {
  var newFunctionObject = window.getFunctionObjectFromLocalStorage(functionName)
  delete newFunctionObject[revisionNumber + ""]
  var newRevisionsArray = []
  newFunctionObject.revisions.map( (revision) => {
    if (revisionNumber != revision) newRevisionsArray.push(revision)
  })
  newFunctionObject.revisions = newRevisionsArray
  updateFunctionInLocalStorage(functionName, newFunctionObject)
}



//
// An update function for function dummy data
//
function updateFunctionInLocalStorage(_functionName, _functionObject) {
    var _functions = JSON.parse(localStorage.getItem("functions"))
    _functions.forEach((func, index) => {
      if (func["name"] == _functionName) _functions[index] = _functionObject
     })
    localStorage.setItem("functions", JSON.stringify(_functions))
}

function testDummyDataFunctions() {
  const functionObject = getFunctionObjectFromLocalStorage("Sample Python Function 01")
  if (functionObject.name != "Sample Python Function 01") return "getFunctionObjectFromLocalStorage() Failed to retrieve the correct value"
  return null
}


//
// Generate some fake log data
//
function getTestLogData() {
  return "2021-12-31 14:23:01.938: All work and no play makes Jack a dull boy\n" + 
         "2021-12-31 14:23:02.938: All play and no work makes Jack a droll toy\n" + 
         "2021-12-31 14:23:02.938: All play and no work makes Jack a droll toy\n" +
         "2021-12-31 14:23:02.938: All play and no work makes Jack a droll toy\n" +
         "2021-12-31 14:23:02.938: All play and no work makes Jack a droll toy\n" +
         "2021-12-31 14:23:02.938: All play and no work makes Jack a droll toy\n" +
         "2021-12-31 14:23:02.938: All play and no work makes Jack a droll toy\n" +
         "2021-12-31 14:23:02.938: All play and no work makes Jack a droll toy\n" +
         "2021-12-31 14:23:02.938: All play and no work makes Jack a droll toy\n" +
         "2021-12-31 14:23:02.938: All play and no work makes Jack a droll toy\n" +
         "2021-12-31 14:23:02.938: All play and no work makes Jack a droll toy\n" +
         "2021-12-31 14:23:02.938: All play and no work makes Jack a droll toy\n" +
         "2021-12-31 14:23:02.938: All play and no work makes Jack a droll toy\n" +
         "2021-12-31 14:23:02.938: All play and no work makes Jack a droll toy\n" +
         "2021-12-31 14:23:02.938: All play and no work makes Jack a droll toy\n" +
         "2021-12-31 14:23:02.938: All play and no work makes Jack a droll toy\n" +
         "2021-12-31 14:23:02.938: All play and no work makes Jack a droll toy\n" +
         "2021-12-31 14:23:02.938: All play and no work makes Jack a droll toy\n" +
         "2021-12-31 14:23:02.938: All play and no work makes Jack a droll toy\n" +
         "2021-12-31 14:23:02.938: All play and no work makes Jack a droll toy\n" +
         "2021-12-31 14:23:02.938: All play and no work makes Jack a droll toy\n" +
         "2021-12-31 14:23:02.938: All play and no work makes Boy a moll Jack\n" +
         "2021-12-31 14:52:02.938: All play and no work makes Jack a droll toy\n" +
         "2021-12-31 14:53:02.938: All play and no work makes Jack a droll toy\n" +
         "2021-12-31 14:54:02.938: All play and no work makes Jack a tdroll joy\n"
}




//
// This is the heavy blue top bar
//
function switchToHeavyweightAppBar() {
  switchToNormalTheme()
  setDisplaySetting("appBar", "heavyweight")
  setDisplaySetting("appBarTextColor", "white")
  setDisplaySetting("appBarBackgroundColor", blueColorCode())
  setDisplaySetting("navigationBackgroundColor", "white" )
  setDisplaySetting("navigationTextColor", "rgb(77, 79, 82)")
  setDisplaySetting("softHighlightColor", "gray")
  setDisplaySetting("brightHighlightColor", "gray")
  setDisplaySetting("buttonColor", blueColorCode())
  setDisplaySetting("buttonSecondaryColor", "#395ead")
  setDisplaySetting("buttonTextColor", "white")
  setDisplaySetting("highlightedTextColor", blueColorCode())

}

//
// This is experimental
//
function switchToDarkTheme() {
  setDisplaySetting("appBar", "lightweight")
  setDisplaySetting("appBarTextColor", "rgb(107, 142, 191)")
  setDisplaySetting("navigationBackgroundColor", "rgb(40, 51, 74)")
  setDisplaySetting("navigationTextColor", "rgb(94, 111, 145)")
  setDisplaySetting("backgroundColor", "rgb(45, 46, 48)")
  setDisplaySetting("theme", "dark")
  setDisplaySetting("appBarBackgroundColor", getDisplaySetting("backgroundColor"))
  setDisplaySetting("defaultTextColor", "rgb(197, 209, 235)")
}

function switchToNormalTheme() {
  switchToLightweightAppBar()
  setDisplaySetting("backgroundColor", "white")
  setDisplaySetting("theme", "none")
  setDisplaySetting("defaultTextColor", "rgb(77, 79, 82)")
}



//
// Load the theme/color settings from local storage
//
function getDisplaySettings() {
  return localStorage.getItem("displaySettings") != null ? JSON.parse(localStorage.getItem("displaySettings")) : {}
}

//
// Load a single display setting
//
function getDisplaySetting(key) {
  return localStorage.getItem("displaySettings") != null ? JSON.parse(localStorage.getItem("displaySettings"))[key] : null
}


//
// Set a particular display setting
//
function setDisplaySetting(key, value) {
  var displaySettings = getDisplaySettings()
  displaySettings[key] = value
  localStorage.setItem("displaySettings", JSON.stringify(displaySettings))
}

//
// Data for the links menu on the top bar
//
function getLinksMenu() {
  return [
                      { label: "Material UI APIs", action: "new-tab", href: "https://mui.com/components/avatars/" },
                      { label: "React Home", action: "new-tab", href: "https://reactjs.org/" }
  ]
}


//
// Data for the "settings" menu. The intention is that this menu would only be shown to the product owner or other developers,
// and will primarily contain feature toggles
//
function getSettingsMenu() {
  var displaySettings = getDisplaySettings()
  var settings = []
  
  if (displaySettings.hasOwnProperty("appBar") && displaySettings.appBar == "heavyweight") {
    settings.push( { label: "Switch to Lightweight App Bar", action: "function", function: "window.switchToLightweightAppBar(); window.location.href='/'" })
  } else {
    settings.push( { label: "Switch to Heavyweight App Bar", action: "function", function: "window.switchToHeavyweightAppBar(); window.location.href='/'" })
  } 

  if (displaySettings.hasOwnProperty("theme") && displaySettings.theme == "dark") {
    settings.push( { label: "Turn off Dark Theme", action: "function", function: "window.switchToNormalTheme(); window.location.href='/'" })
  } else {
    settings.push( { label: "Use Dark Theme", action: "function", function: "window.switchToDarkTheme(); window.location.href='/'" })
  }

  if (getDisplaySetting("fullscreenMode")) settings.push( { label: "Exit fullscreen mode", action: "function", function: "window.exitFullscreenMode();" })
  else settings.push( { label: "Fullscreen mode", action: "function", function: "window.fullscreenMode();" })
  
  settings.push( { label: "Show all Settings", action: "redirect", href: "/?c=ShowSettings" } )
  settings.push( { label: "Bug Tracker", action: "redirect", href: "/?c=BugTracker"})
  settings.push( { label: "Component Library", action: "redirect", href: "/?c=ComponentLibrary"})
  settings.push( { label: "Clear Local Storage", action: "function", function: "window.clearLocalStorage()"})


  return settings
}


function clearLocalStorage() {
  localStorage.removeItem("functions");
  localStorage.removeItem("nodes");
  localStorage.removeItem("objects")
  localStorage.removeItem("logs")
  window.location.href="/"
}

function getUsername() {
  //return "Joe User"
  return "John Jacob Jingleheimer"
}

//
// Method to truncate a user's display name to a reasonable value
//
function truncateUsername(username) {
  if (username.length > 30) {
    if (username.includes(" ")) return username.substring(0, username.indexOf(" "))
    else if (username.includes("@")) return sername.substring(0, username.indexOf("@"))
  } 
  return username
}

function testGetNodeData() {
  if (
    !getNodeData().hasOwnProperty("tableColumns")
  ) {
    return "testGetNodeData(): One or more attributes is misisng from the node data table info"
  } else return null
}


function performUnitTests() {
  var errorCount = 0
  var result = {
    "summary" : "All tests pass",
    "errors" : []
  }

  // TODO: Figure out a way to just extract all the testX() functions from this file
  if (testGetNodeData() != null) result["errors"].push( testGetNodeData() )
  if (testGetParameter() != null) result["errors"].push( testGetParameter() )
  if (testDummyDataFunctions() != null) result["errors"].push( testDummyDataFunctions())

  if (result.errors.length == 0) {
    delete result.errors
    return "All tests pass"
  } else {
    result.summary = "1 or more tests FAILED"
    return JSON.stringify(result, null, 2)
  }
}

//
// Some test data for the "Nodes" table
//
function getTestNodeData() {
 return [
   {
     name: "My PC",
     description: "My PC",
     address: "127.0.0.1",
     OS: "Windows 10",
     status: "idle"
   },
   { 
     name: "Ganymede",
     description: "A 4 core 8 GB Linux node in the Physics and Astronomy computer lab",
     address: "127.0.0.1",
     OS: "Linux",
     status: "idle"
   },
   {
     name: "Newton",
     description: "Server in the math building grad student lab",
     address: "127.0.0.1",
     OS: "Linux",
     status: "offline"
   },
   {
     name: "Callisto",
     description: "An 8 core 64GB server reserved for the plasma wave group post-docs",
     address: "127.0.0.1",
     OS: "Linux",
     status: "error",
     statusMessage: "The node is connected, but reporting that the local Docker daemon is down and cannot be restarted"
   },
   {
     name: "EC2 Node 01",
     description: "A 4 core 32GB server under the P and A general AWS account",
     address: "127.0.0.1",
     OS: "Linux",
     status: "idle"
   },
   {
     name: "EC2 Node 02",
     description: "A 4 core 32GB server under the P and A general AWS account",
     address: "127.0.0.1",
     OS: "Linux",
     status: "idle"
   }
 ]
}

//
// The column and data info for the Nodes page
//
function getNodeData() {
  return {
    tableColumns: [
       { id: "name", label: "Name", truncatedFieldLengthLarge: 42, truncatedFieldLengthSmall: 18, searchable: true},
       { id: "address", label: "Address", searchable: true},
       { id: "os", label: "Operating System", searchable: true},
       { id: "status", label: "Status", searchable: true}
    ],
    data: getTestNodeData()
  }
}

//
// Get the filename from a file path
//
function getFilenameFromPath(fullFilePathname) {
  return fullFilePathname.split("/")[fullFilePathname.split("/").length - 1]
}


//
// Get the value of a query string parameter
//
function getParameter(queryString, parameter) {
  if (
      (parameter == null) || (queryString == null) || (queryString.length < 2)
  ) return null;
  
  if ( queryString.includes("?")) queryString = queryString.substring( queryString.indexOf("?") + 1, queryString.length)
  var queryStringElements = queryString.split("&")
  
  for (var i=0; i < queryStringElements.length; i++) {
    const elements = queryStringElements[i].split("=")
    if ( (elements != null) && (elements.length == 2) ) {
      const name=elements[0]
      const value=elements[1]
      if (( name == null ) || (value == null) ) {
        return null
      } else if (name.trim() == parameter.trim()) {
        return decodeURIComponent(value);
      }
    } else return null
  }
  return null
}


function testGetParameter() {
  const testParameters = [
      {
        url:  "https://foobar.foo.com/?auth_disabled=true&c=Snapshot&id=freeloader",
        key: "c", 
        value: "Snapshot" 
      },
      {
        url:  "https://foobar.foo.com/?auth_disabled=true&c=Snapshot&id=freeloader",
        key: "id",
        value: "freeloader"
      },
      {
        url: "?c=Snapshot",
        key: "c",
        value: "Snapshot"
      }
  ]

  errors = []

  for ( var i=0; i < testParameters.length; i++) {
    if (window.getParameter( testParameters[i].url, testParameters[i]["key"]) != testParameters[i]["value"]) errors.push( "testGetParameter(): Failed to extract key " + testParameters[i]["key"] + " from " + testParameters[i].url) 
  }

  if (errors.length > 0) return JSON.stringify(errors)
  else return null
}


