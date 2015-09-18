(function(mohican) {
  'use strict';

  angular
      .module('mohican')
      .factory('mnNotify', [mnNotify]);

  function mnNotify() {
    var service = {};
    service.notifications = [];
    service.create = function(message, type, details) {
      var msg = mohican.mnsMessage.create({
        type:    type,
        message: message,
        buffer:  service.notifications,
        details: details
      });
      service.notifications.push(msg);
    };
    service.get = function() {
      return service.notifications;
    };
    service.clear = function() {
      service.notifications = [];
      // for(var i = service.notifications.length - 1; i >= 0; i--) {
      //   service.notifications.splice(i, 1);
      // };
    };
    service.getMostCriticalMessageType = function() {
      var types = ['success', 'info', 'warning', 'danger'];
      var mostCrType = '';
      service.notifications.forEach(function(notif) {
        var typeIndex = types.indexOf(notif.type);
        var mostCrTypeIndex = types.indexOf(mostCrType);
        if(typeIndex > mostCrTypeIndex) {
          mostCrType = notif.type;
        }
      });
      return mostCrType;
    };

    return service;
  }

})(window.mohican);
