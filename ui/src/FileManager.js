import * as React from 'react';
import FileNavigator from './FileNavigator.js';
import FilePreview from './FilePreview.js';
import ListFileView from './ListFileView.js';
import TileFileView from './TileFileView.js';
import ViewSwitch from './ViewSwitch.js';
import WarningBox from './WarningBox.js'

// https://jsfiddle.net/yX3p9/7/

export default function FileManager() {

  const [fileSystem, setFileSystem] = React.useState(window.getDemoHostFileSystem())
  const [currentFilesystemView, setCurrentFilesystemView] = React.useState("/home/guest")
  const [view, setView] = React.useState("tile")
  const [filePreviewData, setFilePreviewData] = React.useState(undefined)

  //
  // Handler for the tile/list view selector
  //
  const handleViewChange = (viewSelection) => {
    setView(viewSelection)
  }

  //
  // Handler for a user selecting a subfolder inside the TileView or ListView components
  // 
  const handleFileViewFileClicked = (filename) => {
    console.log(filename)
    if (filename.startsWith("/")) setCurrentFilesystemView(currentFilesystemView + filename)
    else {
      const fileData = getCurrentSubFileSystem(currentFilesystemView)[filename]
      const subFileTree = getSubFileTree(currentFilesystemView + "/" + filename)
      var _filePreviewData = {}
      _filePreviewData[filename] = subFileTree[filename]
    }
    setFilePreviewData(_filePreviewData)
  }

  // 
  // Handler for the user selecting a parent folder inside the FileNavigator.  This is an index within
  // currentFilesystemView
  //
  const handleFileNavigatorSelection = (path) => {
    setCurrentFilesystemView(path)
    setFilePreviewData(undefined)
  }

  //
  // We want to be able to have a filesystem navigator component tell us what path the user wants to view.  This function
  // will return the subtree of the file system based on what this navigator is set to.
  //
  const getCurrentSubFileSystem = (_currentFilesystemView) => {
    const currentSubtree = _currentFilesystemView.split("/").slice(1)
    var subtreePointer = fileSystem["/"]
    for (const folder in currentSubtree) {
      if (subtreePointer.hasOwnProperty("/" + currentSubtree[folder])) {
        subtreePointer = subtreePointer["/" + currentSubtree[folder]]
      }
    }
    return subtreePointer
  }

  // 
  // Given a filesysem object (see the sample/default object structure above), return the contents 
  // of a nested folder specified by fullPathname
  //
  const getSubFileTree = (fullPathname) => {
    const subTreeTokens = fullPathname.split("/").slice(1)
    var subtreePointer = fileSystem["/"]
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
                /api/v1/files{currentFilesystemView}{filePreviewData != null && "/" + Object.keys(filePreviewData)[0] + "?preview=true"}</>

 
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginRight: "4vw"}}>
        <div style={{paddingBottom: "2.0em"}}>
          <span><FileNavigator currentFilesystemView={currentFilesystemView} folderClickedHandler={handleFileNavigatorSelection} /></span>
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
							<TileFileView files={getCurrentSubFileSystem(currentFilesystemView)} fileClickedHandler={handleFileViewFileClicked} /> :
							<ListFileView files={getCurrentSubFileSystem(currentFilesystemView)} fileClickedHandler={handleFileViewFileClicked} />
					}
        </div>
        {   /*minHeight: "18.0em", maxHeight: "18.0em" */
          filePreviewData !== undefined && (
						<div style={{ width: "30vw", height: "50vh", marginRight: view == "tile" ? "0em" : "10em" }}>
												 <FilePreview
														fileType={filePreviewData[Object.keys(filePreviewData)[0]].type}
														filename={Object.keys(filePreviewData)[0]}
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
