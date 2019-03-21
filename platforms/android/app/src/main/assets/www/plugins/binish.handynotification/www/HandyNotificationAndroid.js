cordova.define("binish.handynotification.HandyNotificationAndroid", function(require, exports, module) {
var exec = require('cordova/exec');

exports.coolMethod = function (arg0, success, error) {
    exec(success, error, 'HandyNotificationAndroid', 'pushNotification', [arg0]);
};

});
