var frisby = require('frisby');

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
