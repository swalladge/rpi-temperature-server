
## rpi-temperature-server

a work in progress...

The code and instructions here are for the Adafruit MCP9808 Temperature Sensor.
Hardware information can be found at [Adafruit Temperature Sensor Guide](https://cdn-learn.adafruit.com/downloads/pdf/adafruit-mcp9808-precision-i2c-temperature-sensor-guide.pdf)
This is known to work on both ArchLinux and Raspbian

# Test code

## Hardware

The temperature sensor can be bought in Australia through (for example) [Little Bird Electronics](https://littlebirdelectronics.com.au).

The useful parts are:

- [MCP9808 Temperature Sensor](https://littlebirdelectronics.com.au/products/mcp9808-high-accuracy-i2c-temperature-sensor-breakout-board) which comes on a small board and with a header strip.
- [Breadboard](https://littlebirdelectronics.com.au/products/breadboard-mini-modular-green), any will do.
- [Jumper wires M-F](https://littlebirdelectronics.com.au/products/jumper-wires-premium-6-m-f-pack-of-10) - male end goes into the breadboard, female onto the RPi GPIO pins.
- while you are ordering, it is always handy to have [M-M](https://littlebirdelectronics.com.au/products/jumper-wires-premium-6-m-m-pack-of-10) and [F-F](https://littlebirdelectronics.com.au/products/jumper-wires-premium-6-f-f-pack-of-10) jumper wires also, just in case.

You can do without the breadboard, if you like, and connect with F-F jumper wires direct from the GPIO pins to the header pins on the MCP9808.
Or use a [GPIO ribbon cable](https://littlebirdelectronics.com.au/products/raspberry-pi-gpio-ribbon-cable-40-pin-6-rpi2-b) to get out of the RPi and go from there to the breadboard using M-M or direct to MCP9808 header using M-F.
Pick an option, depending on your RPi case and how neat you want it to look.

## Installation instructions

1. The hardware comes with a separate header strip. 
   [Solder](https://learn.adafruit.com/adafruit-mcp9808-precision-i2c-temperature-sensor-guide/wiring) 
   the header strip to the MCP9808 board. 
   Connect the MCP9808 sensor to the I2C bus (as described in the [Adafruit
   tutorial](https://learn.adafruit.com/mcp9808-temperature-sensor-python-library/hardware)).
   Connect Pi Gnd to MCP9808 Gnd, Pi 3.3V to MCP9808 Vdd, Pi SCL to MCP9808 SCL, Pi SCA to MCP9808 SCA.
   The schematic in the tutorial is of an RPi2 Model B. The pinouts are the same on an RPi3.

2. Ensure that I2C is enabled on the RPi - some useful resources include an [Adafruit
   tutorial](https://learn.adafruit.com/adafruits-raspberry-pi-lesson-4-gpio-setup/configuring-i2c), or the
   [Archwiki](https://wiki.archlinux.org/index.php/Raspberry_Pi#I2C).

    On Raspbian, the basics are:

    ```
    sudo raspi-config
    ```

    - Choose Advanced Options
    - Choose I2C
    - Say yes to enable
    - Reboot

3. Python 3 is required to install and run the software. You will also need `pip` and the `venv` module for setting up
   virtual environments. Note: you may run into trouble with the setup script when using python < 3.4, due to pip not
   being installed in the virtual environment by default. Therefore this project only officially supports python 3.4 or
   a later version.

    ```
    # Note: On Raspbian (and possible other distros), python2 may be the default
    # To check, run:
    python --version
    # if the output shows something like:
    # Python 2.7.12
    # then you may need to install python 3 to run the setup script.
    # Raspbian also requires installing the `python3-venv` package.
    ```

4. Run the following commands on the RPi:

    ```
    # clone the repo
    git clone https://github.com/swalladge/rpi-temperature-server.git
    cd rpi-temperature-server

    # run the setup script
    ./setup.sh

    # activate the virtualenv
    # note: once in the venv, python and pip will be the correct version, regardless of the system default
    source env/bin/activate

    # now you're good to go!
    # run the following to test the sensors
    sudo python simpletest.py
    ```
