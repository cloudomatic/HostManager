#!/usr/bin/python3

import os,sys
import json
import shell

# These are files that we'll return a thumbnail on
image_file_extensions = "png gif jpg jpeg bmp"

# These are files we'll return a brief amount of preview text on in the "text" JSON attribute
text_file_extensions = "sh txt conf js css html"


#
# Get the file extension from a string file name
#
def get_file_extension(file_path):
  if os.path.splitext(file_path)[1].startswith('.') and len(os.path.splitext(file_path)[1]) > 1:
    return os.path.splitext(file_path)[1].split('.')[1]
  else: return None

#
# Extract the columns from a string produced by the ls -l command
#
def extract_file_info(ls_entry):
  while '  ' in ls_entry:
    ls_entry = ls_entry.replace('  ', ' ')
  fields = ls_entry.split(' ')
  file_info = {
    "name": fields[8],
    "permissions": fields[0],
    "user": fields[2],
    "group": fields[3],
    "lastModified": " ".join(fields[5:8]),
  }
  if file_info['permissions'].startswith('dr'): file_info['type'] = "directory"
  else: file_info['size'] = int(f"{fields[4]}")
  if 'type' not in file_info: file_info['type'] = "unknown"
  return file_info

#
#
#
def get_path_info(file_path):
  isfile = os.path.isfile(file_path)
  path_info = {}
  try:
    exit_code, response = shell.run_shell_command(f"ls -l {file_path}")
    if exit_code > 0: raise Exception(f"Could not read file details for {file_path}." + response)
    folder_info = response.split("\n")
    for file in folder_info:
      if not(file.startswith('total')):
        file_info = extract_file_info(file)
        if file_info['type'] != 'directory':
          file_extension = get_file_extension(file_info['name'])
          if file_extension is not None:
            if not(isfile): fullpathtofile = f"{file_path}/{file_info['name']}"
            else: fullpathtofile = file_path
            if file_extension in image_file_extensions:
                file_info['type'] = "image"
            elif file_extension in text_file_extensions:
                file_info['type'] = "text"
                with open(fullpathtofile) as file:
                  file_info['text'] = file.read(2000)
        if isfile: return { file_path: file_info }
        else: 
          if file_info['type'] == 'directory': path_info[f"/{file_info['name']}"] = file_info
          else: path_info[file_info['name']] = file_info
    return { file_path: path_info }
  except Exception as e:
    raise Exception(f"Could not read file details for {file_path}.  Base exception: " + str(e))
  



#
# Simple JSON dump
#
def d(object):
  print(f"{json.dumps(object, indent=2)}")

#######################################
## Unit tests
#######################################

def test_get_path_info():
  try:
    get_path_info("/resolv.conf")
  except Exception as e:
    if "no such file" not in str(e).lower(): raise Exception("test_get_path_info(): Expected a 'no such file' exception retrieving /resolve.conf, instead received exception"  + str(e))
  if extract_file_info('-rw-r--r--    1 root     root             7 Jun 14 15:03 alpine-release')['name'] != 'alpine-release': raise Exception("test_get_path_info(): Expected file name 'alpine-release' from extract_file_info()")
  if get_path_info("/etc")['/etc']['/ca-certificates']['permissions'].startswith('dr') is False: raise Exception("test_get_path_info(): Expected permissions 'dr...' on folder ca-certificates")
  if get_path_info('/etc/resolv.conf')['/etc/resolv.conf']['size'] != 97: raise Exception(f"test_get_path_info(): Expected size=97 in get_file_info('/etc/resolv.conf').  Size was returned as {get_path_info('/etc/resolv.conf')['/etc/resolv.conf']['size']}")
  if get_path_info('/etc')['/etc']['udhcpd.conf']['size'] != 5636: raise Exception("test_get_path_info(): Expected size=5636 for file udhcpd.conf in get_file_info('/etc')")
  if get_path_info('/etc')['/etc']['udhcpd.conf']['size'] != 5636: raise Exception("test_get_path_info(): Expected size=5636 for file udhcpd.conf in get_file_info('/etc')")

def run_all_unit_tests():
  test_get_path_info()
  print(f"{os.path.basename(__file__)}: Unit tests passed")

if __name__ == "__main__":
  run_all_unit_tests()

