package io.hostmanager;

import io.hostmanager.CommandResponse;

//
// A class to provide an interface with the shell of any host
//
public class Shell {

  public static String operatingSystem = null;

  //
  // Get some basic stats about the current hosts's runtime
  //
  public java.util.Map getOSStats() {
    java.util.Map<String, Object> stats = new java.util.HashMap<String, Object>();
    for (String variable : (new String("RELEASE_LABEL IMAGE_TAG VERSION GIT_COMMIT GIT_BRANCH")).split(" ")) {
      if (System.getenv(variable) != null) stats.put(variable, System.getenv(variable));
    }
    String hostname = null;
    String ipAddress = null;
    String memory = null;
    String cpus = null;
    String containers = "22";
    String processes= null;
    String cpuUtilization = null;
    String freeMemory = null;
    try {
      hostname = runCommand(null, "hostname").getResponse().trim();
    } catch (Exception exception) {
      hostname = exception + "";
    }
    try {
      if (getOS().equals("mac")) ipAddress = runCommand(null, "ipconfig getifaddr en0").getResponse().trim();
      else ipAddress = runCommand(null, "hostname -i").getResponse().trim();
    } catch (Exception exception) {
      ipAddress = exception + "";
    }
    try {
      if (getOS().equals("mac")) memory = runCommand(null, "sysctl -a | grep memsize | awk '{print $2}'").getResponse().trim();
      else memory = runCommand(null, "cat /proc/meminfo | grep MemTotal | awk '{print $2}'").getResponse().trim();
    } catch (Exception exception) {
      memory = exception + "";
    }
    try {
      if (getOS().equals("mac")) cpus = runCommand(null, "sysctl -a | grep core_count | awk '{print $2}'").getResponse().trim();
      cpus = runCommand(null, "cat /proc/cpuinfo | grep processor | wc -l").getResponse().trim();
    } catch (Exception exception) {
      cpus = exception + "";
    }
    try {
      processes = runCommand(null, "ps -ef | wc -l").getResponse().trim();
    } catch (Exception exception) {
      processes = exception + "";
    }
    try {
      if (getOS().equals("mac")) cpuUtilization = runCommand(null, "ps -A -o %cpu | awk '{s+=$1} END {print s}'").getResponse().trim();
      else cpuUtilization = runCommand(null, "grep 'cpu ' /proc/stat | awk '{usage=($2+$4)*100/($2+$4+$5)} END {print usage}'").getResponse().trim();
    } catch (Exception exception) {
      cpuUtilization = exception + "";
    }
    try {
      if (getOS().equals("mac")) freeMemory = "Not available (MacOS)";
      else freeMemory = runCommand(null, "free | grep Mem | awk '{print $6}'").getResponse().trim();
    } catch (Exception exception) {
      freeMemory = exception + "";
    }
    stats.put("hostname", hostname);
    stats.put("ipAddress", ipAddress);
    stats.put("memory", memory);
    stats.put("cpus", cpus);
    stats.put("containers", containers);
    stats.put("processes", processes);
    stats.put("cpuUtilization", cpuUtilization);
    stats.put("freeMemory", freeMemory);
    return stats;
  }

  //
  // Get an identifier describing what the local operating system is
  //
  public String getOS() {
    if (operatingSystem != null) return operatingSystem;
    else {
      try {
        operatingSystem = "UNKNOWN";
        String uname = runCommand(null, "uname").getResponse();
        String osLabel = uname.toLowerCase().split(" ")[0];
        if ((new String("darwin mach")).contains(osLabel.toLowerCase())) operatingSystem="mac";
        else if (osLabel.toLowerCase().contains("linux")) operatingSystem="linux";
        return operatingSystem;
      } catch (Exception exception) {
        return "Unknown OS: " + exception;
      }
    }
  }

  //
  // Run a shell command on the local host
  //
  public CommandResponse runCommand(String cwd, String command) throws Exception {
    try {
      if (cwd == null) cwd = "/";
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
