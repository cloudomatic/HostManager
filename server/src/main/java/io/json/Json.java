package io.json;

import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;

//   cd /src/server; mvn test -Dtest="TestLibs#test" ; kill -9 `ps -ef | grep java | grep -v grep | awk '{print $1}' | xargs`

//
// A simpler way to deal with JSONObject, and the ability to dereference multiple keys concatenated together, Python-style, e.g.
// jsonObject.asString("topLevel>nestedKey1>nestedKey2");
//
public class Json extends JSONObject {

  //private boolean isArray = false;

  public Json() {
    super();
  } 

  public Json(JSONObject object) {
    super(object.toString());
  }

  public Json(String object) throws JsonException {
    super(readFromString(object));
  }

  public static String readFromString(String object) throws JsonException {
    boolean isArray = false;
    if (object != null) {
      int iterator = 0;
      char[] characters = null;
      String objectOrArray = null;
      String quoteType = null;
      try {
        for (;iterator < object.length(); iterator++) {
          if (objectOrArray == null && object.charAt(iterator) == '{') objectOrArray = "object";
          else if (objectOrArray == null && object.charAt(iterator) == '[') objectOrArray = "array";
          else if (quoteType == null && object.charAt(iterator) == '"') quoteType = "double";
          else if (quoteType == null && object.charAt(iterator) == '\'') quoteType = "single";
          if (objectOrArray != null && quoteType != null) break;
        }
      } catch (Exception exception) {
        throw new JsonException("JSON string parsing failed at column " + iterator + ": " + exception);
      }
      if (objectOrArray == null || quoteType == null) throw new JsonException("Invalid JSON object, expected [ or { and one or more keys in single or double quotes");
      if (objectOrArray.equals("object")) {
        if (quoteType == "double") return object;
        else {
          return object.replace("'", "\"");
        }
      } else {
        isArray = true;
        if (quoteType == "double") return (new JSONObject()).put("array", new JSONArray(object)).toString();
        else return (new JSONObject()).put("array", new JSONArray(object.replace("'", "\""))).toString();
      }
    } else return null;
  }

  //
  // This object is an array if it consists of a single key "array" whose value is a JSONArray
  //
  public boolean isArray() {
    return this.has("array");
  }

  public Json[] asArray(String key) throws JsonException {
    if (key == null) throw new JsonException("null cannot be de-referenced as a JSON key");
    else {
      JSONArray jsonObjectArray = null;
      try {
          String[] keys = key.split("[ .,>]+");
          JSONObject jsonObject = this;
          for (int k = 0; k < keys.length - 1; k++) {
            jsonObject = jsonObject.getJSONObject(keys[k]);
          }
          if (!(jsonObject.getJSONArray(keys[keys.length - 1]) instanceof JSONArray)) throw new JsonException("Element at [" + key + "] is not an array of objects");
          jsonObjectArray = jsonObject.getJSONArray(keys[keys.length - 1]);
      } catch (Exception exception) {
          throw new JsonException("Failed to dereference JSON key '" + key + "': " + exception);
      }
      try {
        Json[] jsonArray = new Json[jsonObjectArray.length()];
        for (int i=0; i < jsonObjectArray.length(); i++) {
          jsonArray[i] = new Json(jsonObjectArray.getJSONObject(i));
          //System.out.println("DEBUG: asArray(): " + i  + ": " + jsonObjectArray.getJSONObject(i).toString());
          //System.out.println("DEBUG: asArray(): " + i  + ": " + jsonArray[i].toString());
        }
        //for (int i=0; i < jsonObjectArray.length(); i++) {
        //  System.out.println("DEBUG: asArray(): " + jsonArray[i].toString(2));
        //}
        return jsonArray;
      } catch (Exception exception) {
        throw new JsonException("Failed to parse elements in JSON key '" + key + "' as an array of Json objects: " + exception);
      }
    }
  }

  public static Json fromBase64String(String string) throws JsonException {
    throw new JsonException("fromBase64String() not implemented");
  }

  public String asBase64String() throws JsonException {
    throw new JsonException("asBase64String() not implemented");
  }

  public String[] asStringArray(String key) throws JsonException {
    if (key == null) throw new JsonException("null cannot be de-referenced as a JSON key");
    else {
      java.util.List<Object> stringList = null;
      try {
          String[] keys = key.split("[ .,>]+");
          JSONObject jsonObject = this;
          for (int k = 0; k < keys.length - 1; k++) {
            jsonObject = jsonObject.getJSONObject(keys[k]);
          }
          stringList = jsonObject.getJSONArray(keys[keys.length - 1]).toList();
      } catch (Exception exception) {
          throw new JsonException("Failed to dereference JSON key '" + key + "': " + exception);
      }
      try {
        String[] stringArray = new String[stringList.size()];
        for (int i=0; i < stringList.size(); i++) stringArray[i] = (String)stringList.get(i);
        return stringArray;
      } catch (Exception exception) {
          throw new JsonException("Failed to parse elements in JSON key '" + key + "' as an array of Strings: " + exception);
      }
    }
  }

  public int[] asIntArray(String key) throws JsonException {
    if (key == null) throw new JsonException("null cannot be de-referenced as a JSON key");
    else {
      java.util.List<Object> intList = null;
      try {
        String[] keys = key.split("[ .,>]+");
        JSONObject jsonObject = this;
        for (int k = 0; k < keys.length - 1; k++) {
          jsonObject = jsonObject.getJSONObject(keys[k]);
        }
        intList = jsonObject.getJSONArray(keys[keys.length - 1]).toList();
      } catch (Exception exception) {
        throw new JsonException("Failed to dereference JSON key '" + key + "': " + exception);
      }
      try {
        int[] intArray = new int[intList.size()];
        for (int i=0; i < intList.size(); i++) intArray[i] = (int)intList.get(i);
        return intArray;
      } catch (Exception exception) {
          throw new JsonException("Failed to parse elements in JSON key '" + key + "' as an array of int: " + exception);
      }
    }
  }

  public long[] asLongArray(String key) throws JsonException {
    throw new JsonException("asLongArray() not implemented");
  }

  public String asString(String key) throws JsonException {
    if (key == null) throw new JsonException("null cannot be de-referenced as a JSON key");
    else {
        try {
          String[] keys = key.split("[ .,>]+");
          JSONObject jsonObject = this;
          for (int k = 0; k < keys.length - 1; k++) {
            jsonObject = jsonObject.getJSONObject(keys[k]);
          }
          return jsonObject.getString(keys[keys.length - 1]);
        } catch (Exception exception) {
          throw new JsonException("Failed to dereference JSON key '" + key + "': " + exception);
        }
    }
  }

  public int asInt(String key) throws JsonException {
    if (key == null) throw new JsonException("null cannot be de-referenced as a JSON key");
    else {
        try {
          String[] keys = key.split("[ .,>]+");
          JSONObject jsonObject = this;
          for (int k = 0; k < keys.length - 1; k++) {
            jsonObject = jsonObject.getJSONObject(keys[k]);
          }
          return jsonObject.getInt(keys[keys.length - 1]);
        } catch (Exception exception) {
          throw new JsonException("Failed to dereference JSON key '" + key + "': " + exception);
        }
    }
  }

  public Json json(String key) throws JsonException {
    if (key == null) throw new JsonException("null cannot be de-referenced as a JSON key");
    else {
        try {
          String[] keys = key.split("[ .,>]+");
          JSONObject jsonObject = this;
          for (String k : keys) {
            jsonObject = jsonObject.getJSONObject(k);
          }
          return new Json(jsonObject.toString());
        } catch (Exception exception) {
          throw new JsonException("Failed to dereference JSON key '" + key + "': " + exception);
        }
    }
  }

  //
  // Function to retrieve the last key in a key sequence like 'parentKey>nestedKey>nextNestedKey'
  // as a JSONObject, suitable for inserting/de-referencing a value.  If any keys are missing, and createNestedKeys
  // is true, we will create a new JSONObject value
  //
  private JSONObject getLeafKeyReference(String keys, boolean createNestedKeys) throws JsonException {
        try {
          String[] arrayOfKeys = keys.split("[ .,>]+");
          JSONObject jsonObject = this;
          for (int k = 0; k < arrayOfKeys.length - 1; k++) {
            if (jsonObject.has(arrayOfKeys[k]) && jsonObject.getJSONObject(arrayOfKeys[k]) instanceof JSONObject) jsonObject = jsonObject.getJSONObject(arrayOfKeys[k]);
            else if (!jsonObject.has(arrayOfKeys[k])) { 
              if (createNestedKeys) jsonObject = jsonObject.put(arrayOfKeys[k], new JSONObject()).getJSONObject(arrayOfKeys[k]);
              else throw new JsonException("Not Found");
            } else throw new JsonException("Found key " + arrayOfKeys[k] + ", but it is not a JSON object");
          }
          return jsonObject;
        } catch (Exception exception) {
          throw new JsonException("Failed to dereference JSON key(s) '" + keys + "': " + exception);
        }
  }

  private String getLastKey(String keys) {
    String[] arrayOfKeys = keys.split("[ .,>]+");
    return arrayOfKeys[arrayOfKeys.length - 1];
  }


  public Json put(String key, Json value) throws JsonException {
    if (key == null) throw new JsonException("null cannot be inserted as a JSON key");
    else {
      if (value != null) getLeafKeyReference(key, true).put(getLastKey(key), new JSONObject(value.toString()));
      else getLeafKeyReference(key, true).put(getLastKey(key), NULL);
      return this;
    }
  }


/*
  public Json put(String key, Json value) throws JsonException {
    if (key == null) throw new JsonException("null cannot be inserted as a JSON key");
    else {
        try {
          String[] keys = key.split("[ .,>]+");
          JSONObject jsonObject = this;
          for (int k = 0; k < keys.length - 1; k++) {
            if (jsonObject.has(keys[k]) && jsonObject.getJSONObject(keys[k]) instanceof JSONObject) jsonObject = jsonObject.getJSONObject(keys[k]);
            else if (!jsonObject.has(keys[k])) {
              jsonObject = jsonObject.put(keys[k], new JSONObject()).getJSONObject(keys[k]);
            }
          }
          if (value != null) jsonObject.put(keys[keys.length - 1], new JSONObject(value.toString()));
          else jsonObject.put(keys[keys.length - 1], NULL);
          return this;
        } catch (Exception exception) {
          throw new JsonException("Failed to dereference JSON key '" + key + "': " + exception);
        }
    }
  }
*/
  
  public Json put(String key, int[] intArray) throws JsonException {
    if (key == null) throw new JsonException("null cannot be inserted as a JSON key");
    else {
      JSONArray jsonArray = new JSONArray();
      for (int i : intArray) jsonArray.put(i);
      getLeafKeyReference(key, true).put(getLastKey(key), jsonArray);
      return this;
    }
  }

  public Json put(String key, String[] stringArray) throws JsonException {
    if (key == null) throw new JsonException("null cannot be inserted as a JSON key");
    else {
      JSONArray jsonArray = new JSONArray();
      for (String s : stringArray) jsonArray.put(s);
      getLeafKeyReference(key, true).put(getLastKey(key), jsonArray);
      return this;
    }
  }

  public Json put(String key, long[] longArray) throws JsonException {
    if (key == null) throw new JsonException("null cannot be inserted as a JSON key");
    else {
      JSONArray jsonArray = new JSONArray();
      for (long i : longArray) jsonArray.put(i);
      getLeafKeyReference(key, true).put(getLastKey(key), jsonArray);
      return this;
    }
  }

  public Json put(String key, String value) throws JsonException {
    if (key == null) throw new JsonException("null cannot be inserted as a JSON key");
    else {
      getLeafKeyReference(key, true).put(getLastKey(key), value);
      return this;
    }
  }


  public Json put(String key, long value) throws JSONException {
    if (key == null) throw new JSONException("null cannot be inserted as a JSON key");
    else {
      try {
        getLeafKeyReference(key, true).put(getLastKey(key), value);
        return this;
      } catch (JsonException jsonException) {
        throw new JSONException(jsonException);
      }
    }
  }


  public Json put(String key, int value) throws JSONException {
    if (key == null) throw new JSONException("null cannot be inserted as a JSON key");
    else {
      try {
        getLeafKeyReference(key, true).put(getLastKey(key), value);
        return this;
      } catch (JsonException jsonException) {
        throw new JSONException(jsonException);
      }
    }
  }


/*
  public Json put(String key, String value) throws JsonException {
    if (key == null) throw new JsonException("null cannot be inserted as a JSON key");
    else {
        try {
          String[] keys = key.split("[ .,>]+");
          JSONObject jsonObject = this;
          for (int k = 0; k < keys.length - 1; k++) {
            if (jsonObject.has(keys[k]) && jsonObject.getJSONObject(keys[k]) instanceof JSONObject) jsonObject = jsonObject.getJSONObject(keys[k]);
            else if (!jsonObject.has(keys[k])) {
              jsonObject = jsonObject.put(keys[k], new JSONObject()).getJSONObject(keys[k]);
            }
          }
          jsonObject.put(keys[keys.length - 1], value);
          return this;
        } catch (Exception exception) {
          throw new JsonException("Failed to dereference JSON key '" + key + "': " + exception);
        }
    }
  }
*/
  public void test() throws JsonException {
    String testString = "{ \"this\" : \"that\" }";
    if (!(new Json(testString)).getString("this").equals("that")) throw new JsonException("Failed to parse: " + testString);
    if (!(new Json(testString)).asString("this").equals("that")) throw new JsonException("Failed to parse: " + testString + " using asString()");
    testString = "{ \"this\": [ \"that\" ] }";
    if (!(new Json(testString)).getJSONArray("this").getString(0).equals("that")) throw new JsonException("Failed to parse: " + testString);
    testString = "{'is':'ok', 'this': [ 'that', 'two', 'three' ]}";
    if (!(new Json(testString)).getJSONArray("this").getString(0).equals("that")) throw new JsonException("Failed to parse: " + testString);
    testString = "{ 'this' : { 'another' : 'that' } }";
    if (!(new Json(testString)).getJSONObject("this").getString("another").equals("that")) throw new JsonException("Failed to parse: " + testString);
    if (!(new Json(testString)).json("this").getString("another").equals("that")) throw new JsonException("Failed to parse: " + testString);
    testString = "{ 'one' : { 'two' : { 'three' : 'that', 'number' : 1 }  } }";
    if (!(new Json(testString)).json("one>two").getString("three").equals("that")) throw new JsonException("Failed to parse: " + testString);
    if (!(new Json(testString)).asString("one.two.three").equals("that")) throw new JsonException("Failed to parse: " + testString);
    if ((new Json(testString)).asInt("one>two>number") != 1) throw new JsonException("Failed to parse: " + testString);
    if ((new Json(testString)).json("one.two").asInt("number") != 1) throw new JsonException("Failed to parse: " + testString);

    testString = "{ 'one' : { 'two' : [ 'one', 'two', 'three' ],  'three': [1, 2, 3]}}";
    if (!(new Json(testString)).asStringArray("one>two")[1].equals("two")) throw new JsonException("Failed to parse: " + testString);
    if (!(new Json(testString)).json("one").asStringArray("two")[1].equals("two")) throw new JsonException("Failed to parse: " + testString);
    if ((new Json(testString)).asIntArray("one>three")[1] != 2) throw new JsonException("Failed to parse: " + testString + " as an array of int");
    testString = "{ 'one' : { 'two' : [ { 'three' : 'four' }, {'five' : 'six'} ] } }";
    if (!(new Json(testString)).asArray("one>two")[1].asString("five").equals("six")) throw new JsonException("Failed to parse: " + testString + " as an array of objects");
    //Json[] jsonArray = (new Json(testString)).asArray("one>two");
    //jsonArray[1].getString("five");
    //for (int i=0; i < jsonArray.length; i++) System.out.println("debug: " + jsonArray[i].toString(2));
    try {
      if ((new Json(testString)).asArray("one").length > 0) throw new JsonException("Expected exception parsing a non-array key");
    } catch (Exception exception) {
      if (! (exception + "").contains("JSONObject[\"one\"] is not a JSONArray")) throw new JsonException("Expected exception parsing a non-array key");
    }
    testString = "{ 'one' : { 'two' : [ 1, 2, 3 ] }, 'seven' : {'eight':'nine'} }";
    try {
      if ((new Json(testString)).asStringArray("one>two").length == 3) throw new JsonException("Failed to parse: " + testString);
    } catch (Exception exception) {
      if (!exception.toString().contains("Failed to parse elements in JSON key")) throw new JsonException("Didn't get the expected exception in parsing invalid elements from " + testString);
    }
    //System.out.println(   (new Json(testString)).put("three", new Json("{'this':{'and':'that'}}")).toString(2)   );
    if (! (new Json(testString)).put("three", new Json("{'this':{'and':'that'}}")).asString("three>this>and").equals("that")) throw new JsonException("Failed to parse: " + testString); 
    if (! (new Json(testString)).put("three>four", "string" ).asString("three>four").equals("string")) throw new JsonException("Failed to locate key 'string' in " + testString);
    //System.out.println( (new Json(testString)).put("this>and", "that").toString(2));
    //System.out.println( (new Json()).put("one>two>three>four", new Json("{'foo': 'bar'}")).toString(2));
  }
}
