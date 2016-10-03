
import time
import sys

class Config():
    # warning - running a `self.something = something` in this class will fail
    # spectacularly

    # the dictionary of default config values - if a new config value is wanted,
    # set a default here
    defaults = {
            'database_url': 'sqlite:///db.sqlite3',
            'cors_origin': '*',
            'listen_port': 8888,
            'debug_mode': True,
            'serve_webapp': True,
            'on_rpi': False,
            'test_data': None,
            'sensor_params': None,
            'temp_interval': 5 * 60,
            'temp_max_length': 300,
            'server_name': 'the temperature server',
            'location': None,
            'timezone': int(time.localtime().tm_gmtoff / 60)
    }
    cfg_file = 'config.json'


    def __init__(self):
        object.__setattr__(self, 'data', {})

    def set_data(self, data):
        ''' sets the data dictionary for use - overwrites any previously set '''
        if not isinstance(data, dict):
            raise ValueError('data must be a dictionary')
        object.__setattr__(self, 'data', data)

    def __getattr__(self, name):
        return self.data.get(name, self.defaults.get(name, None))

    def __setattr__(self, name, value):
        self.data[name] = value

    # use these get and set methods if you need to use some config name that
    # clashes - like 'data' for example
    def get(self, name, default=None):
        return self.data.get(name, self.defaults.get(name, default))

    def set(self, name, value):
        self.data[name] = value

# approved hack - http://stackoverflow.com/a/7668273/3089519
sys.modules[__name__] = Config()


####### use as the following:
# import config
# config.defaults # dictionary of defaults
# config.location # get a particular config value
# config.location = 'something' # set a value
