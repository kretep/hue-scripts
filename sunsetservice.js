var hue = require('./hueservice.js');
var SunCalc = require('suncalc');

var SunsetService = function() {

  // TODO: move to configuration
  var latitude = 52.158970;
  var longitude = 4.492427;

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
    getSunsetDate: function() {
      // Calculate sunset time
      var sunTimes = SunCalc.getTimes(new Date(), latitude, longitude);
      // 15 minutes after sunset
      var sunsetDate = new Date(sunTimes.sunset.getTime() + 15 * 60 * 1000);
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
        var sunsetTime = sunsetSchedule.time.split('/')[0] +
          '/T' + sunsetDate.getHours() + ':' + sunsetDate.getMinutes() +
          ':' + sunsetDate.getSeconds();
        console.log('Sunset: ' + sunsetTime);

        // Update the schedule
        hue.setScheduleAttributes(sunsetSchedule.id, sunsetTime);
      });
    }

  };

}();

module.exports = SunsetService;
