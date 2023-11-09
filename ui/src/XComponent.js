import * as React from 'react';
import JsonFormEditorDemo from './JsonFormEditorDemo.js';

export default function XComponent() {

  return (
    <JsonFormEditorDemo />
  )

  if (false) return (
        <div style={{display: "flex", flexWrap: "wrap", height: "10.0em", backgroundColor: "red", justifyContent: "center"}}>
          <div id="item-1" style={{width: "20em", backgroundColor: "green", height: "10em"}} />
          <div id="item-1" style={{width: "20em", backgroundColor: "blue", height: "10em"}} />
          <div id="item-1" style={{width: "20em", backgroundColor: "yellow", height: "10em"}} />
        </div>
  );

  // We can make the right size a modal dialog when mobile==true
  const showRightPanel = true
  const leftPanelMinWidth = "20em"
  const rightPanelMinWidth = "20em"
  const leftPanelPercentOfScreen = showRightPanel ? "60%" : "95%"
  const rightPanelPercentOfScreen = "30%"
  
  if (false) return (
        <div style={{display: "flex", flexWrap: "wrap", height: "10.0em", paddingTop: "2.0em", backgroundColor: "red", justifyContent: "center"}}>
          <div id="left-panel" style={{minWidth: leftPanelMinWidth, width: leftPanelPercentOfScreen,  backgroundColor: "green", height: "10em"}} />
          {
            showRightPanel && <>
              <div id="spacer" style={{width: "4vw", backgroundColor: "blue", height: "10em"}} />
              <div id="right-panel" style={{minWidth: rightPanelMinWidth, width: rightPanelPercentOfScreen, backgroundColor: "yellow", height: "10em"}} />
            </>
          }
        </div>
  );


  if (false) return (
        <div id="x-root-div" style={{ minHeight: "10em",  width: "100%", backgroundColor: "lightGray"}}>
          <div id="x-responsive-columned-panel" style={{display: "flex", height: "10.0em", backgroundColor: "red", justifyContent: "center"}}>
            <div id="left-panel" style={{width: "100%", minWidth: "20.0em", maxWidth: "50vw", backgroundColor: "green", height: "10em"}} />
            <div id="center-spacer" style={{width: "4.0em", backgroundColor: "yellow", height: "10em"}} />
            <div id="right-panel" style={{width: "100%", minWidth: "10em", maxWidth: "20vw", backgroundColor: "blue", height: "10em"}} />
          </div>
        </div>
  );

}
