
## API docs

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
        "to": 1474357010,
        "upper": 1474357009
    },
    "status": 200,
    "success": true
}
```


### GET /api/temperature/(max|min|ave|stats)

Get the maximum, minimum, or average temperatures for a given range.
The stats endpoint provides maximum, minimum and average in a single request.

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

maximum:

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

stats:

```json
{
    "data": {
        "count": 1180,
        "unit": "C",
        "from": 0,
        "lower": 1474264875,
        "ave": 19.64,
        "min": {
            "temperature": 10.0,
            "timestamp": 1474356245
        },
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
- `test_data`: [string] if the server is using fixed test data, the name of the file containing the test data
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

