#!/usr/bin/python3

from flask import Flask
import file_manager
import shell

app = Flask(__name__)
api_context_root = "/api/v1"
 
#
#
#
def run_shell_command(command, workingDirectory = "/"):
    if command is not None and len(command) > 0:
      return str(subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT).stdout.read())
    else:
      raise Exception("ERROR: run_shell_command(): Empty command: <" + command + "> passed as argument")

#
#
#
def get_local_node_name():
    """ Get the local host name, noting that ${HOSTNAME} or `hostname` may be unreliable """
    if os.environ.get("HOSTNAME") is not None:
      return os.environ.get("HOSTNAME")
    else:
      hostname=run_shell_command("hostname")
      if hostname is not None and len(str(hostname)) > 0:
        return hostname.strip()
      else:
        return "UNKNOWN_NODE"

#######################################
## Unit tests
#######################################
def run_all_tests():
  return None

#######################################
## API Handlers
##
## Controller functions for the API
##  
#######################################
def handle_get_files(path):
  return file_manager.get_path_info(path)

def handle_post_commands(body):
  return {}

def handle_get_status(subsystem):
  return {}

#######################################
## API Routes
#######################################

@app.route(f"{api_context_root}/status")
def status():
  return { "works" : "ok" }

@app.route(f"{api_context_root}/commands", methods=['POST'])
def commands():
  request.json
  return { "works" : "ok" }

@app.route(f"{api_context_root}/files")
@app.route(f"{api_context_root}/files/")
def fileroot():
  return handle_get_files("/")

@app.route(f"{api_context_root}/files/<path:pathargs>")
def files(pathargs):
  print(f"{pathargs}")
  return handle_get_files(f"/{pathargs}")

@app.route("/")
def static_content():
  return "<html></html>"

if __name__ == "__main__":
  app.run(host="0.0.0.0", port=80, debug=True)

