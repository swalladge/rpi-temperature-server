

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

// utility function to grab the upper and lower timestamps from the date pickers
function getLimits() {
  var limits = {};
  try {
    limits.from = $('#lower-datepicker').data('DateTimePicker').date().unix();
  } catch (e) {
  }
  try {
    limits.to = $('#upper-datepicker').data('DateTimePicker').date().unix();
  } catch (e) {
  }

  return limits;
}

function updateGraph(e) {
  var limit = getLimits();

  t.getList(limit.from, limit.to).done(function(res, statustext) {

    if (res.data.count == 0) {
      console.log('No data for that range!');
      // TODO: do something useful for this
      return;
    }

    var data = res.data.temperature_array.map(function(e) {
      return {date: new Date(e.timestamp*1000), value: e.temperature };
    });

    var desc  = '<p>The temperature between <b>' +  (moment.unix(res.data.lower)).toLocaleString();
        desc += '</b> and <b>' +  (moment.unix(res.data.upper)).toLocaleString() + '</b></p>';
        desc += '<p>' + res.data.count + '/' + res.data.full_count + ' data points shown</p>';

    // TODO: display the description above/below the graph as well?

    MG.data_graphic({
      title: 'Temperature',
      description: desc,
      data: data,
      full_width: true,
      height: 350,
      target: '#chart',
      x_accessor: 'date',
      y_accessor: 'value',
      x_label: 'Date',
      y_label: 'Temperature (°C)'
    });
  });
}

function updateCurrent() {
    t.getCurrent().done(function(res, statustext) {
      var temp = res.data.temperature.toFixed(1);
      $('.current-temperature').text(temp);
      console.log(res);
      console.log(statustext);
    });
}

function updateStats() {
  var limit = getLimits();

  t.getStat('max', limit.from, limit.to).done(function(res, statustext) {
    console.log(res);
    console.log(statustext);

    var temp = res.data.max.temperature;
    var timestamp = res.data.max.timestamp;

    $('.max-temperature').text(temp.toFixed(2));
    $('.max-temperature-date').text(moment.unix(timestamp).toLocaleString());

  });

  t.getStat('min', limit.from, limit.to).done(function(res, statustext) {
    console.log(res);
    console.log(statustext);

    var temp = res.data.min.temperature;
    var timestamp = res.data.min.timestamp;

    $('.min-temperature').text(temp.toFixed(2));
    $('.min-temperature-date').text(moment.unix(timestamp).toLocaleString());
  });

  t.getStat('ave', limit.from, limit.to).done(function(res, statustext) {
    console.log(res);
    console.log(statustext);

    var temp = res.data.ave;
    $('.ave-temperature').text(temp.toFixed(2));
  });
}


$( function() {
  var serverName = localStorage.tempServerName;
  var nameInput = $('#server-name');
  window.t = new Temperature();

  // initial fill in server name if available
  if (serverName) {
    nameInput.val(serverName);
    $('.server-name-display').text(serverName);
    t.init(serverName);
  } else {
    t.init('');
  }

  // initually get temp, and update current temp every 5 minutes
  updateCurrent();
  setInterval(updateCurrent, 300000);


  // graph button
  $('#update-graph-btn').on('click', updateGraph);

  // set up the date pickers
  var yesterday = moment().subtract(1, 'days');
  var now = moment();
  $('#lower-datepicker').datetimepicker({
    defaultDate: yesterday,
    focusOnShow: false,
    stepping: 5,
    maxDate: now,
    showClear: true,
    showClose: true,
    useCurrent: false
  });
  $('#upper-datepicker').datetimepicker({
    defaultDate: now,
    minDate: yesterday,
    focusOnShow: false,
    stepping: 5,
    showClear: true,
    showClose: true,
    useCurrent: false //Important! See issue #1075
  });

  // link the two
  $('#lower-datepicker').on('dp.change', function (e) {
      $('#upper-datepicker').data('DateTimePicker').minDate(e.date);
      updateStats();
  });
  $('#upper-datepicker').on('dp.change', function (e) {
      $('#lower-datepicker').data('DateTimePicker').maxDate(e.date);
      updateStats();
  });

  $('#server-conf-modal').on('hide.bs.modal', function(e) {
    serverName = nameInput.val();
    $('.server-name-display').text(serverName);
    localStorage.tempServerName = serverName;
    t.init(serverName);
  });

  // initial get stats
  updateStats();
});
