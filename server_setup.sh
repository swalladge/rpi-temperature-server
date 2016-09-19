#!/bin/bash

# script to set up the environment ready for running

set -e

# create virtual env
# use `python3` for compatibility with systems still using python2 as default
python3 -m venv env
source env/bin/activate

# note: we are in the venv now, so python/pip will be the right version

# install requirements
pip install -r server/requirements.txt

# install adafruit library manually
# (didn't work with pip :shrug:)
git clone https://github.com/adafruit/Adafruit_Python_MCP9808.git
cd Adafruit_Python_MCP9808
python setup.py install
cd ..

# anything else needed here...
