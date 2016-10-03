var frisby = require('frisby');

// Test that the info endpoint exists
// and returns reasonable data.

frisby.create('Temperature sensor info test')
  .get('http://localhost:8888/api/info')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      live: false,
      log_interval: 5,
      server_name: "Test Temperature Server",
      location: "Inside a Travis container",
      test_data: "tests/api_test_data.txt",
      timezone: 570
    }
  })
  .expectJSONTypes({
    data: {
      live: Boolean,
      log_interval: Number,
      server_name: String,
      location: String,
      test_data: String,
      timezone: Number
    }
  })
.toss();

// Test that the current temperature endpoint exists
// and returns reasonable data.

frisby.create('Current temperature test')
  .get('http://localhost:8888/api/temperature/current')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      unit: "C",
      temperature: 8.4,
      timestamp: 1451614900
    }
  })
  .expectJSONTypes({
    data: {
      unit: String,
      temperature: Number,
      timestamp: Number
    }
  })
.toss();

frisby.create('Current temperature C test')
  .get('http://localhost:8888/api/temperature/current?unit=C')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      unit: "C",
      temperature: 8.4,
      timestamp: 1451614900
    }
  })
  .expectJSONTypes({
    data: {
      unit: String,
      temperature: Number,
      timestamp: Number
    }
  })
.toss();

frisby.create('Current temperature F test')
  .get('http://localhost:8888/api/temperature/current?unit=F')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      unit: "F",
      temperature: 47.12,
      timestamp: 1451614900
    }
  })
  .expectJSONTypes({
    data: {
      unit: String,
      temperature: Number,
      timestamp: Number
    }
  })
.toss();

frisby.create('Current temperature K test')
  .get('http://localhost:8888/api/temperature/current?unit=K')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      unit: "K",
      temperature: 281.55,
      timestamp: 1451614900
    }
  })
  .expectJSONTypes({
    data: {
      unit: String,
      temperature: Number,
      timestamp: Number
    }
  })
.toss();

frisby.create('Current temperature R test')
  .get('http://localhost:8888/api/temperature/current?unit=R')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      unit: "R",
      temperature: 506.79,
      timestamp: 1451614900
    }
  })
  .expectJSONTypes({
    data: {
      unit: String,
      temperature: Number,
      timestamp: Number
    }
  })
.toss();

frisby.create('Current temperature invalid unit test')
  .get('http://localhost:8888/api/temperature/current?unit=X')
  .expectStatus(400)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    reason: "invalid unit parameter",
    success: false
  })
.toss();

// Test that the temperature at timestamp endpoint exists
// and returns reasonable data.

// The temperature at timestamp tests use a dummy timestamp that happens to be
// a time somewhere in 2016. The API endpoint specifies that it will return the
// temperature data closest to the given timestamp, so in all cases something
// should be returned even if the tests are run against data generated
// weeks, months, years in the past or future.

frisby.create('Temperature at timestamp test')
  .get('http://localhost:8888/api/temperature/1451610700')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      unit: "C",
      temperature: 24.1,
      timestamp: 1451610700
    }
  })
  .expectJSONTypes({
    data: {
      unit: String,
      temperature: Number,
      timestamp: Number
    }
  })
.toss();

frisby.create('Temperature at timestamp C test')
  .get('http://localhost:8888/api/temperature/1451610700?unit=C')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      unit: "C",
      temperature: 24.1,
      timestamp: 1451610700
    }
  })
  .expectJSONTypes({
    data: {
      unit: String,
      temperature: Number,
      timestamp: Number
    }
  })
.toss();

frisby.create('Temperature at timestamp F test')
  .get('http://localhost:8888/api/temperature/1451610700?unit=F')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      unit: "F",
      temperature: 75.38,
      timestamp: 1451610700
    }
  })
  .expectJSONTypes({
    data: {
      unit: String,
      temperature: Number,
      timestamp: Number
    }
  })
.toss();

frisby.create('Temperature at timestamp K test')
  .get('http://localhost:8888/api/temperature/1451610700?unit=K')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      unit: "K",
      temperature: 297.25,
      timestamp: 1451610700
    }
  })
  .expectJSONTypes({
    data: {
      unit: String,
      temperature: Number,
      timestamp: Number
    }
  })
.toss();

frisby.create('Temperature at timestamp R test')
  .get('http://localhost:8888/api/temperature/1451610700?unit=R')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      unit: "R",
      temperature: 535.05,
      timestamp: 1451610700
    }
  })
  .expectJSONTypes({
    data: {
      unit: String,
      temperature: Number,
      timestamp: Number
    }
  })
.toss();

frisby.create('Temperature at timestamp invalid unit test')
  .get('http://localhost:8888/api/temperature/1451610700?unit=X')
  .expectStatus(400)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    reason: "invalid unit parameter",
    success: false
  })
.toss();

// 20 9's is a number bigger than the max unsigned 64-bit value.
// This should be read OK by the Python and reduced down to
// the current time by validation in the app.
frisby.create('Temperature at future timestamp test')
  .get('http://localhost:8888/api/temperature/99999999999999999999')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      unit: "C",
      temperature: 8.4,
      timestamp: 1451614900
    }
  })
  .expectJSONTypes({
    data: {
      unit: String,
      temperature: Number,
      timestamp: Number
    }
  })
.toss();

frisby.create('Temperature at early timestamp test')
  .get('http://localhost:8888/api/temperature/1000000000')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      unit: "C",
      temperature: 10,
      timestamp: 1451610000
    }
  })
  .expectJSONTypes({
    data: {
      unit: String,
      temperature: Number,
      timestamp: Number
    }
  })
.toss();

frisby.create('Temperature at zero timestamp test')
  .get('http://localhost:8888/api/temperature/0')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      unit: "C",
      temperature: 10,
      timestamp: 1451610000
    }
  })
  .expectJSONTypes({
    data: {
      unit: String,
      temperature: Number,
      timestamp: Number
    }
  })
.toss();

frisby.create('Temperature at zero-string timestamp test')
  .get('http://localhost:8888/api/temperature/00000000')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      unit: "C",
      temperature: 10,
      timestamp: 1451610000
    }
  })
  .expectJSONTypes({
    data: {
      unit: String,
      temperature: Number,
      timestamp: Number
    }
  })
.toss();

frisby.create('Temperature at midpoint1 timestamp test')
  .get('http://localhost:8888/api/temperature/1451611640')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      unit: "C",
      temperature: 35.5,
      timestamp: 1451611600
    }
  })
  .expectJSONTypes({
    data: {
      unit: String,
      temperature: Number,
      timestamp: Number
    }
  })
.toss();

frisby.create('Temperature at midpoint2 timestamp test')
  .get('http://localhost:8888/api/temperature/1451611665')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      unit: "C",
      temperature: 32.2,
      timestamp: 1451611700
    }
  })
  .expectJSONTypes({
    data: {
      unit: String,
      temperature: Number,
      timestamp: Number
    }
  })
.toss();

// Test that the temperature array endpoint exists
// and returns reasonable data.

frisby.create('Temperature array test')
  .get('http://localhost:8888/api/temperature')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      count: 50,
      full_count: 50,
      from: 0,
      lower: 1451610000,
      upper: 1451614900,
      unit: "C"
    }
  })
  .expectJSONTypes({
    data: {
      count: Number,
      full_count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
      temperature_array: Array
    }
  })
.toss();

frisby.create('Temperature array C test')
  .get('http://localhost:8888/api/temperature?unit=C')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      count: 50,
      full_count: 50,
      from: 0,
      lower: 1451610000,
      upper: 1451614900,
      unit: "C"
    }
  })
  .expectJSONTypes({
    data: {
      count: Number,
      full_count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
      temperature_array: Array
    }
  })
.toss();

frisby.create('Temperature array F test')
  .get('http://localhost:8888/api/temperature?unit=F')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      count: 50,
      full_count: 50,
      from: 0,
      lower: 1451610000,
      upper: 1451614900,
      unit: "F"
    }
  })
  .expectJSONTypes({
    data: {
      count: Number,
      full_count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
      temperature_array: Array
    }
  })
.toss();

frisby.create('Temperature array K test')
  .get('http://localhost:8888/api/temperature?unit=K')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      count: 50,
      full_count: 50,
      from: 0,
      lower: 1451610000,
      upper: 1451614900,
      unit: "K"
    }
  })
  .expectJSONTypes({
    data: {
      count: Number,
      full_count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
      temperature_array: Array
    }
  })
.toss();

frisby.create('Temperature array R test')
  .get('http://localhost:8888/api/temperature?unit=R')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      count: 50,
      full_count: 50,
      from: 0,
      lower: 1451610000,
      upper: 1451614900,
      unit: "R"
    }
  })
  .expectJSONTypes({
    data: {
      count: Number,
      full_count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
      temperature_array: Array
    }
  })
.toss();

frisby.create('Temperature array invalid unit test')
  .get('http://localhost:8888/api/temperature?unit=X')
  .expectStatus(400)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    reason: "invalid unit parameter",
    success: false
  })
.toss();

// Test that the average temperature endpoint exists
// and returns reasonable data.

frisby.create('Temperature average test')
  .get('http://localhost:8888/api/temperature/ave')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      ave: 11.5786,
      count: 50,
      from: 0,
      lower: 1451610000,
      upper: 1451614900,
      unit: "C"
    }
  })
  .expectJSONTypes({
    data: {
      ave: Number,
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

frisby.create('Temperature average C test')
  .get('http://localhost:8888/api/temperature/ave?unit=C')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      ave: 11.5786,
      count: 50,
      from: 0,
      lower: 1451610000,
      upper: 1451614900,
      unit: "C"
    }
  })
  .expectJSONTypes({
    data: {
      ave: Number,
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

frisby.create('Temperature average F test')
  .get('http://localhost:8888/api/temperature/ave?unit=F')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      ave: 52.84148,
      count: 50,
      from: 0,
      lower: 1451610000,
      upper: 1451614900,
      unit: "F"
    }
  })
  .expectJSONTypes({
    data: {
      ave: Number,
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

frisby.create('Temperature average K test')
  .get('http://localhost:8888/api/temperature/ave?unit=K')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      ave: 284.7286,
      count: 50,
      from: 0,
      lower: 1451610000,
      upper: 1451614900,
      unit: "K"
    }
  })
  .expectJSONTypes({
    data: {
      ave: Number,
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

frisby.create('Temperature average R test')
  .get('http://localhost:8888/api/temperature/ave?unit=R')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      ave: 512.51148,
      count: 50,
      from: 0,
      lower: 1451610000,
      upper: 1451614900,
      unit: "R"
    }
  })
  .expectJSONTypes({
    data: {
      ave: Number,
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

frisby.create('Temperature average invalid unit test')
  .get('http://localhost:8888/api/temperature/ave?unit=X')
  .expectStatus(400)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    reason: "invalid unit parameter",
    success: false
  })
.toss();

// Get the average specifying "from" and "to" that match exact data points
frisby.create('Temperature average from-to match test')
  .get('http://localhost:8888/api/temperature/ave?from=1451612500&to=1451613800')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      ave: -3.919286,
      count: 14,
      from: 1451612500,
      to: 1451613800,
      lower: 1451612500,
      upper: 1451613800,
      unit: "C"
    }
  })
  .expectJSONTypes({
    data: {
      ave: Number,
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

// Get the average specifying "from" and "to" that do not match exact data points
frisby.create('Temperature average from-to non-match test')
  .get('http://localhost:8888/api/temperature/ave?from=1451612401&to=1451613899')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      ave: -3.919286,
      count: 14,
      from: 1451612401,
      to: 1451613899,
      lower: 1451612500,
      upper: 1451613800,
      unit: "C"
    }
  })
  .expectJSONTypes({
    data: {
      ave: Number,
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

// Get the average specifying just "from" that matches an exact data point
frisby.create('Temperature average from match test')
  .get('http://localhost:8888/api/temperature/ave?from=1451612500')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      ave: -3.9948,
      count: 25,
      from: 1451612500,
      lower: 1451612500,
      upper: 1451614900,
      unit: "C"
    }
  })
  .expectJSONTypes({
    data: {
      ave: Number,
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

// Get the average specifying just "from" that does not match an exact data point
frisby.create('Temperature average from non-match test')
  .get('http://localhost:8888/api/temperature/ave?from=1451612401')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      ave: -3.9948,
      count: 25,
      from: 1451612401,
      lower: 1451612500,
      upper: 1451614900,
      unit: "C"
    }
  })
  .expectJSONTypes({
    data: {
      ave: Number,
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

// Get the average specifying just "to" that matches an exact data point
frisby.create('Temperature average to match test')
  .get('http://localhost:8888/api/temperature/ave?to=1451613800')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      ave: 15.998205,
      count: 39,
      from: 0,
      to: 1451613800,
      lower: 1451610000,
      upper: 1451613800,
      unit: "C"
    }
  })
  .expectJSONTypes({
    data: {
      ave: Number,
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

// Get the average specifying just "to" that does not match an exact data point
frisby.create('Temperature average to non-match test')
  .get('http://localhost:8888/api/temperature/ave?to=1451613899')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      ave: 15.998205,
      count: 39,
      from: 0,
      to: 1451613899,
      lower: 1451610000,
      upper: 1451613800,
      unit: "C"
    }
  })
  .expectJSONTypes({
    data: {
      ave: Number,
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

// Get the average specifying "from" and "to" that contains no data points
frisby.create('Temperature average from-to null test')
  .get('http://localhost:8888/api/temperature/ave?from=1451612501&to=1451612599')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      ave: null,
      count: 0,
      from: 1451612501,
      to: 1451612599,
      lower: null,
      upper: null,
      unit: "C"
    }
  })
  .expectJSONTypes({
    data: {
      count: Number,
      from: Number,
      to: Number,
      unit: String,
    }
  })
.toss();

// Test that the max temperature endpoint exists
// and returns reasonable data.

frisby.create('Temperature max test')
  .get('http://localhost:8888/api/temperature/max')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      max: {
        temperature: 39.9,
        timestamp: 1451611400
	  },
      count: 50,
      from: 0,
      lower: 1451610000,
      upper: 1451614900,
      unit: "C"
    }
  })
  .expectJSONTypes({
    data: {
      max: {
        temperature: Number,
        timestamp: Number
	  },
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

frisby.create('Temperature max C test')
  .get('http://localhost:8888/api/temperature/max?unit=C')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      max: {
        temperature: 39.9,
        timestamp: 1451611400
	  },
      count: 50,
      from: 0,
      lower: 1451610000,
      upper: 1451614900,
      unit: "C"
    }
  })
  .expectJSONTypes({
    data: {
      max: {
        temperature: Number,
        timestamp: Number
	  },
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

frisby.create('Temperature max F test')
  .get('http://localhost:8888/api/temperature/max?unit=F')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      max: {
        temperature: 103.82,
        timestamp: 1451611400
	  },
      count: 50,
      from: 0,
      lower: 1451610000,
      upper: 1451614900,
      unit: "F"
    }
  })
  .expectJSONTypes({
    data: {
      max: {
        temperature: Number,
        timestamp: Number
	  },
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

frisby.create('Temperature max K test')
  .get('http://localhost:8888/api/temperature/max?unit=K')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      max: {
        temperature: 313.05,
        timestamp: 1451611400
	  },
      count: 50,
      from: 0,
      lower: 1451610000,
      upper: 1451614900,
      unit: "K"
    }
  })
  .expectJSONTypes({
    data: {
      max: {
        temperature: Number,
        timestamp: Number
	  },
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

frisby.create('Temperature max R test')
  .get('http://localhost:8888/api/temperature/max?unit=R')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      max: {
        temperature: 563.49,
        timestamp: 1451611400
	  },
      count: 50,
      from: 0,
      lower: 1451610000,
      upper: 1451614900,
      unit: "R"
    }
  })
  .expectJSONTypes({
    data: {
      max: {
        temperature: Number,
        timestamp: Number
	  },
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

frisby.create('Temperature max invalid unit test')
  .get('http://localhost:8888/api/temperature/max?unit=X')
  .expectStatus(400)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    reason: "invalid unit parameter",
    success: false
  })
.toss();

// Get the max specifying "from" and "to" that match exact data points
frisby.create('Temperature max from-to match test')
  .get('http://localhost:8888/api/temperature/max?from=1451611700&to=1451612600')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      max: {
        temperature: 34.5,
        timestamp: 1451611900
	  },
      count: 10,
      from: 1451611700,
      to: 1451612600,
      lower: 1451611700,
      upper: 1451612600,
      unit: "C"
    }
  })
  .expectJSONTypes({
    data: {
      max: {
        temperature: Number,
        timestamp: Number
	  },
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

// Get the max specifying "from" and "to" that do not match exact data points
frisby.create('Temperature max from-to non-match test')
  .get('http://localhost:8888/api/temperature/max?from=1451611650&to=1451612650')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      max: {
        temperature: 34.5,
        timestamp: 1451611900
	  },
      count: 10,
      from: 1451611650,
      to: 1451612650,
      lower: 1451611700,
      upper: 1451612600,
      unit: "C"
    }
  })
  .expectJSONTypes({
    data: {
      max: {
        temperature: Number,
        timestamp: Number
	  },
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

// Get the max specifying just "from" that matches an exact data point
frisby.create('Temperature max from match test')
  .get('http://localhost:8888/api/temperature/max?from=1451613000')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      max: {
        temperature: 8.4,
        timestamp: 1451614900
	  },
      count: 20,
      from: 1451613000,
      lower: 1451613000,
      upper: 1451614900,
      unit: "C"
    }
  })
  .expectJSONTypes({
    data: {
      max: {
        temperature: Number,
        timestamp: Number
	  },
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

// Get the max specifying just "from" that does not match an exact data point
frisby.create('Temperature max from non-match test')
  .get('http://localhost:8888/api/temperature/max?from=1451612990')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      max: {
        temperature: 8.4,
        timestamp: 1451614900
	  },
      count: 20,
      from: 1451612990,
      lower: 1451613000,
      upper: 1451614900,
      unit: "C"
    }
  })
  .expectJSONTypes({
    data: {
      max: {
        temperature: Number,
        timestamp: Number
	  },
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

// Get the max specifying just "to" that matches an exact data point
frisby.create('Temperature max to match test')
  .get('http://localhost:8888/api/temperature/max?to=1451610700')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      max: {
        temperature: 25.6,
        timestamp: 1451610500
	  },
      count: 8,
      from: 0,
      to: 1451610700,
      lower: 1451610000,
      upper: 1451610700,
      unit: "C"
    }
  })
  .expectJSONTypes({
    data: {
      max: {
        temperature: Number,
        timestamp: Number
	  },
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

// Get the max specifying just "to" that does not match an exact data point
frisby.create('Temperature max to non-match test')
  .get('http://localhost:8888/api/temperature/max?to=1451610735')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      max: {
        temperature: 25.6,
        timestamp: 1451610500
	  },
      count: 8,
      from: 0,
      to: 1451610735,
      lower: 1451610000,
      upper: 1451610700,
      unit: "C"
    }
  })
  .expectJSONTypes({
    data: {
      max: {
        temperature: Number,
        timestamp: Number
	  },
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

// Get the max specifying "from" and "to" that contains no data points
frisby.create('Temperature max from-to null test')
  .get('http://localhost:8888/api/temperature/max?from=1451611707&to=1451611788')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      max: null,
      count: 0,
      from: 1451611707,
      to: 1451611788,
      lower: null,
      upper: null,
      unit: "C"
    }
  })
  .expectJSONTypes({
    data: {
      count: Number,
      from: Number,
      to: Number,
      unit: String,
    }
  })
.toss();

// Test that the min temperature endpoint exists
// and returns reasonable data.

frisby.create('Temperature min test')
  .get('http://localhost:8888/api/temperature/min')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      min: {
        temperature: -20.0,
        timestamp: 1451613800
	  },
      count: 50,
      from: 0,
      lower: 1451610000,
      upper: 1451614900,
      unit: "C"
    }
  })
  .expectJSONTypes({
    data: {
      min: {
        temperature: Number,
        timestamp: Number
	  },
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

frisby.create('Temperature min C test')
  .get('http://localhost:8888/api/temperature/min?unit=C')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      min: {
        temperature: -20.0,
        timestamp: 1451613800
	  },
      count: 50,
      from: 0,
      lower: 1451610000,
      upper: 1451614900,
      unit: "C"
    }
  })
  .expectJSONTypes({
    data: {
      min: {
        temperature: Number,
        timestamp: Number
	  },
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

frisby.create('Temperature min F test')
  .get('http://localhost:8888/api/temperature/min?unit=F')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      min: {
        temperature: -4.0,
        timestamp: 1451613800
	  },
      count: 50,
      from: 0,
      lower: 1451610000,
      upper: 1451614900,
      unit: "F"
    }
  })
  .expectJSONTypes({
    data: {
      min: {
        temperature: Number,
        timestamp: Number
	  },
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

frisby.create('Temperature min K test')
  .get('http://localhost:8888/api/temperature/min?unit=K')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      min: {
        temperature: 253.15,
        timestamp: 1451613800
	  },
      count: 50,
      from: 0,
      lower: 1451610000,
      upper: 1451614900,
      unit: "K"
    }
  })
  .expectJSONTypes({
    data: {
      min: {
        temperature: Number,
        timestamp: Number
	  },
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

frisby.create('Temperature min R test')
  .get('http://localhost:8888/api/temperature/min?unit=R')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      min: {
        temperature: 455.67,
        timestamp: 1451613800
	  },
      count: 50,
      from: 0,
      lower: 1451610000,
      upper: 1451614900,
      unit: "R"
    }
  })
  .expectJSONTypes({
    data: {
      min: {
        temperature: Number,
        timestamp: Number
	  },
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

frisby.create('Temperature min invalid unit test')
  .get('http://localhost:8888/api/temperature/min?unit=X')
  .expectStatus(400)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    reason: "invalid unit parameter",
    success: false
  })
.toss();

// Get the min specifying "from" and "to" that match exact data points
frisby.create('Temperature min from-to match test')
  .get('http://localhost:8888/api/temperature/min?from=1451613000&to=1451614000')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      min: {
        temperature: -20.0,
        timestamp: 1451613800
	  },
      count: 11,
      from: 1451613000,
      to: 1451614000,
      lower: 1451613000,
      upper: 1451614000,
      unit: "C"
    }
  })
  .expectJSONTypes({
    data: {
      min: {
        temperature: Number,
        timestamp: Number
	  },
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

// Get the min specifying "from" and "to" that do not match exact data points
frisby.create('Temperature min from-to non-match test')
  .get('http://localhost:8888/api/temperature/min?from=1451612999&to=1451614065')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      min: {
        temperature: -20.0,
        timestamp: 1451613800
	  },
      count: 11,
      from: 1451612999,
      to: 1451614065,
      lower: 1451613000,
      upper: 1451614000,
      unit: "C"
    }
  })
  .expectJSONTypes({
    data: {
      min : {
        temperature: Number,
        timestamp: Number
	  },
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

// Get the min specifying just "from" that matches an exact data point
frisby.create('Temperature min from match test')
  .get('http://localhost:8888/api/temperature/min?from=1451613000')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      min: {
        temperature: -20.0,
        timestamp: 1451613800
	  },
      count: 20,
      from: 1451613000,
      lower: 1451613000,
      upper: 1451614900,
      unit: "C"
    }
  })
  .expectJSONTypes({
    data: {
      min: {
        temperature: Number,
        timestamp: Number
	  },
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

// Get the min specifying just "from" that does not match an exact data point
frisby.create('Temperature min from non-match test')
  .get('http://localhost:8888/api/temperature/min?from=1451612990')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      min: {
        temperature: -20.0,
        timestamp: 1451613800
	  },
      count: 20,
      from: 1451612990,
      lower: 1451613000,
      upper: 1451614900,
      unit: "C"
    }
  })
  .expectJSONTypes({
    data: {
      min: {
        temperature: Number,
        timestamp: Number
	  },
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

// Get the min specifying just "to" that matches an exact data point
frisby.create('Temperature min to match test')
  .get('http://localhost:8888/api/temperature/min?to=1451610700')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      min: {
        temperature: 10.0,
        timestamp: 1451610000
	  },
      count: 8,
      from: 0,
      to: 1451610700,
      lower: 1451610000,
      upper: 1451610700,
      unit: "C"
    }
  })
  .expectJSONTypes({
    data: {
      min: {
        temperature: Number,
        timestamp: Number
	  },
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

// Get the min specifying just "to" that does not match an exact data point
frisby.create('Temperature min to non-match test')
  .get('http://localhost:8888/api/temperature/min?to=1451610742')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      min: {
        temperature: 10.0,
        timestamp: 1451610000
	  },
      count: 8,
      from: 0,
      to: 1451610742,
      lower: 1451610000,
      upper: 1451610700,
      unit: "C"
    }
  })
  .expectJSONTypes({
    data: {
      min: {
        temperature: Number,
        timestamp: Number
	  },
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

// Get the min specifying "from" and "to" that contains no data points
frisby.create('Temperature min from-to null test')
  .get('http://localhost:8888/api/temperature/min?from=1451610666&to=1451610677')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      min: null,
      count: 0,
      from: 1451610666,
      to: 1451610677,
      lower: null,
      upper: null,
      unit: "C"
    }
  })
  .expectJSONTypes({
    data: {
      count: Number,
      from: Number,
      to: Number,
      unit: String,
    }
  })
.toss();

// Test that the temperature stats endpoint exists
// and returns reasonable data.

frisby.create('Temperature stats test')
  .get('http://localhost:8888/api/temperature/stats')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      ave: 11.5786,
      min: {
        temperature: -20.0,
        timestamp: 1451613800
	  },
      max: {
        temperature: 39.9,
        timestamp: 1451611400
	  },
      count: 50,
      from: 0,
      lower: 1451610000,
      upper: 1451614900,
      unit: "C"
    }
  })
  .expectJSONTypes({
    data: {
      ave: Number,
      min: {
        temperature: Number,
        timestamp: Number
	  },
      max: {
        temperature: Number,
        timestamp: Number
	  },
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

frisby.create('Temperature stats C test')
  .get('http://localhost:8888/api/temperature/stats?unit=C')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      ave: 11.5786,
      min: {
        temperature: -20.0,
        timestamp: 1451613800
	  },
      max: {
        temperature: 39.9,
        timestamp: 1451611400
	  },
      count: 50,
      from: 0,
      lower: 1451610000,
      upper: 1451614900,
      unit: "C"
    }
  })
  .expectJSONTypes({
    data: {
      ave: Number,
      min: {
        temperature: Number,
        timestamp: Number
	  },
      max: {
        temperature: Number,
        timestamp: Number
	  },
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

frisby.create('Temperature stats F test')
  .get('http://localhost:8888/api/temperature/stats?unit=F')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      ave: 52.84148,
      min: {
        temperature: -4.0,
        timestamp: 1451613800
	  },
      max: {
        temperature: 103.82,
        timestamp: 1451611400
	  },
      count: 50,
      from: 0,
      lower: 1451610000,
      upper: 1451614900,
      unit: "F"
    }
  })
  .expectJSONTypes({
    data: {
      ave: Number,
      min: {
        temperature: Number,
        timestamp: Number
	  },
      max: {
        temperature: Number,
        timestamp: Number
	  },
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

frisby.create('Temperature stats K test')
  .get('http://localhost:8888/api/temperature/stats?unit=K')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      ave: 284.7286,
      min: {
        temperature: 253.15,
        timestamp: 1451613800
	  },
      max: {
        temperature: 313.05,
        timestamp: 1451611400
	  },
      count: 50,
      from: 0,
      lower: 1451610000,
      upper: 1451614900,
      unit: "K"
    }
  })
  .expectJSONTypes({
    data: {
      ave: Number,
      min: {
        temperature: Number,
        timestamp: Number
	  },
      max: {
        temperature: Number,
        timestamp: Number
	  },
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

frisby.create('Temperature stats R test')
  .get('http://localhost:8888/api/temperature/stats?unit=R')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      ave: 512.51148,
      min: {
        temperature: 455.67,
        timestamp: 1451613800
	  },
      max: {
        temperature: 563.49,
        timestamp: 1451611400
	  },
      count: 50,
      from: 0,
      lower: 1451610000,
      upper: 1451614900,
      unit: "R"
    }
  })
  .expectJSONTypes({
    data: {
      ave: Number,
      min: {
        temperature: Number,
        timestamp: Number
	  },
      max: {
        temperature: Number,
        timestamp: Number
	  },
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

frisby.create('Temperature stats invalid unit test')
  .get('http://localhost:8888/api/temperature/stats?unit=X')
  .expectStatus(400)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    reason: "invalid unit parameter",
    success: false
  })
.toss();

// Get stats specifying "from" and "to" that match exact data points
frisby.create('Temperature stats from-to match test')
  .get('http://localhost:8888/api/temperature/stats?from=1451613000&to=1451614000')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      ave: -10.997273,
      min: {
        temperature: -20.0,
        timestamp: 1451613800
	  },
      max: {
        temperature: -0.1,
        timestamp: 1451613000
	  },
      count: 11,
      from: 1451613000,
      to: 1451614000,
      lower: 1451613000,
      upper: 1451614000,
      unit: "C"
    }
  })
  .expectJSONTypes({
    data: {
      ave: Number,
      min: {
        temperature: Number,
        timestamp: Number
	  },
      max: {
        temperature: Number,
        timestamp: Number
	  },
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

// Get stats specifying "from" and "to" that do not match exact data points
frisby.create('Temperature stats from-to non-match test')
  .get('http://localhost:8888/api/temperature/stats?from=1451612985&to=1451614090')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      ave: -10.997273,
      min: {
        temperature: -20.0,
        timestamp: 1451613800
	  },
      max: {
        temperature: -0.1,
        timestamp: 1451613000
	  },
      count: 11,
      from: 1451612985,
      to: 1451614090,
      lower: 1451613000,
      upper: 1451614000,
      unit: "C"
    }
  })
  .expectJSONTypes({
    data: {
      ave: Number,
      min: {
        temperature: Number,
        timestamp: Number
	  },
      max: {
        temperature: Number,
        timestamp: Number
	  },
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

// Get stats specifying just "from" that matches an exact data point
frisby.create('Temperature stats from match test')
  .get('http://localhost:8888/api/temperature/stats?from=1451613000')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      ave: -6.4335,
      min: {
        temperature: -20.0,
        timestamp: 1451613800
	  },
      max: {
        temperature: 8.4,
        timestamp: 1451614900
	  },
      count: 20,
      from: 1451613000,
      lower: 1451613000,
      upper: 1451614900,
      unit: "C"
    }
  })
  .expectJSONTypes({
    data: {
      ave: Number,
      min: {
        temperature: Number,
        timestamp: Number
	  },
      max: {
        temperature: Number,
        timestamp: Number
	  },
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

// Get stats specifying just "from" that does not match an exact data point
frisby.create('Temperature stats from non-match test')
  .get('http://localhost:8888/api/temperature/stats?from=1451612955')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      ave: -6.4335,
      min: {
        temperature: -20.0,
        timestamp: 1451613800
	  },
      max: {
        temperature: 8.4,
        timestamp: 1451614900
	  },
      count: 20,
      from: 1451612955,
      lower: 1451613000,
      upper: 1451614900,
      unit: "C"
    }
  })
  .expectJSONTypes({
    data: {
      ave: Number,
      min: {
        temperature: Number,
        timestamp: Number
	  },
      max: {
        temperature: Number,
        timestamp: Number
	  },
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

// Get stats specifying just "to" that matches an exact data point
frisby.create('Temperature stats to match test')
  .get('http://localhost:8888/api/temperature/stats?to=1451613000')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      ave: 22.822581,
      min: {
        temperature: -0.1,
        timestamp: 1451613000
	  },
      max: {
        temperature: 39.9,
        timestamp: 1451611400
	  },
      count: 31,
      from: 0,
      to: 1451613000,
      lower: 1451610000,
      upper: 1451613000,
      unit: "C"
    }
  })
  .expectJSONTypes({
    data: {
      ave: Number,
      min: {
        temperature: Number,
        timestamp: Number
	  },
      max: {
        temperature: Number,
        timestamp: Number
	  },
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();

// Get stats specifying just "to" that does not match an exact data point
frisby.create('Temperature stats to non-match test')
  .get('http://localhost:8888/api/temperature/stats?to=1451613077')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      ave: 22.822581,
      min: {
        temperature: -0.1,
        timestamp: 1451613000
	  },
      max: {
        temperature: 39.9,
        timestamp: 1451611400
	  },
      count: 31,
      from: 0,
      to: 1451613077,
      lower: 1451610000,
      upper: 1451613000,
      unit: "C"
    }
  })
  .expectJSONTypes({
    data: {
      ave: Number,
      min: {
        temperature: Number,
        timestamp: Number
	  },
      max: {
        temperature: Number,
        timestamp: Number
	  },
      count: Number,
      from: Number,
      to: Number,
      lower: Number,
      upper: Number,
      unit: String,
    }
  })
.toss();
