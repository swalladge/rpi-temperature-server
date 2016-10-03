var frisby = require('frisby');

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

// Get the max specifying "from" greater than "to"
frisby.create('Temperature max from greater than to test')
  .get('http://localhost:8888/api/temperature/max?from=1451699999&to=1451611788')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      max: null,
      count: 0,
      from: 1451699999,
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
