
// important global variables we need
window.currentInterval = null;
window.t = null;

// fake ajax that doesn't do anything
var fakeAjax = function() {
}
fakeAjax.prototype.done = function() {
}

var Temperature = function() {
  this.url = null;
  this.endpoint = null;
  this.ready = false;
};

Temperature.prototype.init = function(url) {
  this.url = url;
  this.endpoint = url + '/api/temperature/';
  this.baseEndpoint = url + '/api/';
  this.ready = true;
};

Temperature.prototype.errorFunc = function(res, textstatus, error, title) {
  var msg;

  // check if it was an error generated from the server or the client
  if (res && res.status >= 400) {
    msg = res.status;
    if (error) {
      msg = msg + ' - ' + error;
    }
    title = title || 'Server Request Failed!';
  } else {
    title = 'Server Request Failed!';
    msg = 'Either your internet connection is down, or the server is unreachable.';
  }

  // show the alert
  showAlert('#alert-box', 'danger', title, msg);
  // not ready any more
  this.ready = false;

  // say so in server info
  $('.server-info').html('Not connected to any server. Click the <code>Change Server</code> button to configure.');
};

Temperature.prototype.getInfo = function() {
  if (this.ready) {
    return $.ajax(this.baseEndpoint + 'info', {
      jsonp: false,
      dataType: 'json',
      method: 'GET',
      error: this.errorFunc.bind(this)
    });
  } else {
    return new fakeAjax();
  }
};

Temperature.prototype.getCurrent = function() {
  if (this.ready) {
    return $.ajax(this.endpoint + 'current', {
      jsonp: false,
      dataType: 'json',
      method: 'GET',
      error: this.errorFunc.bind(this)
    });
  } else {
    return new fakeAjax();
  }
};

Temperature.prototype.getList = function(from, to) {
  if (this.ready) {
    return $.ajax(this.endpoint, {
      jsonp: false,
      dataType: 'json',
      method: 'GET',
      data: {'from': from, 'to': to},
      error: this.errorFunc.bind(this)
    });
  } else {
    return new fakeAjax();
  }
};

Temperature.prototype.getStat = function(type, from, to) {
  if (this.ready) {
    return $.ajax(this.endpoint + type, {
      jsonp: false,
      dataType: 'json',
      method: 'GET',
      data: {'from': from, 'to': to},
      error: this.errorFunc.bind(this)
    });
  } else {
    return new fakeAjax();
  }
};

function removeAlerts(selector) {
  $(selector).html('');
}

function showAlert(selector, type, title, msg) {
  var content = '<strong>' + title + '</strong>';
  content += ' ' + msg;

  var alert_html = '<div class="alert alert-' + type + ' alert-dismissible" role="alert"> \
                   <button type="button" class="close" data-dismiss="alert" aria-label="Close">\
                   <span aria-hidden="true">&times;</span></button>';
  alert_html += content + '</div>';

  // remove the existing alerts
  removeAlerts(selector);
  // show the new one
  $(selector).append($(alert_html));
}

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
      showAlert('#stats-alert-box', 'warning', 'Cannot display data!', 'no data for that range');
      return;
    }

    var data = res.data.temperature_array.map(function(e) {
      return {date: new Date(e.timestamp*1000), value: e.temperature };
    });

    var desc  = '<p>Graph of the temperature between <b>' +  (moment.unix(res.data.lower)).toLocaleString();
    desc += '</b> and <b>' +  (moment.unix(res.data.upper)).toLocaleString() + '</b></p>';
    desc += '<p> Technical: showing ' + res.data.count + ' data points. (' + res.data.full_count + ' logged in date range)</p>';

    $('#chart-info').html(desc);

    MG.data_graphic({
      data: data,
      full_width: true,
      height: 350,
      target: '#chart',
      x_accessor: 'date',
      y_accessor: 'value',
      x_label: 'Date',
      y_label: 'Temperature (°C)',
      interpolate: d3.curveCatmullRom.alpha(0.5),
      mouseover: function(d, i) {
        d3.select('#chart svg .mg-active-datapoint')
          .text(d.value.toFixed(1) + '°C at ' + moment(d.date).toLocaleString());
      },
      baselines: [{value: 0, label: '0°C'}],
    });
  });
}

function updateCurrent() {
  t.getCurrent().done(function(res, statustext) {
    var temp = res.data.temperature.toFixed(1);
      $('.current-temperature').text(temp);
    });
}

function updateStats() {
  var limit = getLimits();

  t.getStat('max', limit.from, limit.to).done(function(res, statustext) {
    if (res.data.count > 0) {
      var temp = res.data.max.temperature;
      var timestamp = res.data.max.timestamp;

      $('.max-temperature').text(temp.toFixed(1));
      $('.max-temperature-date').text(moment.unix(timestamp).toLocaleString());
    }
  });

  t.getStat('min', limit.from, limit.to).done(function(res, statustext) {
    if (res.data.count > 0) {
      var temp = res.data.min.temperature;
      var timestamp = res.data.min.timestamp;

      $('.min-temperature').text(temp.toFixed(1));
      $('.min-temperature-date').text(moment.unix(timestamp).toLocaleString());
    }
  });

  t.getStat('ave', limit.from, limit.to).done(function(res, statustext) {
    if (res.data.count > 0) {
      $('.ave-temperature').text(res.data.ave.toFixed(1));
      $('.ave-temperature-count').text(res.data.count);
      $('.ave-temperature-date-lower').text(moment.unix(res.data.lower).toLocaleString());
      $('.ave-temperature-date-upper').text(moment.unix(res.data.upper).toLocaleString());
    }
  });

  updateGraph();
}

// gets the server info - once this is done, let's set up everything else (since
// we know the server is running
function getInitialServerSetup() {
  t.getInfo().done(function(res, statustext) {
    removeAlerts('#alert-box');

    // show a connected message
    var info = 'Currently connected to ';
    if (res.data.server_name) {
      info += '<strong>' + res.data.server_name + '</strong>.';
    } else {
      info += '<strong>' + t.url + '</strong>.';
    }

    if (res.data.location) {
      info += ' Location: <i>' + res.data.location + '</i>';
    }

    if (!res.data.live) {
      info += ' <strong>Server is in test mode generating random temperature data.</strong>';
    }

    $('.server-info').html(info);


    // initially get temp, and update current temp every 5 minutes
    updateCurrent();

    // set up the interval based on the server's logging interval
    if (currentInterval && currentInterval.clear) {
      currentInterval.clear();
    }
    currentInterval = setInterval(updateCurrent, res.data.log_interval * 1000);

    // update the stats
    updateStats();

  });
}


$( function() {
  var serverName = localStorage.tempServerName;
  window.t = new Temperature();

  // initially fill in server name if available
  if (serverName) {
    $('#server-name').val(serverName);
    $('.server-url-display').text(serverName);
    t.init(serverName);
  } else {
    t.init('');
    serverName = '';
  }

  // get info from the server
  // also initiates other server requests
  getInitialServerSetup();


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
  });
  $('#upper-datepicker').on('dp.change', function (e) {
      $('#lower-datepicker').data('DateTimePicker').maxDate(e.date);
  });

  $('#requery-data').on('click', function(e) {
    updateStats();
  });

  $('#server-conf-save').on('click', function(e) {
    tempServerName = $('#server-name').val();

    // check if server name had changed
    if (tempServerName != serverName) {
      serverName = tempServerName;
      localStorage.tempServerName = serverName;
      t.init(serverName);
      getInitialServerSetup();
    }

    $('#server-conf-modal').modal('hide');
  });

  $('#server-conf-modal').on('hidden.bs.modal', function(e) {
      $('#server-name').val(serverName);
  });

});
