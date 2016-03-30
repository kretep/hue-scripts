var hue = require('./hueservice.js');
var SunCalc = require('suncalc');
var dateFormat = require('dateformat');

var SunsetService = function() {

  function convertObjectToList(object) {
    var list = [];
    for (var key in object) {
        // skip loop if the property is from prototype
        if (!object.hasOwnProperty(key)) continue;

        var obj = object[key];
        obj.id = key;
        list.push(obj);
    }
    return list;
  }

  return {
    getSunsetDate: function(latitude, longitude, correction) {
      // Calculate sunset time
      var sunTimes = SunCalc.getTimes(new Date(), latitude, longitude);
      var sunsetDate = new Date(sunTimes.sunset.getTime() + correction * 60 * 1000);
      console.log('Sunset: ' + sunsetDate);
      return sunsetDate;
    },

    updateSunsetSchedule: function(sunsetDate) {
      hue.getSchedules().then(function(result) {
        var schedules = convertObjectToList(result);

        // Retrieve the sunset schedule
        var sunsetSchedule = schedules.reduce(function(prev, curr) {
          return (curr.name === 'sunset') ? curr : prev;
        }, null);

        // Construct new time value
        var sunsetTime = sunsetSchedule.time.split('/')[0] + '/T' +
          dateFormat(sunsetDate, 'HH:MM:ss');
        console.log('Sunset: ' + sunsetTime);

        // Update the schedule
        hue.setScheduleAttributes(sunsetSchedule.id, sunsetTime);
      });
    }

  };

}();

module.exports = SunsetService;
