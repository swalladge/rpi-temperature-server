var frisby = require('frisby');
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
