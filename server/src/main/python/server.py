#!/usr/bin/python3

from flask import Flask, request
import file_manager
import shell
import commands
import files
import status

app = Flask(__name__)
api_context_root = "/api/v1"

#######################################
## API Routes
#######################################

@app.route(f"{api_context_root}/status")
def route_status():
  return status.get()

@app.route(f"{api_context_root}/commands", methods=['POST'])
def route_commands():
  return commands.post(request.json)

@app.route(f"{api_context_root}/files")
@app.route(f"{api_context_root}/files/")
def route_fileroot():
  return files.get("/")

@app.route(f"{api_context_root}/files/<path:pathargs>")
def route_files(pathargs):
  return files.get(f"/{pathargs}")

@app.route("/")
def static_content():
  return "<html></html>"

if __name__ == "__main__":
  app.run(host="0.0.0.0", port=8080, debug=True)

