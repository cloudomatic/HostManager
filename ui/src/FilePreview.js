import * as React from 'react';
import Icon from './Icon';
import Text from './Text';

export default function FilePreview({ filename = "unknown", fileType = "unknown", previewText = "", fileSize = "?KB", thumbnail="" }) {

  //const iconColor="rgb(57, 113, 189)"
  //const iconColor="rgb(69, 116, 181)"
  //const iconColor="rgb(114, 148, 194)"
  //const iconColor="white"
  const iconColor=window.getTheme().primaryColor
  const shade01Color=window.getTheme().shadedBoxColor
  const shade02Color=window.getTheme().primaryColor


  var fileDisplayName = "Unknown"
  if (filename !== "undefined") {
    if (filename.startsWith("/")) fileDisplayName = filename.substring(1, filename.length)
    else fileDisplayName = filename
  }

  const downloadFile = (filename, type, text) => {
    var json = { hello: "world" }
    const link = document.createElement("a")
    var file = new Blob(["a file"], {type: 'text/csv'})
    link.download = "file.txt"
    link.href = URL.createObjectURL(file)
    link.click()
  }
  
  const getFilePreviewDisplayableContent = (fileType, thumbnail, previewText) => {
    switch (fileType) {
            case 'image':
              // Remove minHeight for the <img> here to show the normal size (don't stretch to fit the preview pane)
              return <div id="div-file-thumbnail-frame" style={{height: "40vh", display: "flex", backgroundColor: "none", overflow: "hidden"}}>
                  <img
                    src={thumbnail}
                    style={{justifyContent: "center", minHeight: "34vh", maxWidth: "30vw", margin: "auto", maxHeight: "34.5vh", width: "auto", height: "auto"}}
                  />
                </div>
            case 'text':
              return <div style={{ padding: "1.5em 0em 0em 0em", display: "table", backgroundColor: "none", minHeight: "35vh", maxHeight: "35vh", margin: "auto"}}>
                       <div style={{ backgroundColor: "none", "margin": "auto", verticalAlign: "middle", display: "table-cell" }}>
												 <Icon
													 name="TextFile"
													 transform="scale(2.4)"
													 color={iconColor}
												 />
												 <div id="div-text-preview" style={{padding: "1.0em 0em 0em 0em", overflow: "hidden", backgroundColor: "none", height: "100%"}}>
													 <Text fontSize="0.8em" style={{}}>
														   {window.truncateText(previewText, 500)}
													 </Text>
												 </div>
                       </div>
                     </div>
            default:
              return <div style={{padding: "1.5em 0em 0em 0em", height: "100%", margin: "auto",  display: "table",  minHeight: "30vh", backgroundColor: "none", height: "100%"}}>
                       <div style={{ verticalAlign: "middle", display: "table-cell" }}>
												 <Icon
													 name="GenericFile"
													 transform="scale(4.2)"
													 color={iconColor}
												 />
                       </div>
                     </div>
          }
  }

  return (
    <div id="div-file-preview-outer" style={{width: "100%", minHeight: "30vh", maxHeight: "30vh", minWidth: "30vw", textAlign: "center", backgroundColor: "lightGreen", margin: "auto"}}>
      <div id="div-file-preview-inner" style={{}}>
        <div id="div-file-thumbnail" style={{backgroundColor: shade01Color, padding: "1.2em", overflow: "hidden", minHeight: "40vh"}}>
        {
          getFilePreviewDisplayableContent(fileType, thumbnail, previewText)
        }
        </div>
        {/*
        <div id="div-file-details" style={{padding: "0.5em 0em 0.5em 0em", backgroundColor: shade02Color, display: "table", width: "100%"}}>
            <div style={{"display": "table-cell"}}>
              <Icon name="DownloadFile" />
            </div>
						<div style={{"display": "table-cell"}}> 
              <div style={{}}>
								<Text color={window.getTheme().primaryColorComplement} fontWeight="bold" fontSize="0.9em">
									{fileDisplayName}
								</Text>
								<Text color={window.getTheme().primaryColorComplement} fontSize="0.8em">
									205KB
								</Text>
              </div>
						</div>
        </div>
        */}
        <div style={{display: "table", padding: "0.5em 0em 0.5em 0em", backgroundColor: shade02Color, width: "100%"}}>
          <div style={{display: "table-cell", verticalAlign: "middle" }}>
            <div style={{float: "left", marginLeft: "1.0em", paddingTop: "0.5em", cursor: "pointer"}} onClick={downloadFile}>
              <Icon name="DownloadFile" color={window.getTheme().primaryColorComplement}/>
            </div>
            <div style={{float: "right", marginRight: "1.0em", textAlign: "right" }}>
							<div>
									<Text color={window.getTheme().primaryColorComplement} fontWeight="bold" fontSize="0.9em">
										{window.truncateText(fileDisplayName, 40)}
									</Text>
							</div>
							<div>
									<Text color={window.getTheme().primaryColorComplement} fontSize="0.8em">
										205KB
									</Text>
							</div>
          </div>
      </div>
</div>
      </div>
    </div>
  )

 
  
}
