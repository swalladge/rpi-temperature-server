#!/bin/bash

set -e

source env/bin/activate
exec python server/app.py "$@"
