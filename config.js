var config = {};

// === general settings ===

config.lightIdWakeup = 1;
config.lightIdSunset = 2;

// duration in seconds of the interval to check for auto-off and wakeup
config.intervalDuration = 30;


// === sunset settings ===

// coordinates used to calculate sunset time
config.latitude = 52.158970;
config.longitude = 4.492427;

// correction in minutes to apply to sunset time
config.correction = 15;

// margin in minutes before sunset time to stop auto-off
// (useful if lights turned on manually right before sunset time)
config.sunsetAutoOffMargin = 30;


// === wakeup settings ===

// the hour and minute on which wakeup sequence should complete
config.wakeupTargetHour = 7;
config.wakeupTargetMinute = 0;

// wakeup sequence duration in minutes
config.wakeupDuration = 20;

// margin in minutes after wakeup sequence after which to resume auto-off
config.wakeupEndMargin = 3;


// === auto-off settings ===

// delay in minutes to wait before turning light off
config.autoOffDelayWakeup = 2;
config.autoOffDelaySunset = 0;


module.exports = config;