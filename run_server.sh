#!/bin/bash

set -e

source env/bin/activate
exec python -m server.app "$@"
