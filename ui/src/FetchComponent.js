import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Text from './Text.js';
import Tooltip from '@mui/material/Tooltip';

//
// A generic fetch component for an arbitrary REST API with an error box on failure 
//
export default function FetchComponent(props) {

  const url = props.url != null ? props.url : null
  const hideErrorBox = props.hideErrorBox !== undefined || props.hideErrorBox == true
  const method = props.method != null ? props.method : null

  // If set, run the fetch() in a loop
  const loopInterval = props.loopInterval != null ? props.loopInterval : null

  // The function to invoke with the data, when received
  const responseCallback = props.responseCallback != null ? props.responseCallback : null

  // Sometimes we don't have enough space to show an error box, so we'll show an icon with the error in the tooltip
  const iconMode = props.iconMode != null ? props.iconMode : false

  const [requestInProgress, setRequestInProgress] = React.useState(true)
  const [serviceResponseCode, setServiceResponseCode] = React.useState(null)
  const [serviceErrorMessage, setServiceErrorMessage] = React.useState(null)    // This is a helper message set by this component
  const [serviceErrorResponse, setServiceErrorResponse] = React.useState(null)  // This is the response body from the service when 2xx is not received, and is not necessarily JSON (e.g. when we get an HTML error page)
  const [serviceResponse, setServiceResponse] = React.useState(null)            // This is the service JSON response (if available) on success or error
  const [serviceException, setServiceException] = React.useState(null)          // This is the exception thrown when the fetch() call is not successful (e.g. CORS or a network timeout)
  // A switch to show the entire error response, as opposed to just a short summary
  const [moreSelected, setMoreSelected] = React.useState(false)

  const fetchData = () => {
    setRequestInProgress(true)
    var request = {
              method: props.method.toLowerCase(),
              headers : {
                "Authorization": "Basic " + window.getDemoCredential(),
                "Accept": "application/json"
              },
    }
    if (props.requestBody != null && props.method.toLowerCase() != "get") {
      request['Content-type'] = "application/json"
      request['body'] = JSON.stringify(props.requestBody)
    } 
    fetch(props.url, request).then(
        (response) => {
          return Promise.all([response.status, response.text()]);
        }
    ).then(
        (response) => {
          try {
            setRequestInProgress(false)
            setServiceResponseCode(response[0])
						if (199 < response[0]  && response[0] < 299) {
							try {
                const json = JSON.parse(response[1])
								responseCallback(json)
                setServiceResponse(json)
                setServiceErrorResponse(null)
                setServiceErrorMessage(null)
							} catch (exception) {
                setServiceResponse(null)
								setServiceErrorMessage("(HTTP " + response[0] + "): Expected a JSON response, received: " + window.truncateText(response[1], 12))
								setServiceErrorResponse(response[1])
								// Optionally also preserve the exception
								//setServiceException(exception)
							}
						} else {
              setServiceErrorMessage("HTTP " + response[0])
              if ( response[1] == null || response[1] == "") setServiceErrorResponse("(no content)")
              else setServiceErrorResponse(response[1])
            }
          } catch (exception) {
            setServiceErrorMessage(exception['message'])
            setServiceException(exception)
          }
        },
        (error) => {
          setServiceErrorMessage("This could be due to a transport layer error such as a CORS error, or a service timeout")
          setServiceException(error)
          setRequestInProgress(false)
        }
    )
  }

  React.useEffect( () => {
    if (loopInterval != null) {
			const timer = setInterval(() => {
				fetchData()
			}, loopInterval);
			return () => clearInterval(timer);
    } else fetchData()
  }, [])


  const showDetails = () => {
    if (!moreSelected) setMoreSelected(true)
  }

  if (requestInProgress && loopInterval == null) {
    // Show the wait glyph
    return (
      <div style={{ textAlign: 'center', paddingTop: !iconMode ? '5em' : '0em'}}>
        <div style={{ margin: 'auto'}}>
          <CircularProgress style={{ width: '1.5em', height: '1.5em'}} />
        </div>
      </div>
    )
  } else if (hideErrorBox) return null
  else if (serviceErrorMessage != null) {
    // We have a normal error
    if (!iconMode) {
      return (
        <div style={{ fontFamily: "Roboto, Helvetica", fontSize: 'o.9em', textAlign: 'center', paddingTop: '5em'}}>
          <div style={{ margin: "auto", maxWidth: "75%", width: "40em", borderRadius: "10px", border: "2px solid black", padding: "1em", backgroundColor: "yellow"}}>
            An error occurred accessing the service at: {url} <br />
            <div style={{textAlign: "left"}}>
            <blockquote>
              { /*
                serviceResponseCode != null &&
                <div>
                  Response code: <b>{(serviceResponseCode != null) && serviceResponseCode}</b>
                </div>
                */
              }
              Error: &nbsp;
                <b>
                {
                    (serviceErrorMessage != null) && (
                      serviceErrorMessage.trim().startsWith('{') ?
                        <blockquote>
                          <pre>
                            {serviceErrorMessage}
                          </pre>
                        </blockquote>
                        :
                        serviceErrorMessage
                    )
                }
                  </b><br />
                {
                  (serviceException != null) &&
                    <div style={{paddingTop: "0.3em"}}>
                      Exception: <b>{ serviceException['message']}</b>
                    </div>
                }
                {
                  ((serviceResponse != null) && JSON.stringify(serviceResponse).trim().startsWith('{')) ?
                  <div>
                    <blockquote>
                      <pre>
                        { JSON.stringify(JSON.parse(serviceResponse), null, 2)}
                      </pre>
                    </blockquote>
                  </div>
                  :
                  serviceErrorResponse != null &&
                    <div style={{paddingTop: "0.3em"}}>
                      Service response: <b>{ moreSelected ? <div style={{padding: "1.0em 0 0 1.0em"}}>{serviceErrorResponse}</div> : window.truncateText(serviceErrorResponse, 40)}</b>
                      { !moreSelected && serviceErrorResponse.length > 20 && <div style={{cursor: "pointer", paddingTop: "1.0em"}} onClick={showDetails}><Text><i>More details...</i></Text></div>}
                    </div>
                }
            </blockquote>
          </div>
        </div>
      </div>
    )
  } else {
    // iconMode - just show an icon with a hover over tooltip containing the error
    const formattedServiceErrorResponse = JSON.stringify(serviceResponse).trim().startsWith('{') ? JSON.stringify(JSON.parse(serviceResponse)) : 
       (
         (serviceErrorResponse != null && serviceErrorResponse.trim().startsWith("{")) ? window.truncateText(JSON.stringify(JSON.parse(serviceErrorResponse)), 50) : window.truncateText(serviceErrorResponse, 50)
       )
    var tooltipText = (
      <div>
        An error ocurred&nbsp;
        {/* serviceResponseCode != null && <span>{" (HTTP " + serviceResponseCode + ") "}</span>*/}
        accessing: {url}<br />
        <div style={{ textAlign: 'left' }}>
          {/*Response code: <b>{ (serviceResponseCode != null) && serviceResponseCode } </b><br />*/}
          Error: {serviceErrorMessage != null && serviceErrorMessage} <br />
          {(serviceException != null) && <div>Exception: <b>{serviceException["message"]}</b></div>}
          {(serviceErrorResponse != null) && <div> Service response: {formattedServiceErrorResponse}</div>}  
        </div>
      </div>
    )
    return (
      <Tooltip title={tooltipText}>
        <span>
          <ErrorOutlineIcon style={{ color: "red" }} />
        </span>
      </Tooltip>
    )
  }
  } else {
    // Successful response, and the parent component was pleased with the data
    return null
  }
}



