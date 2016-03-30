var hue = require('./hueservice.js');
var sunset = require('./sunsetservice.js');
var wakeup = require('./wakeupservice.js');
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

// Auto turn-off
var autoTurnOffTimer = null;


// Interval performing wake up and auto off
var interval = setInterval(function () {
  var now = new Date();

  if (now >= wakeupStartDate && now <= wakeupEndDate) {
    // Wake-up sequence
    if (autoTurnOffTimer) {
      autoTurnOffTimer.clearTimeout();
      autoTurnOffTimer = null;
    }
    wakeup.updateWakeup(config.lightIdWakeup, wakeupTargetDate, config.wakeupDuration);
  }
  else {
    // Auto turn off light
    if (!autoTurnOffTimer) {
      hue.getState(config.lightIdWakeup).then(function(result) {
        if (result.state.on) {
          console.log("Setting timeout to turn off light " + config.lightIdWakeup);
          autoTurnOffTimer = setTimeout(function() {
            autoTurnOffTimer = null;
            // Check if we're still not in wake-up sequence
            if (now < wakeupStartDate || now > wakeupEndDate) {
              hue.updateState(config.lightIdWakeup, false, 0);
            }
          }, config.autoOffDelayWakeup * 60 * 1000);
        }
        else {
          autoTurnOffTimer = null;
        }
      })
    }
  }

  // Turn off sunset light if before sunset
  if (now < sunsetDateWithMargin) {
    hue.updateState(config.lightIdSunset, false, 0);
  }

}, config.intervalDuration * 1000);


// Error handling
process.on('uncaughtException', function (err) {
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
  console.error(err.stack)
  console.log('error');
  process.exit(1)
});
