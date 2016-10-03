# Config

Configuration for the server is managed with a json file.
By default the server will look for `config.json` and read the values from that.

## Command line args

To specify an alternate config file, pass it on the command line like so:

```
./run_server.sh --config=test_config.json
```

Other arguments relating to the tornado module and logging are available. Run `./run_server.sh --help` for more info on
those.


## Config file options

Listing format: `name` [default value] help and explanation

- `database_url` ["sqlite:///db.sqlite3"] the database to connect to, in format to be read by `sqlalchemy.create_engine`
  see the following for more info: http://docs.sqlalchemy.org/en/latest/core/engines.html#sqlalchemy.create_engine

- `cors_origin` ["*"] CORS origin settings - change this if you wish to restrict CORS requests to a particular domain

- `listen_port` [8888] which port the server should listen on

- `debug_mode` [true] whether the server should run in debug mode - change to false for running in production

- `serve_webapp` [true] set to false if you don't want the server to also serve the webapp

- `on_rpi` [false] set to true when running on Raspberry Pi hardware and want to record actual data from the sensor

- `test_data` [null] set to a file path/name to load test data from that file, rather than logging real or pseudo-random temperatures.

- `sensor_params` [null] a dictionary of parameters to pass to the sensor if the defaults aren't being used. For
  example:

  ```json
  sensor_params: {
      "address": 32,
      "busnum": 2
  }
  ```

  Note: the address is usually in octal format - it should be converted to a decimal integer for purposes of storing in
  json.

- `temp_interval` [300] how often to log the temperature (in seconds)

- `temp_max_length` [300] max number of entries allowed to send (when requested a list of temps) if more entries
  available in that range, it will return an evenly distributed selection within this max length

- `server_name` ["the temperature server"] the name your server should advertise to clients (set to null to disable)

- `location` [null] set to a string if you want to share a location - eg. "The South Pole"

- `timezone` [system timezone] timezone as minutes offset from utc use this to override system timezone - if this is set
  to null, the server will use the system timezone

