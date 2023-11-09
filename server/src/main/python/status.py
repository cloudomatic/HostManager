#!/usr/bin/python3

from flask import Flask, request
import shell

def get(path=None, query=None):
  return shell.get_os_stats()
