#!/usr/bin/python3

from flask import Flask, request
import shell

def post(body, path=None):
  exit_code, response = shell.run_shell_command(body['command'], body['cwd'])
  return { 
    "response": response,
    "exitCode": exit_code,
    "command": {
      "cwd": body['cwd'],
      "command": body['command']
    }
  }

