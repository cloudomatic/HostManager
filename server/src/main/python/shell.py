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
    return (response.returncode, stdout.strip() + stderr.strip())
  else:
    raise Exception("ERROR: run_shell_command(): Empty command: <" + command + "> passed as argument")
    

#
# Returns 
#
def get_os():
  exit_code, uname = run_shell_command("uname -a")
  os = uname.split(" ")[0]
  if "os" == "Darwin": return "macos"
  else: return os.lower()

#
#
#
def get_os_stats():
  stats = {
    "localtime": str(datetime.datetime.now().time()),
    "hostname": get_local_node_name(),
    "os": get_os(),
    "containers": "22",
  }
  metrics = [ 
    ["ipAddress", "hostname -i"],
    ["memory", "cat /proc/meminfo | grep MemTotal | awk '{print $2}'"],
    ["cpus", "cat /proc/cpuinfo | grep processor | wc -l"],
    ["cpuUtilization", "grep 'cpu ' /proc/stat | awk '{usage=($2+$4)*100/($2+$4+$5)} END {print usage}'"],
    ["freeMemory", "free | grep Mem | awk '{print $6}'"],
    ["processes", "ps -ef | wc -l"]
  ]
  for metric in metrics:
    try:
      stats[metric[0]] = run_shell_command(metric[1])[1]
    except Exception as e:
      stats[metric[0]] = str(e)
  return stats

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

