

import random
from tornado.log import gen_log

import Adafruit_MCP9808.MCP9808 as MCP9808
from server import utils
import config as cfg


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
            self.last_temp = random.randint(-100, 400) / 10
            self.dir = random.choice([-1, 1])

    def get_temp(self):
        if self.fake:

            # don't let it get out of bounds
            if 40 - self.last_temp < 2:
                self.dir = -1
            if -10 - self.last_temp > 2:
                self.dir = 1

            # generate the new temperature
            diff = random.randint(0, 90) / 100
            self.last_temp = t = self.last_temp + (diff * self.dir)

            # randomly change the trend
            if random.randint(0, 1000) > 965:
                self.dir = -self.dir

            return t

        return self.sensor.readTempC()

    def save_current(self):
        temp = self.get_temp()
        time = utils.now(True)
        gen_log.info('Logging temperature: {:0.5f}°C at timestamp {}'
                     .format(temp, time))
        return self.db.save_temperature(temp, time)
