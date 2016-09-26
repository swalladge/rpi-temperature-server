

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


$( function() {
  var serverName = localStorage.tempServerName;
  var nameInput = $('#server-name');
  var t = new Temperature();

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

});

