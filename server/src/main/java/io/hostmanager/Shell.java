package io.hostmanager;

import io.hostmanager.CommandResponse;

//
// A class to provide an interface with the shell of any host
//
public class Shell {

  //
  // Run a shell command on the local host
  //
  public CommandResponse runCommand(String cwd, String command) throws Exception {
    try {
      io.logger.Logger.log("TRACE", command.toString());
      String[] commandArgs = { "/bin/sh", "-c", command };
      Process process = Runtime.getRuntime().exec(commandArgs, null, new java.io.File(cwd));
      // TODO: Add Windows/Mac support
      // Process process = Runtime.getRuntime().exec("cmd /c dir C:\\Users\\joeuser");
      // Process process = Runtime.getRuntime().exec("cmd /c hello.bat", null, new File("C:\\Users\\joeuser\\"));
      StringBuilder output = new StringBuilder();
      java.io.BufferedReader reader = new java.io.BufferedReader(new java.io.InputStreamReader(process.getInputStream()));
      String line;
      while ((line = reader.readLine()) != null) {
        output.append(line + "\n");
      }
      int exitCode = process.waitFor();
      io.logger.Logger.log("TRACE", "exitCode=" + exitCode);
      if (exitCode != 0) {
        reader = new java.io.BufferedReader(new java.io.InputStreamReader(process.getErrorStream()));
        while ((line = reader.readLine()) != null) {
          output.append(line + "\n");
        }
      }
      return new CommandResponse(exitCode, output.toString());
    } catch (Exception exception) {
      throw new Exception("" + exception);
    }
  }

}
