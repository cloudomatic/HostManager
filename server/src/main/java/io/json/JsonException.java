package io.json;

public class JsonException extends Exception {
  
  public JsonException() {
    super();
  }

  public JsonException(Exception exception) {
    super(exception);
  }

  public JsonException(String exception) {
    super(exception);
  }

}
