var hue = require('./hueservice.js');
var sunset = require('./sunsetservice.js');
var wakeup = require('./wakeupservice.js');
var autooff = require('./autooffservice.js');
var config = require('./config.js');


// Update sunset schedule
var sunsetDate = sunset.getSunsetDate(config.latitude, config.longitude, config.correction);
sunset.updateSunsetSchedule(sunsetDate);
var sunsetDateWithMargin = new Date(sunsetDate.getTime() - config.sunsetAutoOffMargin * 60 * 1000);

// Wake up times
var now = new Date();
var wakeupTargetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(),
                                config.wakeupTargetHour, config.wakeupTargetMinute, 0, 0);
var wakeupStartDate = new Date(wakeupTargetDate.getTime() - config.wakeupDuration * 60 * 1000);
var wakeupEndDate = new Date(wakeupTargetDate.getTime() + config.wakeupEndMargin * 60 * 1000);

// Interval performing wake up and auto off
var interval = setInterval(function () {
  var now = new Date();

  // Wakeup light
  if (now >= wakeupStartDate && now <= wakeupEndDate) {
    // Cancel any auto turn-offs
    autooff.cancelTurnOff();

    // Wake-up sequence
    wakeup.updateWakeup(config.lightIdWakeup, wakeupTargetDate, config.wakeupDuration);
  }
  else {
    // Auto turn off light if not in wakeup sequence
    autooff.autoTurnOff(config.lightIdWakeup, config.autoOffDelayWakeup);
  }

  // Turn off sunset light if before sunset
  if (now < sunsetDateWithMargin) {
    autooff.autoTurnOff(config.lightIdSunset, config.autoOffDelaySunset);
  }
  else {
    autooff.cancelTurnOff();
  }

}, config.intervalDuration * 1000);


// Error handling
process.on('uncaughtException', function (err) {
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
  console.error(err.stack)
  console.log('error');
  process.exit(1)
});
