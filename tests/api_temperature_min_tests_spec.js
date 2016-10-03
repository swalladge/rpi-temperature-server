var frisby = require('frisby');

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

// Get the min specifying "from" greater than "to"
frisby.create('Temperature min from greater than to test')
  .get('http://localhost:8888/api/temperature/min?from=1451610700&to=1451610677')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      min: null,
      count: 0,
      from: 1451610700,
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
