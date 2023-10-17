import React from 'react';
import Text from './Text.js';


export default function WarningBox({text = ""}) {

  return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center"}}>
              <div style={{ maxWidth: "40vw", padding: "0.4em 1.0em 0.5em 1.0em", marginBottom: "10px", border: "2px solid " + window.getTheme().textColor,  backgroundColor: window.getTheme().warningLabelBackgroundColor }}>
                <Text fontSize="0.7em" fontWeight="normal" color={window.getTheme().warningLabelTextColor}>
                 <i>{text}</i>
                </Text>
              </div>
            </div>
  )
}
