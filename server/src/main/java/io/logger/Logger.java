package io.logger;

public class Logger {

  // TO DO: Use a security context to add the user's identity to each message

  public static void log(String level, String message) {
    if (System.getenv("TRACE") != null && System.getenv("TRACE").equalsIgnoreCase("true")) System.out.println((new java.util.Date()).toString() + ": " + level.toUpperCase() + ": " + message);
  }

}
