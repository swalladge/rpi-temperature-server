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
      location: "Inside a Travis container"
    }
  })
  .expectJSONTypes({
    data: {
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
      unit: "C"
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
      unit: "C"
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
      unit: "F"
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
      unit: "K"
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
      unit: "R"
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
  .get('http://localhost:8888/api/temperature/1475196140')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      unit: "C"
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
  .get('http://localhost:8888/api/temperature/1475196140?unit=C')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      unit: "C"
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
  .get('http://localhost:8888/api/temperature/1475196140?unit=F')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      unit: "F"
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
  .get('http://localhost:8888/api/temperature/1475196140?unit=K')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      unit: "K"
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
  .get('http://localhost:8888/api/temperature/1475196140?unit=R')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      unit: "R"
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
  .get('http://localhost:8888/api/temperature/1475196140?unit=X')
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
      unit: "C"
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

// Test that the max temperature endpoint exists
// and returns reasonable data.

frisby.create('Temperature max test')
  .get('http://localhost:8888/api/temperature/max')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
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

// Test that the min temperature endpoint exists
// and returns reasonable data.

frisby.create('Temperature min test')
  .get('http://localhost:8888/api/temperature/min')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
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

// Test that the temperature stats endpoint exists
// and returns reasonable data.

frisby.create('Temperature stats test')
  .get('http://localhost:8888/api/temperature/stats')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
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

