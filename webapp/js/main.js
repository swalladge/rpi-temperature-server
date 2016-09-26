

var Temperature = function() {
  this.url = null;
  this.endpoint = null;
  this.ready = false;


};

Temperature.prototype.init = function(url) {
  this.url = url;
  this.endpoint = url + '/api/temperature/';
  this.ready = true;
};

Temperature.prototype.errorFunc = function(res, textstatus, error, title) {
  var msg;

  // check if it was an error generated from the server or the client
  if (res && res.status >= 400) {
    msg = res.status;
    title = title || 'Server Request Failed';
  } else {
    title = 'Server Request Failed';
    msg =  'Either your internet connection is down, or the server is unreachable.';
  }

  // build up the rest of the message
  msg = msg + ' ' + textstatus;
  if (textstatus && error) {
    msg = msg + ' (' + error + ')';
  }

  // TODO: use these messages for something useful in the UI
  console.log(title + ':');
  console.log(msg);
};

Temperature.prototype.getCurrent = function() {
  return $.ajax(this.endpoint + 'current', {
    jsonp: false,
    dataType: 'json',
    method: 'GET',
    error: this.errorFunc.bind(this)
  });
};

Temperature.prototype.getList = function(from, to) {
  return $.ajax(this.endpoint, {
    jsonp: false,
    dataType: 'json',
    method: 'GET',
    data: {'from': from, 'to': to},
    error: this.errorFunc.bind(this)
  });
};

Temperature.prototype.getStat = function(type, from, to) {
  return $.ajax(this.endpoint + type, {
    jsonp: false,
    dataType: 'json',
    method: 'GET',
    data: {'from': from, 'to': to},
    error: this.errorFunc.bind(this)
  });
};


function updateGraph(e) {
  var from = $('#lower-limit').val() || undefined;
  var to = $('#upper-limit').val() || undefined;

  t.getList(from, to).done(function(res, statustext) {

    if (res.data.count == 0) {
      console.log('No data for that range!');
      // TODO: do something useful for this
    }

    var data = res.data.temperature_array.map(function(e) {
      return {date: new Date(e.timestamp*1000), value: e.temperature };
    });

    // TODO: fancier stuff for graph
    // ideas:
    //     - display date/time range in title
    //     - display number of data points and number of points dropped

    MG.data_graphic({
      title: 'Temperature',
      description: 'temps for a range...',
      data: data,
      width: 600,
      height: 250,
      target: '#chart',
      x_accessor: 'date',
      y_accessor: 'value'
    });
  });
}


$( function() {
  var serverName = localStorage.tempServerName;
  var nameInput = $('#server-name');
  window.t = new Temperature();

  // click handler for form
  $('#update-details-btn').on('click', function(e) {
    serverName = nameInput.val();
    localStorage.tempServerName = serverName;
    t.init(serverName);
  });

  // initial fill in server name if available
  if (serverName) {
    nameInput.val(serverName);
    t.init(serverName);
  } else {
    t.init('');
  }

  // update current temp button
  $('#update-current-btn').on('click', function(e) {
    t.getCurrent().done(function(res, statustext) {
      var temp = res.data.temperature;
      $('#current-temp').text(temp + '°C');
      console.log(res);
      console.log(statustext);
    });
  });

  $('#update-max-btn').on('click', function(e) {
    var from = $('#lower-limit').val() || undefined;
    var to = $('#upper-limit').val() || undefined;

    t.getStat('max', from, to).done(function(res, statustext) {
      console.log(res);
      console.log(statustext);

      var temp = res.data.max.temperature;
      var timestamp = res.data.max.timestamp;
      var text = temp.toFixed(2) + '°C ';
      var d = new Date(timestamp*1000);
      text += ' at ' + d.toLocaleTimeString() + ' ' + d.toLocaleDateString();

      $('#max-temp').text(text);
    });
  });

  $('#update-min-btn').on('click', function(e) {
    var from = $('#lower-limit').val() || undefined;
    var to = $('#upper-limit').val() || undefined;

    t.getStat('min', from, to).done(function(res, statustext) {
      console.log(res);
      console.log(statustext);

      var temp = res.data.min.temperature;
      var timestamp = res.data.min.timestamp;
      var text = temp.toFixed(2) + '°C ';
      var d = new Date(timestamp*1000);
      text += ' at ' + d.toLocaleTimeString() + ' ' + d.toLocaleDateString();

      $('#min-temp').text(text);
    });
  });

  $('#update-ave-btn').on('click', function(e) {
    var from = $('#lower-limit').val() || undefined;
    var to = $('#upper-limit').val() || undefined;

    t.getStat('ave', from, to).done(function(res, statustext) {
      console.log(res);
      console.log(statustext);

      var temp = res.data.ave;
      var text = temp.toFixed(2) + '°C ';

      $('#ave-temp').text(text);
    });
  });

  $('#update-graph-btn').on('click', updateGraph);
});

