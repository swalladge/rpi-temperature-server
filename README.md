
## rpi-temperature-server

a work in progress...


# Test code

## Installation instructions

1. Connect the MCP9808 sensor to the I2C bus (as described in the [Adafruit
   tutorial](https://learn.adafruit.com/mcp9808-temperature-sensor-python-library/hardware).

2. Ensure that I2C is enabled on the RPi - some useful resources include an [Adafruit
   tutorial](https://learn.adafruit.com/adafruits-raspberry-pi-lesson-4-gpio-setup/configuring-i2c), or the
   [Archwiki](https://wiki.archlinux.org/index.php/Raspberry_Pi#I2C).

3. Ensure that at least `python` (version 3), `pip`, and `python3-venv` (sometimes included with python)  are installed on the RPi.

4. run the following commands on the RPi:

```
# clone the repo (alternatively use the https url)
git clone git@github.com:swalladge/rpi-temperature-server.git
cd rpi-temperature-server

# run the setup script
./setup.sh

# activate the virtualenv
source env/bin/activate

# now you're good to go!
# run the following to test the sensors
sudo python simpletest.py
```

