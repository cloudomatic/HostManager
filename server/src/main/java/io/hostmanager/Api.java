package io.hostmanager;

import org.json.JSONObject;
import org.json.JSONArray;

import io.hostmanager.ApiResponse;

//
// The Api class acts as the translator between the JSON/HTTP realm and the "pure Java" realm.  It functions as the controller in the Java realm, 
// manages any needed JSON -> Java mapping, and sets the HTTP response code, but is independent of the HTTP layer implementation, which is provided
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
  // Retrieve filesystem information
  //
  public static ApiResponse files(String path) throws Exception {
    return new ApiResponse(
        200,
        FileManager.getPathInfo(path)
    );
  }

  //
  // Get the server status
  // 
  //
  public static ApiResponse status(String subsystem) throws Exception {
    return new ApiResponse(
      200, 
      (new JSONObject((new Shell()).getOSStats())).
         put("status", "ok").
         put("localtime", (new java.util.Date()).toString())
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
