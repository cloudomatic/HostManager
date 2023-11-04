#!/usr/bin/python3

from flask import Flask, request
import file_manager
import shell

app = Flask(__name__)
api_context_root = "/api/v1"

#######################################
## API Controller
##
## Controller functions for the API
##  
#######################################

def handle_get_files(path):
  return file_manager.get_path_info(path)

def handle_post_commands(body):
  exit_code, response = shell.run_shell_command(body['command'], body['cwd'])
  return { 
    "response": response,
    "exitCode": exit_code,
    "command": {
      "cwd": body['cwd'],
      "command": body['command']
    }
  }

def handle_get_status(subsystem):
  return shell.get_os_stats()

#######################################
## API Routes
#######################################

@app.route(f"{api_context_root}/status")
def status():
  return { "works" : "ok" }

@app.route(f"{api_context_root}/commands", methods=['POST'])
def commands():
  return handle_post_commands(request.json)

@app.route(f"{api_context_root}/files")
@app.route(f"{api_context_root}/files/")
def fileroot():
  return handle_get_files("/")

@app.route(f"{api_context_root}/files/<path:pathargs>")
def files(pathargs):
  return handle_get_files(f"/{pathargs}")

@app.route("/")
def static_content():
  return "<html></html>"

if __name__ == "__main__":
  app.run(host="0.0.0.0", port=80, debug=True)

