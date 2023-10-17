import * as React from 'react';
import Text from './Text'

export default function HostDashboard() {

  const fontSize = "1.0em"
  const fontSizeMultiplier = 10 

  const [hostData, setHostData] = React.useState({
    "hostname": "Demo Server",
    "stats": {
      "Hostname": "Demo Server",
      "Address": "192.168.2.194",
      "Virtual Memory": "4GB",
      "CPUs": 2,
      "Containers": 22,
      "Processes": 58,
      "CPU Utilization": "10%",
      "Free Memory": "480M"
    }
  })

  React.useEffect(() => {
    const timer = setInterval(() => {
      var _hostData = {...hostData}
      _hostData.stats['CPU Utilization'] = (10 + Date.now() % 3) + "%"
      _hostData.stats['Free Memory'] = (400 + Date.now() % 10) + "M"
      setHostData(_hostData)
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getLeftColumnWidth = () => {
    var longestKeyLength = 0
    Object.keys(hostData.stats).map((key, index) => {
      if (key.length > longestKeyLength) longestKeyLength = key.length
    })
    return (fontSizeMultiplier * longestKeyLength) + "px"
  }

  const getRightColumnWidth = () => {
    var longestValueLength = 0
    Object.keys(hostData.stats).map((key, index) => {
      if (hostData.stats[key].length > longestValueLength) longestValueLength = hostData.stats[key].length
    })
    return (8 * longestValueLength) + "px"
  }

  return (
    <div>
      {/*
              <div id="Title" style={{paddingBottom: "5.0em"}}>
                <span id="label" style={{ paddingRight: "0.2em"}}>
                  <Text padding="0em 0.2em 0em 0.0em" fontSize="1.1em"
                    Hostname:
                  </Text>
                </span>
                <span id="value">
                  <Text padding="0em 0.2em 0em 0.0em" fontSize="1.1em">
                    Demo Server
                  </Text>
                </span>
              </div>
      */}
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center"}}>
                <div>
                            { 
                              Object.keys(hostData.stats).map((key, index) => (
                                <div key={"stat-entry" + index} style={{width: "100%", display: "flex", flexWrap: "wrap"}}>
				    <div style={{textAlign: "right", width: getLeftColumnWidth()}}>
				      <Text padding="0em 0.7em 0em 0.0em" fontSize={fontSize}>
					{key}
				      </Text>
				    </div>
				    <div style={{border: "1px solid " + window.getTheme().textColor}}></div>
				    <div>
				      <Text padding="0em 0.0em 0em 0.7em" fontSize={fontSize}>
					{hostData.stats[key]}
				      </Text>
				    </div>
                                </div>
                              ))
                            }
                </div>
              </div>
    </div>
  );

}
