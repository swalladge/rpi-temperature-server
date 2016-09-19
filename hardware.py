

import config as cfg
import utils
import database
import random

import Adafruit_MCP9808.MCP9808 as MCP9808

class Temperature():
    def __init__(self, db, sensor_params=None):
        self.db = db

        # check if we need to fake the input/output
        if cfg.on_rpi:
            self.fake = False
            if sensor_params is not None:
                self.sensor = MCP9808.MCP9808(**sensor_params)
            else:
                self.sensor = MCP9808.MCP9808()
            self.sensor.begin()
        else:
            self.fake = True
            self.sensor = None

    def get_temp(self):
        if self.fake:
            return random.randint(0, 400) / 10
        return self.sensor.readTempC()

    def save_current(self):
        if self.fake:
            temp = random.randint(0, 400) / 10
        else:
            temp = self.sensor.readTempC()
        time = utils.now(True)
        return self.db.save_temperature(temp, time)

