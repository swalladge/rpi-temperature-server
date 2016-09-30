# The Server

## Running

1. Make sure you have followed the main instructions to install the environment and get the test file running first.

2. Copy `config.template.py` to `config.py` and edit the new file to your liking. See comments in that file for more
   information on configuring the server.

3. You can then run the server with the included script:

```
./run_server.sh
```

Note: this script will create the `config.py` if you forgot step 2, but you will probably still want to edit the config
sooner or later.

Once the server is running successfuly, scroll down and read the information about the webapp/client.


## API

All api endpoints return json data. Usually it will be in the following structure:

```json
{
    "data": "more json - the data you want",
    "status": 200,
    "success": true
}
```

or on error:

```json
{
    "status": 400,
    "reason": "invalid parameters",
    "success": false
}
```

### Notes

- Most endpoints accept a `unit` parameter and return a `unit` field in the `data` object. For both parameters and
  responses, the value should be one of "C", "K", "F", "R", which correspond to Celsius, Kelvin, Fahrenheit, and
  Rankine respectively.


### GET /api/temperature/current

Returns the current temperature (ie. last recorded temperature in database).

Response data fields:

- `unit`: single letter representation of the temperature units used
- `temperature`: decimal value of the temperature in the units requested
- `timestamp`: unix timestamp of when the temperature was recorded

Example response:

```json
{
    "data": {
        "unit": "C",
        "temperature": 36.3,
        "timestamp": 1474264875
    },
    "status": 200,
    "success": true
}
```


### GET /api/temperature/:timestamp

Returns the temperature at `timestamp` if available, otherwise temperature for closest available time.

Response follows the same schema as for the current temperature endpoint.


### GET /api/temperature/

Returns an array of temperatures.

Parameters:

- `from` - [timestamp] start date of temperature range (default: 0)
- `to` - [timestamp] end date of temperature range (default: current time)
- `limit` - [integer] limit the number of temperature entries returned (default: `temp_max_length` as configured in
  config.py). Note: a limit parameter higher than set in server config will be ignored.

Response data fields:

- `count`: number of data points returned
- `lower`: lowest actual timestamp in the data (might be greater than from)
- `upper`: highest actual timestamp in the data (might be less than to)
- `from`: the requested start date
- `to`: the requested end date
- `full_count`: total number of data points available in range
- `unit`: single letter representation of the temperature units used

Example response:

```json
{
    "data": {
        "count": 2,
        "full_count": 2,
        "from": 1474357000,
        "lower": 1474357004,
        "unit": "C",
        "temperature_array": [
            {
                "temperature": 5.7,
                "timestamp": 1474357004
            },
            {
                "temperature": 25.3,
                "timestamp": 1474357009
            }
        ],
        "to": 1474357010
        "upper": 1474357009
    },
    "status": 200,
    "success": true
}
```


### GET /api/temperature/(max|min|ave)

Get the maximum, minimum, or average temperatures for a given range.

Parameters as for getting an array of temperatures.

Response data fields:

- `count`, `lower`, `upper`, `from`, `to` as above
- `ave`: average temperature as a float number
- `max`: maximum temperature as a temperature dictionary with `temperature` and `timestamp` fields
- `min`: as with `max` but for minimum temperature
- `unit`: single letter representation of the temperature units used

Example responses - average:

```json
{
    "data": {
        "ave": 19.64,
        "count": 1173,
        "unit": "C",
        "from": 0,
        "lower": 1474264875,
        "upper": 1474357264,
        "to": 1474357267
    },
    "status": 200,
    "success": true
}
```

And maximum:

```json
{
    "data": {
        "count": 1180,
        "unit": "C",
        "from": 0,
        "lower": 1474264875,
        "max": {
            "temperature": 40.0,
            "timestamp": 1474354142
        },
        "upper": 1474357299,
        "to": 1474357301
    },
    "status": 200,
    "success": true
}
```

### GET /api/info

Retrieve some useful information from the server.

Data attributes returned:

- `live`: [boolean] whether or not the server is recording real data
- `log_interval`: [number] the configured interval in seconds at which the server logs the current temperature.

Other possible attributes if enabled in configuration:

- `server_name`: [string] a descriptive name given to the server
- `location`: [string] a text description of where the server is

Example response:

```json
{
    "data": {
        "live": false,
        "log_interval": 300,
        "server_name": "the temperature server"
    },
    "status": 200,
    "success": true
}
```


# The webapp (client)

You have two options here.
Firstly, you can set `serve_webapp` to `True` in the server config to allow the python server to serve the webapp files.
This is the simplest option.

Secondly, if you don't want your RPi to have to handle the extra bandwidth or load, you can simply dump the files under
the `webapp` directory onto any static web server. For testing you could do something like this:

```
cd webapp
python3 -m http.server 8080
```

## Using

Navigate to your server in a browser - for example if you started the server on your local machine with the code above,
you can find it at [http://localhost:8080](http://localhost:8080).

The app hopefully will be self explanatory and easy to use.

