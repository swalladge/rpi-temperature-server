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
