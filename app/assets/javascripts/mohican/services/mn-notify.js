(function(mohican) {
  'use strict';

  angular.module('mohican')
         .factory('mnNotify', ['$q', '$modal', '$timeout', mnNotify]);

  var defaultParams = {
    type:           undefined,
    dismissable:    true,
    delay:          false,
    message:        undefined,
    details:        undefined,
    fullyClickable: false,
    buffer:         [],
    actions:        [],
    getMessage:     function() {}
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
      var msg = _.assign({}, defaultParams);
      for(var prop in options) {
        if(angular.isDefined(options[prop])) {
          msg[prop] = options[prop];
        }
      }

      if(options.fullyClickable === true) {
        msg.dismissable = false;
      }

      msg.dismiss = function(reason) {
        var index = this.buffer.indexOf(this);
        if(index !== -1) {
          this.buffer.splice(index, 1);
          this.q.resolve(reason);
        }
      };

      msg.fullClick = function() {
        if(this.fullyClickable) {
          this.dismiss('full click');
        }
      };

      if(_.isFunction(options.getMessage)) {
        options.getMessage(msg);
      }

      return msg;
    }
  };

  function mnNotify($q, $modal, $timeout) {
    var service = {};
    service.notifications = [];
    service.message = function(message, type, actions) {
      var deffered = $q.defer();
      var options = {};
      options.ctrl = {
        message: message,
        type:    type,
        actions: actions ? actions : []
      };
      var modalInstance = $modal.open({
        animation: true,

        template: '<div class="modal-header">                                   \
          <button type="button" class="close"                                   \
                  data-dismiss="modal" ng-if="!options.hideHeaderX"             \
                  ng-click="resolveAction()">&times;</button>                   \
          <h3 class="modal-title">{{mnDialogActiveTitle}}</h3>                  \
        </div>                                                                  \
        <div class="modal-body" modal-fit-in-window>                            \
          <div class="alert alert-{{ctrl.type}}">{{ctrl.message}}</div>         \
        </div>                                                                  \
        <div class="modal-footer" ng-if="!options.hideFooter">                  \
          <button ng-repeat="action in options.ctrl.actions"                         \
                  class="btn btn-primary"                                       \
                  ng-click="resolveAction(action)">{{action}}</button>          \
        </div>',

        controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {
          $scope.resolveAction = function(result) {
            $modalInstance.close(result);
          };
          switch (type) {
            case 'success':
              $scope.mnDialogActiveTitle = 'Success';
              break;
            case 'info':
              $scope.mnDialogActiveTitle = 'Info';
              break;
            case 'warning':
              $scope.mnDialogActiveTitle = 'Warning!';
              break;
            case 'danger':
              $scope.mnDialogActiveTitle = 'Attention!';
              break;
            default:

          }
          $scope.ctrl = options.ctrl;
          $scope.options = options;
        }],

        backdrop: options.backdrop || 'static',

        size: options.dialogSize || 'lg'
      });

      modalInstance.result.then(function(result) {
        deffered.resolve(result);
      });
      return deffered.promise;
    };
    service.create = function(options) {
      var deffered = $q.defer();
      var msg = mnsMessage.create({
        type:    options.type,
        message: options.message,
        buffer:  service.notifications,
        details: options.details,
        q:       deffered,
        actions: options.actions,

        dismissable:    options.dismissable,
        getMessage:     options.getMessage,
        fullyClickable: options.fullyClickable
      });

      if(options.delay) {
        var delayMiliseconds;
        if(options.delay === true ||
           options.delay === -1 ||
           !_.isNumber(options.delay)) {
          delayMiliseconds = 2000;//default value
        }
        else {
          delayMiliseconds = options.delay * 1000;
        }
        $timeout(function() {
          msg.dismiss(delayMiliseconds);
        }, delayMiliseconds);
      }

      service.notifications.push(msg);

      return deffered.promise;
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
    service.dismissAll = function() {
      for(var i = service.notifications.length - 1; i >= 0; i--) {
        if(service.notifications.length) {
          service.notifications[0].dismiss('dismiss all');
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
