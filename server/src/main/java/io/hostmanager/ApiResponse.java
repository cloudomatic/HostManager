package io.hostmanager;

import org.json.JSONObject;

public class ApiResponse {

  JSONObject body;
  int statusCode;

  public ApiResponse(int statusCode, JSONObject body) {
    this.body = body;
    this.statusCode = statusCode;
  }

  public JSONObject getBody() {
    return body;
  }

  public int getStatusCode() {
    return statusCode;
  }

}
