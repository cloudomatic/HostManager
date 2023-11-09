#!/usr/bin/python3

from flask import Flask, request
import file_manager

def get(path):
  try:
    return file_manager.get_path_info(path)
  except Exception as e:
    if 'no such file' in str(e).lower():
      return { "Error": "No such file or directory" }, 404
    else: return { "Error": str(e) }, 500

if __name__ == "__main__":
  get(None)


