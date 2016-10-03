var frisby = require('frisby');

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

// Get the average specifying "from" greater than "to"
frisby.create('Temperature average from greater than to test')
  .get('http://localhost:8888/api/temperature/ave?from=1451612600&to=1451612599')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      ave: null,
      count: 0,
      from: 1451612600,
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
