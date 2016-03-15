var hue = require('./hueservice.js');
var sunset = require('./sunsetservice.js');
var wakeup = require('./wakeupservice.js');

var WAKEUP_LIGHT_ID = 1;
var SUNSET_LIGHT_ID = 2;

// Update sunset schedule
var sunsetDate = sunset.getSunsetDate();
sunset.updateSunsetSchedule(sunsetDate);
var sunsetDateWithMargin = new Date(sunsetDate.getTime() - 2 * 60 * 1000);

// Wake up parameters
var targetHour = 7;
var targetMinute = 0;
var duration = 20;
var margin = 3;
var now = new Date();
var wakeupTargetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(),
                                targetHour, targetMinute, 0, 0);
var wakeupStartDate = new Date(wakeupTargetDate.getTime() - duration * 60 * 1000);
var wakeupEndDate = new Date(wakeupTargetDate.getTime() + margin * 60 * 1000);

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
    wakeup.updateWakeup(WAKEUP_LIGHT_ID, wakeupTargetDate, duration);
  }
  else {
    // Turn off light after 2 minutes if not in wake-up sequence
    if (!autoTurnOffTimer) {
      hue.getState(WAKEUP_LIGHT_ID).then(function(result) {
        if (result.state.on) {
          console.log("Setting timeout to turn off light " + WAKEUP_LIGHT_ID);
          autoTurnOffTimer = setTimeout(function() {
            autoTurnOffTimer = null;
            // Check if we're still not in wake-up sequence
            if (now < wakeupStartDate || now > wakeupEndDate) {
              hue.updateState(WAKEUP_LIGHT_ID, false, 0);
            }
          }, 2 * 60 * 1000);
        }
        else {
          autoTurnOffTimer = null;
        }
      })
    }
  }

  // Turn off sunset light if before sunset
  if (now < sunsetDateWithMargin) {
    hue.updateState(SUNSET_LIGHT_ID, false, 0);
  }

}, 30 * 1000);


// Error handling
process.on('uncaughtException', function (err) {
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
  console.error(err.stack)
  console.log('error');
  process.exit(1)
});
