import * as React from 'react';
import Icon from './Icon';

export default function ViewSwitch(props) {


  const selectedColor = window.getTheme().componentAreaIconColor //"rgb(45, 47, 54)"
  const unselectedColor =window.getTheme().componentAreaIconColorUnselected //"rgb(139, 139, 143)"

  const handleSelect = (event) => {
    if (event.currentTarget.id.includes("tile")) props.viewChangeHandler("tile")
    else if (event.currentTarget.id.includes("list")) props.viewChangeHandler("list")
  }

  return (
    <div>
       <div style={{ display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center"}}>
          <div>
            <div style={{width: "100%", display: "flex", flexWrap: "wrap"}}>
							<div id="div-tile" style={{textAlign: "right"}} onClick={handleSelect}>
								<Icon 
                  name="<TileIcon>" 
                  transform="scale(0.75)"
                  color={props.selectedView == "tile" ? selectedColor : unselectedColor}
                />
							</div>
							<div id="spacer" style={{ width: "0.2vw"}} />
							<div id="div-list" onClick={handleSelect}>
								<Icon 
                  name="<ListIcon>" 
                  transform="scale(0.75)"
                  color={props.selectedView == "list" ? selectedColor : unselectedColor}
                />
							</div>
            </div>
          </div>
       </div>
    </div>
  );

}
