(function() {
  'use strict';

  angular
      .module('mohican')
      .factory('mnNotify', [mnNotify]);

  function mnNotify() {
    var service = {};
    service.notifications = [];
    service.create = function(text, type) {
      service.notifications.push({
        text: text,
        type: type
      });
    };
    service.get = function() {
      return service.notifications;
    };

    return service;
  }

})();
