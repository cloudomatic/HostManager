import React from 'react';
import FetchComponent from './FetchComponent';

/*
*
* A test wrapper for FetchComponent
*
*/


export default function FetchExample() {
  // The component only accepts JSON responses
  const [serviceResponse, setServiceResponse] = React.useState(undefined)
  // We set this when we didn't like the response, and we want FetchComponent to display the error in its preferred format
  //const [invalidServiceResponseMessage, setInvalidServiceResponseMessage] = React.useState(null)

  var url = "http://localhost:3000/api/v1/status" // This is a 200
  // This is a 200, but the response is not JSON
  // This is a 404, with a JSON response
  // Show a CORS error
  // Show a timeout

  const setServiceResponseContent = (data) => {
    setServiceResponse(data)
  }

  React.useEffect(() => {
    //window.fetchRest("http://localhost:3000/api/v1/status", "get", null, null,  setServiceResponseContent)
  }, []);
  

  if (serviceResponse != null) {
    return (
      <div style={{ height: "99vh", width: "100%", textAlign: "left"}}>
        <div>
          Response: <pre>{(serviceResponse != null) && JSON.stringify(serviceResponse, null, 2)}</pre>
        </div>
      </div>
    )
  } else {
    const useIconMode=false
    //return (<div></div>)
    //return (<div><FetchComponent responseCallback={setServiceResponseContent} url={"http://localhost:3000/api/v1/status"} iconMode={useIconMode} method="GET" /></div>)
    //return (<div><FetchComponent responseCallback={setServiceResponseContent} url={"http://localhost:3000/v1/api/status"} iconMode={useIconMode} method="GET" /></div>)
    //return (<FetchComponent responseCallback={setServiceResponseContent} url={"http://localhost:3001/api/v1/status"} iconMode={useIconMode} method="GET" />)
    //return (<FetchComponent responseCallback={setServiceResponseContent} url={"http://localhost:3000/api/v1/foobar"} iconMode={useIconMode} method="GET" />)
    //return (<FetchComponent responseCallback={setServiceResponseContent} url={"http://localhost:3000/api/v1/commands"} iconMode={useIconMode} method="GET" requestBody={{ "test": "one"}} />)
    //return (<FetchComponent responseCallback={setServiceResponseContent} url={"http://localhost:3000/api/v1/commands"} iconMode={useIconMode} method="POST" requestBody={{ "test": "one"}} />)
    return (<FetchComponent responseCallback={setServiceResponseContent} url={"http://localhost:3000/index.html"} iconMode={useIconMode} method="GET" />)
  }
}
