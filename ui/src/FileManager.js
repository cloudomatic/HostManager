import * as React from 'react';
import FileNavigator from './FileNavigator.js';
import FilePreview from './FilePreview.js';
import ListFileView from './ListFileView.js';
import TileFileView from './TileFileView.js';
import ViewSwitch from './ViewSwitch.js';
import WarningBox from './WarningBox.js'

// https://jsfiddle.net/yX3p9/7/

export default function FileManager() {

  const [currentFolderInfo, setCurrentFolderInfo] = React.useState({"/": {}})
  const [currentFilesystemPath, setCurrentFilesystemPath] = React.useState("/")
  const [view, setView] = React.useState("tile")  // "tile" or "list"
  const [filePreviewData, setFilePreviewData] = React.useState(undefined)
  const [demoMode, setDemoMode] = React.useState(false)

  const fetchApiData = (path) => {
    window.fetchRestApi("/api/v1/files" + path, "get", {"Authorization": "Basic " + window.getDemoCredential()}, null, handleUpdateFilesystemData)
  }
  
  React.useEffect( () => {
    fetchApiData(currentFilesystemPath)
  }, [])


  //
  // Handler for the tile/list view selector
  //
  const handleViewChange = (viewSelection) => {
    setView(viewSelection)
  }

  //
  // API retrieval callback when a filesystem view change is updated
  //
  const handleUpdateFilesystemData = (data) => {
    if (data.errorMessage != null && demoMode == false) {
      setDemoMode(true) 
      setCurrentFilesystemPath("/home/guest")
      const fileData = getDemoCurrentSubFileSystem("/home/guest")
      setCurrentFolderInfo(fileData)
    } else {
      if (data.responseBody[Object.keys(data.responseBody)[0]].hasOwnProperty("size")) {
        // It's a file, show the preview pane
        setFilePreviewData(data.responseBody)
      } else {
        setCurrentFolderInfo(data.responseBody)
      }
    }
  }

  //
  // Handler for a user selecting a subfolder inside the TileView or ListView components
  // 
  const handleFileViewFileClicked = (filename) => {
      const fullPathToClickedFile = filename.trim().startsWith("/") ? 
                                      ((currentFilesystemPath != "/") ? 
                                           currentFilesystemPath + filename : 
                                           filename
                                      )
                                      :
                                      ((currentFilesystemPath != "/") ?
                                           currentFilesystemPath + "/" + filename : 
                                           currentFilesystemPath + filename
                                      )
			if (filename.startsWith("/")) {
        setCurrentFilesystemPath(fullPathToClickedFile)
        setFilePreviewData(undefined)
      }
      if (!demoMode) fetchApiData(fullPathToClickedFile, "get", null, null, handleUpdateFilesystemData)
      else {
        if (filename.trim().startsWith("/")) {
          // Is a folder
					setCurrentFolderInfo(getDemoCurrentSubFileSystem(fullPathToClickedFile))
        } else {
          // Is a file
          setFilePreviewData({ [fullPathToClickedFile]: getDemoSubFileTree(fullPathToClickedFile)[filename]})
        } 
      }
  }

  // 
  // Handler for the user selecting a parent folder inside the FileNavigator.  Path is an index within
  // currentFilesystemPath
  //
  const handleFileNavigatorSelection = (path) => {
    setCurrentFilesystemPath(path)
    if (!demoMode) fetchApiData(path)
    else {
      const fileData = getDemoCurrentSubFileSystem(path)
      setCurrentFolderInfo(getDemoCurrentSubFileSystem(path))
    }
    setFilePreviewData(undefined)
  }

  //
  // In the demo mode, we want to be able to have a filesystem navigator component tell us what path the user wants to view.  This function
  // will return the subtree of the file system based on what the navigator is set to.
  //
  const getDemoCurrentSubFileSystem = (_currentFilesystemPath) => {
    const currentSubtree = _currentFilesystemPath.split("/").slice(1)
    var subtreePointer = window.getDemoHostFileSystem()["/"]
    for (const folder in currentSubtree) {
      if (subtreePointer.hasOwnProperty("/" + currentSubtree[folder])) {
        subtreePointer = subtreePointer["/" + currentSubtree[folder]]
      }
    }
    return { [_currentFilesystemPath] : subtreePointer }
  }

  // 
  // In demo mode, given a filesysem object (see the sample/default object structure in window.getDemoHostFileSystem()), return the contents 
  // of a nested folder specified by fullPathname
  //
  const getDemoSubFileTree = (fullPathname) => {
    const subTreeTokens = fullPathname.split("/").slice(1)
    var subtreePointer = window.getDemoHostFileSystem()["/"]
    for (const folder in subTreeTokens) {
      if (subtreePointer.hasOwnProperty("/" + subTreeTokens[folder])) {
        subtreePointer = subtreePointer["/" + subTreeTokens[folder]]
      } 
    }
    return subtreePointer
  }

  const apiCall=<>curl -ks -X GET \ <br />
                -H User-agent: host-manager \<br />
                -H Authorization: basic ********** \<br />
                /api/v1/files{currentFilesystemPath}{filePreviewData != null && "/" + Object.keys(filePreviewData)[0] + "?preview=true"}</>

  window.scrollTo(0, 0);
 
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginRight: "4vw"}}>
        <div style={{paddingBottom: "2.0em"}}>
          <span><FileNavigator currentFilesystemPath={currentFilesystemPath} folderClickedHandler={handleFileNavigatorSelection} /></span>
        </div>
        <div>
          <span style={{}}><ViewSwitch selectedView={view} viewChangeHandler={handleViewChange} /></span>
        </div>
      </div>
      {
        localStorage.getItem("hostmanager.options.showApiCalls") == "true" && <div style={{marginBottom: "1.0em"}}>
            <WarningBox 
              text=<pre style={{fontSize: "1.4em", textAlign: "left"}}>
                {apiCall}
              </pre> 
            />
          </div>
      }
      <div id="div-file-and-preview" style={{ marginRight: "3.0em", display: "flex", justifyContent: "space-between", height: "50vh"}}>
        <div id="div-file-view" style={{paddingBottom: "2.0em", marginLeft: view == "tile" ? "0em" : "10em"  }}>
					{
						view == "tile" ?
							<TileFileView files={currentFolderInfo} fileClickedHandler={handleFileViewFileClicked} /> :
							<ListFileView files={currentFolderInfo} fileClickedHandler={handleFileViewFileClicked} />
					}
        </div>
        {/*minHeight: "18.0em", maxHeight: "18.0em" */
          filePreviewData !== undefined && (
						<div style={{ width: "30vw", height: "50vh", marginRight: view == "tile" ? "0em" : "10em" }}>
												 <FilePreview
														fileType={filePreviewData[Object.keys(filePreviewData)[0]].type}
														filepath={Object.keys(filePreviewData)[0]}
														thumbnail={filePreviewData[Object.keys(filePreviewData)[0]].thumbnail}
                            previewText={filePreviewData[Object.keys(filePreviewData)[0]].text}
												 />
						</div>
          )
        }
      </div>
    </>
  )

}
