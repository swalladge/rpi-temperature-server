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
      location: "Inside a Travis container",
      test_data: "tests/api_test_data.txt",
      timezone: 570
    }
  })
  .expectJSONTypes({
    data: {
      live: Boolean,
      log_interval: Number,
      server_name: String,
      location: String,
      test_data: String,
      timezone: Number
    }
  })
.toss();
