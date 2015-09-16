(function(mohican) {
  'use strict';

  angular
      .module('mohican')
      .factory('mnNotify', [mnNotify]);

  function mnNotify() {
    var service = {};
    service.notifications = [];
    service.create = function(message, type) {
      var msg = mohican.mnsMessage.create({
        type:    type,
        message: message,
        buffer:  service.notifications
      });
      service.notifications.push(msg);
    };
    service.get = function() {
      return service.notifications;
    };

    return service;
  }

})(window.mohican);
