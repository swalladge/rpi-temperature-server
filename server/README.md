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

Returns the current temperature.

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

### GET /api/temperature/

Returns an array of temperatures.

Parameters:

- `from` - [timestamp] start date of temperature range (default: 0)
- `to` - [timestamp] end date of temperature range (default: current time)

```json
{
    "data": [
        {
            "temperature": 24.9,
            "timestamp": 1474264300
        },
        {
            "temperature": 25.0,
            "timestamp": 1474264400
        },
        {
            "temperature": 25.1,
            "timestamp": 1474264500
        }
    ],
    "status": 200,
    "success": true
}
```
