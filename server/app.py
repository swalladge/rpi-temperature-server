#!/usr/bin/env python
# -*- coding: utf-8 -*-

# main application server

import tornado.ioloop
from tornado.web import Application, url
from tornado.escape import json_decode
from tornado.ioloop import PeriodicCallback

import json

import database
import config as cfg
import utils
from basehanders import BaseHandler
import hardware


class temperature_handler(BaseHandler):
    """handles requests for temperature"""

    def get(self, timestamp=None):
        """return the temperature by key"""

        lower = self.get_query_argument('from', None)
        upper = self.get_query_argument('to', None)

        try:
            lower, upper = utils.validate_bounds(lower, upper)
        except:
            return self.send_error(400, reason='invalid from and/or to parameters')

        # check if a particular time was requested
        if timestamp:

            # validate the timestamp
            try:
                timestamp = int(timestamp)
                assert timestamp >= 0
            except:
                return self.send_error(400, reason='invalid timestamp')

            # see if we have a temperature for that time
            t = self.db.get_temperature(timestamp)
            if t:
                return self.send_data(t)
            else:
                return self.send_error(404, reason='timestamp not logged')

        # otherwise, use the temperature range
        else:
            # TODO make sure range isn't too large
            temps = self.db.get_temperature_list(lower, upper)
            return self.send_data(temps)


class current_temp_handler(BaseHandler):
    """handles requests for temperature at current time"""

    def get(self):

        t = self.db.get_current_temperature()
        if t:
            return self.send_data(t)
        else:
            return self.send_error(500, reason='database error')


class stats_temp_handler(BaseHandler):
    """ handles requests for generated statistics
        (max, min, etc...) for a time range """

    def get(self, stats_type):

        lower = self.get_query_argument('from', None)
        upper = self.get_query_argument('to', None)

        try:
            lower, upper = utils.validate_bounds(lower, upper)
        except:
            return self.send_error(400, reason='invalid range (from-to)')

        # TODO: return data based on stats_type


def main():
    # init the database
    db = database.db(cfg.database_url)
    db.create_all()

    # init the temperature sensor
    temp = hardware.Temperature(db, cfg.sensor_params)
    temp.save_current()

    # set up the server app
    server = Application([
        url(r'^/api/temperature/?$', temperature_handler),
        url(r'^/api/temperature/(\d+)/?$', temperature_handler),
        url(r'^/api/temperature/current/?$', current_temp_handler),
        url(r'^/api/temperature/now/?$', current_temp_handler),
        url(r'^/api/temperature/(max|min|ave)/?$', stats_temp_handler),
        ],
        debug=cfg.debug_mode,
        db=db
    )
    server.listen(cfg.listen_port)

    # log the temperature at intervals
    PeriodicCallback(temp.save_current, int(cfg.temp_interval) * 1000).start()
    tornado.ioloop.IOLoop.current().start()


if __name__ == '__main__':
    main()
