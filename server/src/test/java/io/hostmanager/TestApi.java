package io.hostmanager;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Assertions;
import org.json.JSONObject;
import io.hostmanager.Api;
import io.hostmanager.Shell;


public class TestApi {

  @Test
  public void testShellCommand() throws Exception {
    CommandResponse commandResponse = (new Shell()).runCommand("/", "ls -l");
    Assertions.assertEquals(commandResponse.getExitCode(), 0);
    Assertions.assertTrue(commandResponse.getResponse().contains("root     root"));
  }

  public static JSONObject toJson(String json) {
    return new JSONObject(json.replace("^", "\""));
  }

  @Test
  public void testCommandViaApi() throws Exception {
    ApiResponse apiResponse = Api.status(null);
    Assertions.assertEquals(apiResponse.getStatusCode(), 200);
    Assertions.assertTrue(apiResponse.getBody().has("localtime"));
    
    String[][] tests = {
      {"{ ^cwd^: ^/^, ^id^: ^001^, ^command^: ^ls -l /^ }", "0", "root     root"},
      {"{ ^cwd^: ^/^, ^id^: ^001^, ^command^: ^ls -l /foobar^ }", "1", "No such file"},
      {"{ ^cwd^: ^/^, ^id^: ^001^, ^command^: ^echo test >out 2>err; cat out^ }", "0", "test"},
      {"{ ^cwd^: ^/^, ^id^: ^001^, ^command^: ^ls /foobar >out 2>err; cat err^ }", "0", "No such file"}
    };
    for (String[] test : tests) {
      System.out.println("Testing command: " + test[0]);
      apiResponse = Api.commands(toJson(test[0]));
      Assertions.assertEquals(apiResponse.getStatusCode() + "", "200");
      Assertions.assertEquals(apiResponse.getBody().getInt("exitCode") + "", test[1]);
      Assertions.assertTrue(
        apiResponse.getBody().has("response") && 
        apiResponse.getBody().getString("response").contains(test[2])
      );
    }
  }

}
