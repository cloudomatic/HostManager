package io.hostmanager;

import org.json.JSONObject;
import com.fasterxml.jackson.databind.ObjectMapper; 
import com.fasterxml.jackson.databind.ObjectWriter; 

public class ApiResponse {

  JSONObject body;
  int statusCode;

  public ApiResponse(int statusCode, JSONObject body) {
    this.body = body;
    this.statusCode = statusCode;
  }

  public ApiResponse(int statusCode, java.util.HashMap<String, Object> map) throws Exception {
    this(statusCode, new JSONObject(map));
  }

  public ApiResponse(int statusCode, Object body) throws Exception {
    ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
    body = new JSONObject(ow.writeValueAsString(body));
  }

  public JSONObject getBody() {
    return body;
  }

  public int getStatusCode() {
    return statusCode;
  }

}
