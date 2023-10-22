package io.hostmanager;

import org.json.JSONObject;
import org.json.JSONArray;

import io.hostmanager.ApiResponse;

//
// The Api class acts as the translator between the JSON/HTTP realm and the "pure Java" realm.  It functions as the controller in the Java realm, 
// manages all JSON -> Java mapping, and sets the HTTP response code, but is independent of the HTTP layer implementation, which is provided
// by the ServerController class.  If all HTTP/REST implementations were JAX-RS compliant, two controllers would not be required.  This layer can
// also be inserted into a non-HTTP/REST framework such as a Kafka/MQ/event-driven solution
//
// In addition to abstracting the HTTP/JSON implementation from the HTTP service provider, it enables unit testing of the API using a JSON object generator
// to permit tests to be created via (e.g.) strings/text files as opposed to unit tests strictly using POJOs (as well as a Jackson/GSON-style object mapper)
// and integration tests using (e.g.) cURL. 
//
// What else does this class not handle?
//
//                Auth - This is another area that is too site-specific to be handled in the generic Api class presented here
//                Versioning - For organizations that require rigorous adherence to a versioned API specification, versioning is better handled in the ServerController for the above reasons
//                Exception handling - In this implementation, exceptions that cannot be handled by the Api class will be passed on to the client as HTTP 500 responses
//                                     with the java exception visible in the response body.  For implementations with strict information security requirements against exposing
//                                     back-end internals, the exception can be stripped in ServerController to the frustration of the calling client
//
// Note that the Java implementation classes are all "pure functions" (static classes) which return a Java object (essentially a struct) as opposed to a strictly 
// OO model where the Api class sends a command object to the Shell class for execution.
//
// While this can reduce readability (i.e. there is no Command.java file to reference to find out what the attributes of a command are) of this class, it 
// increases readability of the Shell class by allowing it to execute "pure functions" which makes writing unit tests more straightfoward
//
// 

public class Api {

  //
  // Get the server status
  // 
  //
  public static ApiResponse status(String subsystem) throws Exception {
    JSONObject status = (new JSONObject()).put("status", "ok");
    status.put("localtime", (new java.util.Date()).toString());
    // When calling /status, we want to know what's actively deployed.  Having the Git commit enables a rapid deployment
    // of a fix branch without having to reverse-engineer what's deployed
    for (String variable : (new String("RELEASE_LABEL IMAGE_TAG VERSION GIT_COMMIT GIT_BRANCH")).split(" ")) {
      if (System.getenv(variable) != null) status.put(variable, System.getenv(variable));
    }
    String hostname = null;
    String ipAddress = null;
    String memory = null;
    String cpus = null;
    String containers = "22";
    String processes= null;
    String cpuUtilization = null;
    String freeMemory = null;
    
    Shell shell = new Shell();
    try {
      hostname = shell.runCommand(null, "hostname").getResponse().trim();
    } catch (Exception exception) {
      hostname = exception + "";
    }
    try {
      if (shell.getOS().equals("mac")) ipAddress = shell.runCommand(null, "ipconfig getifaddr en0").getResponse().trim();
      else ipAddress = shell.runCommand(null, "hostname -i").getResponse().trim();
    } catch (Exception exception) {
      ipAddress = exception + "";
    }
    try {
      if (shell.getOS().equals("mac")) memory = shell.runCommand(null, "sysctl -a | grep memsize | awk '{print $2}'").getResponse().trim();
      else memory = shell.runCommand(null, "cat /proc/meminfo | grep MemTotal | awk '{print $2}'").getResponse().trim();
    } catch (Exception exception) {
      memory = exception + "";
    }
    try {
      if (shell.getOS().equals("mac")) cpus = shell.runCommand(null, "sysctl -a | grep core_count | awk '{print $2}'").getResponse().trim();
      cpus = shell.runCommand(null, "cat /proc/cpuinfo | grep processor | wc -l").getResponse().trim();
    } catch (Exception exception) {
      cpus = exception + "";
    }
    try {
      processes = shell.runCommand(null, "ps -ef | wc -l").getResponse().trim();
    } catch (Exception exception) {
      processes = exception + "";
    }
    try {
      if (shell.getOS().equals("mac")) cpuUtilization = shell.runCommand(null, "ps -A -o %cpu | awk '{s+=$1} END {print s}'").getResponse().trim();
      else cpuUtilization = shell.runCommand(null, "grep 'cpu ' /proc/stat | awk '{usage=($2+$4)*100/($2+$4+$5)} END {print usage}'").getResponse().trim();
    } catch (Exception exception) {
      cpuUtilization = exception + "";
    }
    try {
      if (shell.getOS().equals("mac")) freeMemory = "Not available (MacOS)";
      else freeMemory = shell.runCommand(null, "free | grep Mem | awk '{print $6}'").getResponse().trim();
    } catch (Exception exception) {
      freeMemory = exception + "";
    }

    status.put("hostname", hostname);
    status.put("ipAddress", ipAddress);
    status.put("memory", memory);
    status.put("cpus", cpus);
    status.put("containers", containers);
    status.put("processes", processes);
    status.put("cpuUtilization", cpuUtilization);
    status.put("freeMemory", freeMemory);

    return new ApiResponse(
      200, 
      status
    );
  }

  //
  // Execute a command
  //
  //
  public static ApiResponse commands(JSONObject command) throws Exception {
    return new ApiResponse(
        200,
        new JSONObject((new Shell()).runCommand(
              command.getString("cwd"),
              command.getString("command")
        )).put(
          "command", command
        )
    );
  }

}
