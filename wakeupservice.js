var hue = require('./hueservice.js');

var WakeupService = function() {

  return {
    updateWakeup: function(lightId, target, duration) {
      var now = new Date();
      var diffMin = (target.getTime() - now.getTime()) / (1000 * 60);
      console.log(diffMin + " minutes till wake up");
      if (diffMin > 0) {
        var fract = diffMin / duration;
        var brightness = 255 - Math.floor(fract * 255);
        if (brightness < 0) {
          hue.updateState(lightId, false, 0);
        }
        else {
          hue.updateState(lightId, true, brightness);
        }
      }
      else {
        hue.updateState(lightId, true, 255);
      }
    }
  }
}();

module.exports = WakeupService;
