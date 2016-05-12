var hue = require('./hueservice.js');

var AutoOffService = function() {

  // Auto turn-off
  var autoTurnOffTimer = null;

  return {

    autoTurnOff: function(lightId, delay) {
      // Checks the current state of the light and if it is on,
      // it will set a timer to turn off the light after a delay in minutes.
      if (!autoTurnOffTimer) {

        // Retrieve current state
        hue.getState(lightId).then(function(result) {
          if (result.state.on) {
            console.log("Setting timeout to turn off light " + lightId);

            // Set the timeout that will turn off the light after delay
            autoTurnOffTimer = setTimeout(function() {
              autoTurnOffTimer = null;
              hue.updateState(lightId, false, 0);
            }, delay * 60 * 1000);

          }
          else {
            autoTurnOffTimer = null;
          }
        })
      }
    },

    cancelTurnOff: function() {
      if (autoTurnOffTimer) {
        autoTurnOffTimer.clearTimeout();
        autoTurnOffTimer = null;
      }
    }

  };

}();

module.exports = AutoOffService;
