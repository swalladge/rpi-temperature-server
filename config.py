
# the database to connect to, in format to be read by sqlalchemy.create_engine
# see the following for more info:
# http://docs.sqlalchemy.org/en/latest/core/engines.html#sqlalchemy.create_engine
database_url = 'sqlite:///db.sqlite3'

# set CORS origin allowed
cors_origin = "*"

# port for the server to listen on
listen_port = 8888

# whether to run in debug mode or not
debug_mode = True

# whether running on a RPi or not
# when False, enables test mode on the temperature retrieving module
# set to True when getting actual temperature on the RPi
on_rpi = False
