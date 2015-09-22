(function(mohican) {
  'use strict';

  angular.module('mohican')
         .factory('mnNotify', ['$q', mnNotify]);

  var defaultParams = {
    type:           undefined,
    dismissable:    true,
    delay:          false,
    message:        undefined,
    details:        undefined,
    fullyClickable: false,
    buffer:         []
  };

  var alertTypes = [
    'success',
    'info',
    'warning',
    'danger'
  ];

  var mnsMessage = {
    create: function(options) {
      if(!options.type) {
        throw 'message type is required';
      }
      if(alertTypes.indexOf(options.type) === -1) {
        throw 'unknown message type';
      }
      var msg = _.assign({}, defaultParams, options);

      msg.clear = function(reason) {
        var index = this.buffer.indexOf(this);
        this.buffer.splice(index, 1);
        this.q.resolve(reason);
      };

      return msg;
    }
  };

  function mnNotify($q) {
    var service = {};
    service.notifications = [];
    service.create = function(message, type, details) {
      var msg = mnsMessage.create({
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
    service.countByMessageType = function(type) {
      var count = 0;
      service.notifications.forEach(function(message) {
        if(message.type === type) {
          count++;
        }
      });
      return count;
    };
    service.clearAll = function() {
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
