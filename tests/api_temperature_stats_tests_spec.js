var frisby = require('frisby');

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

// Get stats specifying "from" and "to" that contains no data points
frisby.create('Temperature stats from-to null test')
  .get('http://localhost:8888/api/temperature/stats?from=1451613444&to=1451613498')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      ave: null,
      min: null,
      max: null,
      count: 0,
      from: 1451613444,
      to: 1451613498,
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

// Get stats specifying "from" greater than "to"
frisby.create('Temperature stats from greater than to test')
  .get('http://localhost:8888/api/temperature/stats?from=1451613555&to=1451613498')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      ave: null,
      min: null,
      max: null,
      count: 0,
      from: 1451613555,
      to: 1451613498,
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
