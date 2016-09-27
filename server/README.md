# The Server

## Running

1. Make sure you have followed the main instructions to install the environment and get the test file running first.

2. Edit `server/config.py` to your liking. See comments in that file for more information on configuring the server.

3. You can then run the server with the included script:

```
./run_server.sh
```


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

### GET /api/temperature/current

Returns the current temperature (ie. last recorded temperature in database).

Example response:

```json
{
    "data": {
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
- `lower`: interpreted lower bound
- `upper`: interpreted upper bound
- `full_count`: total number of data points available in range

Example response:

```json
{
    "data": {
        "count": 2,
        "full_count": 2,
        "lower": 1474357000,
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
        "upper": 1474357010
    },
    "status": 200,
    "success": true
}
```


### GET /api/temperature/(max|min|ave)

Get the maximum, minimum, or average temperatures for a given range.

Parameters as for getting an array of temperatures.

Response data fields:

- `count`, `lower`, `upper` as above
- `ave`: average temperature as a float number
- `max`: maximum temperature as a temperature dictionary with `temperature` and `timestamp` fields
- `min`: as with `max` but for minimum temperature

Example responses - average:

```json
{
    "data": {
        "ave": 19.64,
        "count": 1173,
        "lower": 0,
        "upper": 1474357267
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
        "lower": 0,
        "max": {
            "temperature": 40.0,
            "timestamp": 1474354142
        },
        "upper": 1474357301
    },
    "status": 200,
    "success": true
}
```

