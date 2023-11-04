#!/usr/bin/python3

import os,sys
import json
import subprocess
import datetime

#
# Returns (exit code, response) where response is a string with stdout and std combined
#
def run_shell_command(command, cwd = "/"):
  if command is not None and len(command) > 0:
    response = subprocess.run(command, shell=True, cwd=cwd, capture_output=True)
    stdout = response.stderr.decode('utf-8')
    stderr = response.stdout.decode('utf-8')
    if len(stdout) > 0 and len(stderr) > 0: raise Exception("run_shell_command(): Exception: subprocess.run() returned both stdout and stderr")
    return (response.returncode, stdout + stderr)
  else:
    raise Exception("ERROR: run_shell_command(): Empty command: <" + command + "> passed as argument")
    

#
# Returns 
#
def get_os():
  exit_code, response = run_shell_command("uname -a")
  return response

#
#
#
def get_os_stats():
  '''
    String ipAddress = null;
    String memory = null;
    String cpus = null;
    String containers = "22";
    String processes= null;
    String cpuUtilization = null;
    String freeMemory = null;
  '''

  return {
    "localtime": str(datetime.datetime.now().time()),
    "hostname": get_local_node_name(),
    "os": get_os()
  }

#
#
#
def get_local_node_name():
    """ Get the local host name, noting that ${HOSTNAME} or `hostname` may be unreliable """
    if os.environ.get("HOSTNAME") is not None:
      return os.environ.get("HOSTNAME")
    else:
      exit_code, hostname=run_shell_command("hostname")
      if hostname is not None and len(str(hostname)) > 0:
        return hostname.strip()
      else:
        return "UNKNOWN_NODE"



#######################################
## Unit tests
#######################################

def test_run_commands():
  exit_code, stderr = run_shell_command('ls -l /dude', '/')
  if exit_code != 1: raise Exception("test_run_commands(): Expected exit code 1 from 'ls -l /dude'")
  exit_code, stdout = run_shell_command('ls -l /etc', '/')
  if exit_code != 0: raise Exception("test_run_commands(): Expected exit code 1 from 'ls -l /etc'")
  if 'conf' not in stdout: raise Exception("test_run_commands(): Expected 'conf' in output from 'ls -l /etc'")
  print(f"{get_os_stats()}")




def run_all_unit_tests():
  test_run_commands()
  print(f"{os.path.basename(__file__)}: Unit tests passed")

if __name__ == "__main__":
  run_all_unit_tests()

