
from tornado.web import RequestHandler

import config as cfg

class BaseHandler(RequestHandler):
    """ a base handler abstractions for the other handlers to inherit from """

    def initialize(self):
        """ init the handler with info such as db """
        self.user = None
        self.db = self.settings.get('db')

    def send_data(self, data):
        """writes the json data with status message (basic wrapper)"""
        self.write({
            'success': True,
            'status': 200,
            'data': data
            });

    def write_error(self, status, reason=None, data=None):
        """ wrapper for sending error data """
        body = {'status': status,
                'success': False}
        if reason:
            body['reason'] = reason
        if data:
            body['data'] = data
        self.write(body)

    def set_default_headers(self):
        """ sets the default headers to use
            used here to set CORS options """
        self.set_header("Access-Control-Allow-Origin", cfg.cors_origin)

