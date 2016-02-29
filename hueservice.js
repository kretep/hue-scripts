var http = require('http');
var Q = require('q');

var HueService = function() {
  //TODO: automatically determine / move to config:
  var host = '192.168.178.24';
  var username = '46c517e92414b74e2203375f501b4c1e';
  var basePath = '/api/' + username;

  var processResponse = function(response, deferred) {
    var str = ''
    response.on('data', function (chunk) {
      str += chunk;
    });
    response.on('end', function () {
      if (deferred) {
        var result = JSON.parse(str);
        //console.log(result);
        deferred.resolve(result);
      }
    });
  };

  var performRequest = function(path, method, data) {
    //console.log(path + "---" + method + "---" + JSON.stringify(data));
    var deferred = Q.defer();

    // Set up request
    var options = {
      host: host,
      path: path,
      method: method
    };
    var req = http.request(options, function(response) {
      processResponse(response, deferred)
    });

    // Set data if provided
    if (data !== undefined) {
      req.write(JSON.stringify(data));
    }

    // Execute the request
    req.end();
    return deferred.promise;
  }

  return {
    getState: function(lightId) {
      var path = basePath + "/lights/" + lightId;
      return performRequest(path, 'GET');
    },

    updateState: function(lightId, state, brightness) {
      var path = basePath + "/lights/" + lightId + "/state";
      var newState = {
        on: state,
        bri: brightness
      };
      return performRequest(path, 'PUT', newState);
    },

    getSchedules: function() {
      var path = basePath + "/schedules";
      return performRequest(path, 'GET')
    },

    setScheduleAttributes: function(id, time) {
      var path = basePath + "/schedules/" + id;
      var newState = {
        localtime: time
      };
      return performRequest(path, 'PUT', newState);
    }
  }

}();

module.exports = HueService;
