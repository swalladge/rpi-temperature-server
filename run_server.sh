#!/bin/bash

set -e

if [ ! -f "config.json" ]; then
  echo "config.json does not exist in the server directory!"
  echo "creating new one from config.template.json"
  cp server/config.template.json config.json
  echo "please edit config.json to your liking and re-run this script to start the server"
  exit 1
fi

source env/bin/activate
exec python -m server.app "$@"
