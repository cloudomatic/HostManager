#!/usr/bin/python3

import os,sys
import urllib3
import requests
import json

base_url = None

def trace(message):
  if os.environ.get("TRACE") is not None and os.environ['TRACE'].lower() == "true":
    print(f"{message}")

def run_tests():
  trace("run_tests(): >")
  test_call("STATUS", "Get the server status", "/api/v1/status", "GET", None, 200, "status", "ok", "localtime")
  test_call("LIST_ROOT_FILESYSTEM", "Get the files in /", "/api/v1/commands", "POST", { "cwd": "/", "id": "001", "command": "ls -l /" }, 200, "response", None, "exitCode")
  test_call("LIST_NONEXISTENT_FOLDER", "Get the files in /foobar", "/api/v1/commands", "POST", { "cwd": "/", "id": "001", "command": "ls -l /foobar" }, 200, "exitCode", 1, "No such file")
  test_call("STDOUT_ERR", "Write to stdout/err", "/api/v1/commands", "POST", { "cwd": "/", "id": "001", "command": "echo test >out 2>err; cat out" }, 200, "exitCode", 0, "test")
  test_call("STDOUT_ERR", "Write to stdout/err", "/api/v1/commands", "POST", { "cwd": "/", "id": "001", "command": "ls /foobar >out 2>err; cat err" }, 200, "exitCode", 0, "No such file")
  trace("run_tests(): <")
  print("Done.")

def test_call(test_id, test_description, path, method, body, expected_response_code, expected_response_json_key, expected_response_json_value, expected_response_string):
  trace(f"test_call({test_id}): >")
  trace(f"test_call({test_id}): Calling {method} {json.dumps(body)})")
  if True: 
    trace(f"test_call(): Calling {base_url}{path}")
    response = requests.request(
      method.upper(),
      f"{base_url}{path}",
      headers={
        "Authorization": "Basic 1234",
        "Content-type": "application/json"
      },
      json=body,
      auth=requests.auth.HTTPBasicAuth('admin', 'admin'),
      verify=False
    )
  try:
    json_response = response.json()
  except: 
    json_response = {}
  if json_response is not None:
    trace(f"test_call({test_id}): Response {json.dumps(json_response, indent=2)}")
  text_response = response.text
  if expected_response_code != None:
    if expected_response_code != response.status_code:
      error(test_id, test_description, f"Unexpected response code on {method} {path} ({str(response.status_code)}), expected {expected_response_code}", text_response)
    if expected_response_json_key is not None and expected_response_json_key not in json_response:
      error(test_id, test_description, f"The response body key '{expected_response_json_key}' was not found in the JSON response", text_response)
    elif expected_response_json_value is not None and json_response[expected_response_json_key] != expected_response_json_value:
      error(test_id, test_description, f"Key '{expected_response_json_key}' was found in the JSON response, but the value found ({json_response[expected_response_json_key]}) != {expected_response_json_value}", text_response)
    if expected_response_string is not None and str(expected_response_string) not in json.dumps(json_response):
      error(test_id, test_description, f"The expected string value '{expected_response_string}' was not found in the JSON response", text_response)
    return json_response

def error(test_id, test_description, message, text):
  print(f"Test failure: {test_id}: {message} ({test_description}).  The full response was {text}")
  exit()

if __name__ == '__main__':
  urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
  if len(sys.argv) < 2:
    print(f"Usage: IntegrationTests.py <base-url>")
    print("")
    print(f"       <base-url>:  The base URL to the API service (e.g. http://localhost)\n")
    print(f"       Set TRACE=true to see test execution")
    print("")
  else:
    base_url = sys.argv[1]
    run_tests()
