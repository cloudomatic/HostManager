#!/usr/bin/python3

import os,sys
import json

# These are files that we'll return a thumbnail on
image_file_extensions = "png gif jpg jpeg bmp"

# These are files we'll return a brief amount of preview text on in the "text" JSON attribute
text_file_extensions = "sh txt conf js css html"

#
#
#
def get_directory_contents(file_path):
  contents = {}
  for file in os.listdir(file_path):
    if os.path.isfile(f"{file_path}/{file}"):
      contents[file] = get_file_info(f"{file_path}/{file}")
    else:
      contents[f"/{file}"] = {}
  return contents

#
#
#
def get_file_extension(file_path):
  if os.path.splitext(file_path)[1].startswith('.') and len(os.path.splitext(file_path)[1]) > 1:
    return os.path.splitext(file_path)[1].split('.')[1]
  else: return None

#
#
#
def get_file_info(file_path, thumbnail_only=False):
  try:
    if os.path.isdir(file_path): return {}
    file_info = {}
    file_info['size'] = f"{os.path.getsize(file_path)}B"
    file_extension = get_file_extension(file_path)
    if file_extension is not None:
      if file_extension in image_file_extensions:
        file_info['type'] = "image"
      elif get_file_extension(file_path) in text_file_extensions:
        file_info['type'] = "text"
        with open(file_path) as file:
          file_info['text'] = file.read(2000)
    if 'type' not in file_info: file_info['type'] = "unknown"
    return file_info
  except Exception as e:
    raise Exception(f"Could not read file details for {file_path}.  Base exception: " + str(e))

#
#
#
def get_path_info(file_path):
  if os.path.isdir(file_path):
    return { file_path: get_directory_contents(file_path) }
  else:
    return { file_path: get_file_info(file_path) }

#######################################
## Unit tests
#######################################

def test_get_path_info():
  if get_file_info('/etc/resolv.conf')['size'] != "97B": raise Exception("test_get_path_info() FAILURE: Expected size=97B in get_file_info('/etc/resolv.conf')")
  #print(f"{json.dumps(get_path_info('/etc'), indent=2)}")
  if get_path_info('/etc')['/etc']['udhcpd.conf']['size'] != "5636B": raise Exception("test_get_path_info() FAILURE: Expected size=5636B for file udhcpd.conf in get_file_info('/etc')")
  if get_path_info('/etc/')['/etc/']['udhcpd.conf']['size'] != "5636B": raise Exception("test_get_path_info() FAILURE: Expected size=5636B for file udhcpd.conf in get_file_info('/etc')")
  #print(f"{json.dumps(get_path_info('/etc/resolv.conf'), indent=2)}")
  #print(f"{get_path_info('/)}")

def run_all_unit_tests():
  test_get_path_info()
  print(f"{os.path.basename(__file__)}: Unit tests passed")

if __name__ == "__main__":
  run_all_unit_tests()

