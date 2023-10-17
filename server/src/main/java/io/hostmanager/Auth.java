package io.hostmanager;

import org.json.JSONObject;

public class Auth {

  public static String base64Decode(String encodedValue) {
    return new String(java.util.Base64.getDecoder().decode(encodedValue), java.nio.charset.StandardCharsets.UTF_8);
  }
  
  public static String authenticate(String header) throws Exception {
    if (header == null || !header.trim().toLowerCase().startsWith("basic")) throw new Exception("A basic auth header is the only supported authentication method");
    else {
      try {
        String basicAuthCredential = base64Decode(header.split(" ")[1]);
        if (basicAuthCredential.split(":")[1].equals(System.getenv("ADMIN_PASSWORD"))) return basicAuthCredential.split(":")[0];
        else return null;
      } catch (Exception exception) {
        throw new Exception("Unable to decode the authentication header: " + exception);
      }
    }
  }

  public static ApiResponse authorize(String path, String header) throws Exception {
    String identity = authenticate(header);
    if (identity == null) return new ApiResponse(401, (new JSONObject()).put("error", "Authentication failed"));
    else if (!identity.equals("admin")) return new ApiResponse(403, (new JSONObject()).put("error", "Authorization failed"));
    else return null;
  }

}
