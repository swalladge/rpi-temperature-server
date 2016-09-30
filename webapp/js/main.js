
// important global variables we need
window.currentInterval = null;
window.t = null;
window.dateFormat = 'YYYY-MM-DD HH:mm';

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
    msg = 'Either your internet connection is down, or the server is unreachable. Please verify the specified server is correct (click <code>Change Server</code> to edit) or refresh the page to try again.';
  }

  // show the alert
  showAlert('#alert-box', 'danger', title, msg);
  // not ready any more
  this.ready = false;

  // say so in server info
  $('.server-info').html('<p class="bg-danger">Not connected to any server. Click <code>Change Server</code> to configure.</p>');
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

Temperature.prototype.getCurrent = function(unit) {
  if (this.ready) {
    return $.ajax(this.endpoint + 'current', {
      jsonp: false,
      dataType: 'json',
      method: 'GET',
      data: {'unit': unit},
      error: this.errorFunc.bind(this)
    });
  } else {
    return new fakeAjax();
  }
};

Temperature.prototype.getList = function(from, to, unit) {
  if (this.ready) {
    return $.ajax(this.endpoint, {
      jsonp: false,
      dataType: 'json',
      method: 'GET',
      data: {'from': from, 'to': to, 'unit': unit},
      error: this.errorFunc.bind(this)
    });
  } else {
    return new fakeAjax();
  }
};

Temperature.prototype.getStat = function(type, from, to, unit) {
  if (this.ready) {
    return $.ajax(this.endpoint + type, {
      jsonp: false,
      dataType: 'json',
      method: 'GET',
      data: {'from': from, 'to': to, 'unit': unit},
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

  var alert_html = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' +
                   '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                   '<span aria-hidden="true">&times;</span></button>';
  alert_html += content + '</div>';

  // remove the existing alerts
  removeAlerts(selector);
  // show the new one
  $(selector).append($(alert_html));
}

// utility function to get the selected unit of measure
function getUnit() {
  var e = document.getElementById("units-selector");
  return e.value;
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

function updateGraph(markers, baselines) {
  var limit = getLimits();
  var markers = markers || [];
  var baselines = baselines || [];

  t.getList(limit.from, limit.to, getUnit()).done(function(res, statustext) {

    var data = res.data.temperature_array.map(function(e) {
      return {date: new Date(e.timestamp*1000), value: e.temperature };
    });

    var desc  = '<p>Graph of the temperature between <b>' +  (moment.unix(res.data.lower)).format(dateFormat);
    desc += '</b> and <b>' +  (moment.unix(res.data.upper)).format(dateFormat) + '</b></p>';
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
      y_label: 'Temperature (°' + res.data.unit + ')',
      interpolate: d3.curveCatmullRom.alpha(0.5),
      mouseover: function(d, i) {
        d3.select('#chart svg .mg-active-datapoint')
          .text(d.value.toFixed(1) + '°' + res.data.unit + ' at ' + moment(d.date).format(dateFormat));
      },
      baselines: baselines,
      markers: markers,
      left: 70
    });
  });
}

function updateCurrent() {
  t.getCurrent(getUnit()).done(function(res, statustext) {
    var temp = res.data.current.temperature.toFixed(1) + '°' + res.data.unit;
      $('.current-temperature').text(temp);
    });
}

function updateStats() {
  var limit = getLimits();

  t.getStat('stats', limit.from, limit.to, getUnit()).done(function(res, statustext) {
    var data = res.data;
    if (data.count > 0) {
      removeAlerts('#stats-alert-box');

      $('.max-temperature').text(data.max.temperature.toFixed(1) + '°' + data.unit);
      $('.max-temperature-date').text(moment.unix(data.max.timestamp).format(dateFormat));
      $('.min-temperature').text(data.min.temperature.toFixed(1) + '°' + data.unit);
      $('.min-temperature-date').text(moment.unix(data.min.timestamp).format(dateFormat));

      $('.ave-temperature').text(data.ave.toFixed(1) + '°' + data.unit);
      $('.ave-temperature-count').text(data.count);
      $('.ave-temperature-date-lower').text(moment.unix(data.lower).format(dateFormat));
      $('.ave-temperature-date-upper').text(moment.unix(data.upper).format(dateFormat));

      var markers = [];
      var baselines = [];
      if (data.count > 1) {
        markers = [
          {
            'date': new Date(data.max.timestamp*1000),
            'label': 'max: ' + data.max.temperature.toFixed(1) + '°' + data.unit
          },
          {
            'date': new Date(data.min.timestamp*1000),
            'label': 'min: ' + data.min.temperature.toFixed(1) + '°' + data.unit
          },
        ];

        baselines = [
          {
            'value': data.ave,
            'label': 'ave: ' + data.ave.toFixed(1) + '°' + data.unit
          }
        ];

        if (Math.abs(data.ave) > 3) {
          baselines.push(
            {
              'value': 0,
              'label': '0°' + data.unit
            }
          )
        }
      }

      updateGraph(markers, baselines);

    } else {
      showAlert('#stats-alert-box', 'warning', 'Cannot display data!', 'no data for that range');
      return;
    }

  });

}

// gets the server info - once this is done, let's set up everything else (since
// we know the server is running
function getInitialServerSetup() {
  t.getInfo().done(function(res, statustext) {
    removeAlerts('#alert-box');

    // show a connected message
    var info = '<p class="bg-success">Connected to ';
    if (res.data.server_name) {
      info += '<strong>' + res.data.server_name + '</strong>.';
    } else {
      info += '<strong>' + t.url + '</strong>.';
    }

    // pick up server information
    var stats = [];
    if (res.data.location) {
      stats.push('Location: <i>' + res.data.location + '</i>');
    }
    if (res.data.timezone) {
      stats.push('Timezone: <i>UTC' + moment().utcOffset(res.data.timezone).format('Z') + '</i>');
    }

    if (stats.length > 0) {
      stats = stats.join(' | ');
      info += '</p><p class="bg-info">Server Info: ' + stats;
    }

    info += '</p>';

    if (!res.data.live) {
      info += ' <p class="bg-warning">Server is in test mode generating random temperature data.</p>';
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

  var tz = 'UTC' + moment().format('Z');
  $('#tz-info').html('All dates displayed in your browser configured timezone: ' + tz);

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
    format : dateFormat,
    defaultDate: yesterday,
    focusOnShow: false,
    stepping: 1,
    maxDate: now,
    showClear: true,
    showClose: true,
    useCurrent: false
  });
  $('#upper-datepicker').datetimepicker({
    format : dateFormat,
    defaultDate: now,
    minDate: yesterday,
    focusOnShow: false,
    stepping: 1,
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
