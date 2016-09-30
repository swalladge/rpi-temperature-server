var frisby = require('frisby');
frisby.create('Temperature sensor info test')
  .get('http://localhost:8888/api/info')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
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
