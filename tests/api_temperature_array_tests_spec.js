var frisby = require('frisby');

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

// Get an array of temperatures "from" and "to" that match exact data points
frisby.create('Temperature array from-to match test')
  .get('http://localhost:8888/api/temperature?from=1451612700&to=1451613100')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      count: 5,
      full_count: 5,
      from: 1451612700,
      to: 1451613100,
      lower: 1451612700,
      upper: 1451613100,
      unit: "C",
      temperature_array: [
        {
          temperature: 5.5,
          timestamp: 1451612700
        },
        {
          temperature: 2.2,
          timestamp: 1451612800
        },
        {
          temperature: 0.0,
          timestamp: 1451612900
        },
        {
          temperature: -0.1,
          timestamp: 1451613000
        },
        {
          temperature: -1.0,
          timestamp: 1451613100
        }
	  ]
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

// Get an array of temperatures "from" and "to" that do not match exact data points
frisby.create('Temperature array from-to non-match test')
  .get('http://localhost:8888/api/temperature?from=1451612678&to=1451613123')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      count: 5,
      full_count: 5,
      from: 1451612678,
      to: 1451613123,
      lower: 1451612700,
      upper: 1451613100,
      unit: "C",
      temperature_array: [
        {
          temperature: 5.5,
          timestamp: 1451612700
        },
        {
          temperature: 2.2,
          timestamp: 1451612800
        },
        {
          temperature: 0.0,
          timestamp: 1451612900
        },
        {
          temperature: -0.1,
          timestamp: 1451613000
        },
        {
          temperature: -1.0,
          timestamp: 1451613100
        }
	  ]
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

// Get an array of temperatures specifying just "from" that matches an exact data point
frisby.create('Temperature array from match test')
  .get('http://localhost:8888/api/temperature?from=1451614400')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    success: true,
    data: {
      count: 6,
      full_count: 6,
      from: 1451614400,
      lower: 1451614400,
      upper: 1451614900,
      unit: "C",
      temperature_array: [
        {
          temperature: -0.5,
          timestamp: 1451614400
        },
        {
          temperature: 0.5,
          timestamp: 1451614500
        },
        {
          temperature: 5.1,
          timestamp: 1451614600
        },
        {
          temperature: 6.2,
          timestamp: 1451614700
        },
        {
          temperature: 7.3,
          timestamp: 1451614800
        },
        {
          temperature: 8.4,
          timestamp: 1451614900
        }
	  ]
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

