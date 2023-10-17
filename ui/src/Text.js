import * as React from 'react';

export default function Text(props) {

  const id="text"

  return (
		<font 
		  id={"text-" + id}
		  style={{
		    fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif",
		    fontSize: props.fontSize !== undefined ? props.fontSize : "0.9em",
		    color: props.color !== undefined ? props.color : window.getTheme().textColor,
		    padding: props.padding !== undefined ? props.padding : "0em",
		    fontWeight: props.fontWeight !== undefined ? props.fontWeight : "normal"
		  }}
		>
		  {props.children}
		</font>
  )
}
