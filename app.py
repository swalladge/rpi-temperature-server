#!/usr/bin/env python
# -*- coding: utf-8 -*-

# main application server

import tornado.ioloop
from tornado.web import Application, url, StaticFileHandler
from tornado.escape import json_decode
from tornado.ioloop import PeriodicCallback
import tornado.options

import json
import os

import database
import config as cfg
import utils
from basehanders import BaseHandler
import hardware


class temperature_handler(BaseHandler):
    """handles requests for temperature"""

    def get(self, timestamp=None):
        """return the temperature by key"""

        from_timestamp = self.get_query_argument('from', None)
        to_timestamp = self.get_query_argument('to', None)
        limit = self.get_query_argument('limit', cfg.temp_max_length)
        unit = self.get_query_argument('unit', 'C')
        if unit not in self.db.allowed_units or not isinstance(unit, str):
            return self.send_error(400, reason='invalid unit parameter')

        try:
            from_timestamp, to_timestamp = utils.validate_bounds(from_timestamp, to_timestamp)
            limit = min(int(limit), cfg.temp_max_length)
        except:
            return self.send_error(400, reason='invalid from and/or to parameters')

        # check if a particular time was requested
        # return the closest time in database to timestamp
        if timestamp:

            # validate the timestamp
            try:
                timestamp = int(timestamp)
                if timestamp < 0:
                    raise ValueError
            except:
                return self.send_error(400, reason='invalid timestamp')

            # see if we have a temperature for that time
            t = self.db.get_temperature_at(timestamp, unit)
            if t:
                return self.send_data(t)
            else:
                return self.send_error(500, reason='database error')

        # otherwise, use the temperature range
        else:
            data = self.db.get_temperature_list(from_timestamp, to_timestamp, limit, unit)
            if data:
                return self.send_data(data)

        return self.send_error(500, reason='database error')


class current_temp_handler(BaseHandler):
    """handles requests for temperature at current time"""

    def get(self):

        unit = self.get_query_argument('unit', 'C')
        if unit not in self.db.allowed_units or not isinstance(unit, str):
            return self.send_error(400, reason='invalid unit parameter')

        t = self.db.get_current_temperature(unit)
        if t:
            return self.send_data(t)
        else:
            return self.send_error(500, reason='database error')


class stats_temp_handler(BaseHandler):
    """ handles requests for generated statistics
        (max, min, etc...) for a time range """

    def get(self, stats_type):

        from_timestamp = self.get_query_argument('from', None)
        to_timestamp = self.get_query_argument('to', None)
        unit = self.get_query_argument('unit', 'C')
        if unit not in self.db.allowed_units or not isinstance(unit, str):
            return self.send_error(400, reason='invalid unit parameter')

        try:
            from_timestamp, to_timestamp = utils.validate_bounds(from_timestamp, to_timestamp)
        except:
            return self.send_error(400, reason='invalid range (from-to)')

        if stats_type == 'min':
            stats = self.db.get_temperature_min(from_timestamp, to_timestamp, unit)
            if stats: return self.send_data(stats)
        elif stats_type == 'max':
            stats = self.db.get_temperature_max(from_timestamp, to_timestamp, unit)
            if stats: return self.send_data(stats)
        elif stats_type == 'ave':
            ave = self.db.get_temperature_avg(from_timestamp, to_timestamp, unit)
            if ave: return self.send_data(ave)
        elif stats_type == 'stats':
            stats = self.db.get_temperature_stats(from_timestamp, to_timestamp, unit)
            if stats: return self.send_data(stats)

        return self.send_error(500, reason='error retrieving {}'.format(stats_type))

class info_handler(BaseHandler):
    """ handles requests for server config """

    def get(self):
        data = {}
        data['log_interval'] = cfg.temp_interval
        if cfg.server_name is not None:
            data['server_name'] = cfg.server_name

        data['live'] = cfg.on_rpi

        if cfg.location is not None:
            data['location'] = cfg.location

        if cfg.timezone is not None:
            data['timezone'] = cfg.timezone

        return self.send_data(data)


def main():

    # let tornado grab command line args (ie. for setting log files)
    tornado.options.parse_command_line()

    # init the database
    db = database.db(cfg.database_url)
    db.create_all()

    # init the temperature sensor
    temp = hardware.Temperature(db, cfg.sensor_params)
    temp.save_current()

    # settings for the tornado app
    settings = {
            'db': db,
            'debug': cfg.debug_mode
    }

    # list of handlers for the server
    handlers = [
        url(r'^/api/temperature/?$', temperature_handler),
        url(r'^/api/temperature/(\d+)/?$', temperature_handler),
        url(r'^/api/temperature/current/?$', current_temp_handler),
        url(r'^/api/temperature/now/?$', current_temp_handler),
        url(r'^/api/temperature/(max|min|ave|stats)/?$', stats_temp_handler),
        url(r'^/api/info/?$', info_handler),
    ]

    # add the static file handler if we want to use it
    if cfg.serve_webapp:
        handlers.append(url(r'^/(.*)$', StaticFileHandler, {
                'path': os.path.join(os.path.dirname(__file__), 'webapp'),
                'default_filename': 'index.html'
            })
        )

    # set up the server app
    server = Application(handlers, **settings)
    server.listen(cfg.listen_port)

    # log the temperature at intervals
    PeriodicCallback(temp.save_current, int(cfg.temp_interval) * 1000).start()
    tornado.ioloop.IOLoop.current().start()


if __name__ == '__main__':
    main()
