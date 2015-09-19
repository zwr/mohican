(function(mohican) {
  'use strict';

  angular
      .module('mohican')
      .factory('mnNotify', ['$q', mnNotify]);

  function mnNotify($q) {
    var service = {};
    service.notifications = [];
    service.create = function(message, type, details) {
      var msg = mohican.mnsMessage.create({
        type:    type,
        message: message,
        buffer:  service.notifications,
        details: details,
        q:       $q.defer()
      });
      service.notifications.push(msg);
    };
    service.get = function() {
      return service.notifications;
    };
    service.clearAll = function() {
      //service.notifications = [];
      for(var i = service.notifications.length - 1; i >= 0; i--) {
        if(service.notifications.length) {
          service.notifications[0].clear();
        }
      };
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
