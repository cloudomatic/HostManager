package io.hostmanager;

import org.json.JSONObject;

//
// The response from executing a command.  Note that the getters are required if one wants to call (e.g.) new JSONObject(CommandResponse) for direct JSON mapping
// using solely org.json.JSONObject
//
public class CommandResponse {

  String response;
  int exitCode;

  public String getResponse() {
    return response;
  }

  public int getExitCode() {
    return exitCode;
  }

  public CommandResponse(int exitCode, String response) {
    this.response = response;
    this.exitCode = exitCode;
  }

}
