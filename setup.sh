#!/bin/bash

# script to set up the environment ready for running

set -e

# create virtual env
pyvenv env
source env/bin/activate

# install requirements
pip install -r requirements.txt

# install adafruit library manually
# (didn't work with pip :shrug:)
git clone https://github.com/adafruit/Adafruit_Python_MCP9808.git
cd Adafruit_Python_MCP9808
sudo python setup.py install
cd ..

# anything else needed here...
