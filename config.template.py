# EDIT VALUES HERE TO CONFIGURE THE SERVER
# WARNING: do not remove values - if you do not wish to change from the
# defaults, simply leave as is.

# the database to connect to, in format to be read by sqlalchemy.create_engine
# see the following for more info:
# http://docs.sqlalchemy.org/en/latest/core/engines.html#sqlalchemy.create_engine
database_url = 'sqlite:///db.sqlite3'

# set CORS origin allowed
cors_origin = "*"

# port for the server to listen on
listen_port = 8888

# whether to run in debug mode or not
# you are advised to set this to false when running in production
debug_mode = True

# whether running on a RPi or not
# when False, enables test mode on the temperature retrieving module (ie. for
# testing the server on your computer)
# set to True when getting actual temperature on the RPi
on_rpi = False

# params to pass to the sensor init function
# use to override defaults
sensor_params=None
# sensor_params={'address': 0x20,
#                'busnum': 2
# }

# how often to log the temperature in seconds
temp_interval = 5 * 60  # 5 minutes = 288 per 24 hours = 2016 per week

# max number of entries allowed to send (when requested a list of temps)
# if more entries available in that range, it will return an evenly distributed
# selection within this max length
temp_max_length = 300


# other info - set to None to disable

## should be a string
server_name = "the temperature server"

## should also be a string
location = None
