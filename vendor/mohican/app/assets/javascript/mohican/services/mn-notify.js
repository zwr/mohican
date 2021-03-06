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
    actions:        []
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

        template: '<div class="modal-header bg-{{ctrl.type}}">                  \
          <button type="button" class="close"                                   \
                  data-dismiss="modal" ng-if="!options.hideHeaderX"             \
                  ng-click="resolveAction()">&times;</button>                   \
          <h3 class="modal-title">{{mnDialogActiveTitle}}</h3>                  \
        </div>                                                                  \
        <div class="modal-body bg-{{ctrl.type}}" modal-fit-in-window>           \
          {{ctrl.message}}                                                      \
        </div>                                                                  \
        <div class="modal-footer bg-{{ctrl.type}}" ng-if="!options.hideFooter"> \
          <button ng-repeat="action in options.ctrl.actions"                    \
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
    service.success = function(options) {
      options.type = 'success';
      return service.create(options);
    };
    service.info = function(options) {
      options.type = 'info';
      return service.create(options);
    };
    service.warning = function(options) {
      options.type = 'warning';
      return service.create(options);
    };
    service.danger = function(options) {
      options.type = 'danger';
      return service.create(options);
    };
    service.create = function(options) {
      if(service.currentControllName &&
         options.ownerCtrl &&
         service.currentControllName !== options.ownerCtrl) {
        var returnMessage = 'Controller has been changed';
        return {
          promise: $q.reject(returnMessage),
          message: null
        };
      }
      var existingMessage;
      service.notifications.forEach(function(msg) {
        if(msg.type === options.type &&
           msg.message === options.message &&
           msg.details === options.details) {
          existingMessage = msg;
        }
      });
      if(existingMessage) {
        return {
          promise: existingMessage.q.promise,
          message: existingMessage
        };
      }
      else {
        var deffered = $q.defer();
        var msg = mnsMessage.create({
          type:      options.type,
          message:   options.message,
          buffer:    service.notifications,
          details:   options.details,
          q:         deffered,
          actions:   options.actions,
          ownerCtrl: options.ownerCtrl,

          dismissable:    options.dismissable,
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

        return {
          promise: deffered.promise,
          message: msg
        };
      }
    };
    service.get = function() {
      return service.notifications;
    };
    service.controllerChanged = function(ctrlName) {
      service.currentControllName = ctrlName;
      service.notifications.forEach(function(message) {
        if(message.ownerCtrl &&
           message.ownerCtrl !== ctrlName) {
          message.dismiss();
        }
      });
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
    service.dismissAllByController = function(ctrlName) {
      for(var i = service.notifications.length - 1; i >= 0; i--) {
        if(service.notifications.length &&
           service.notifications[0].ownerCtrl === ctrlName) {
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
    service.clear = function() {
      if(service.reportModalInstance) {
        service.reportModalInstance.close();
        service.reportModalInstance = undefined;
        service.reportModalDeffered.resolve();
      }
    };
    service.clearReportConnectivityProblem = function() {
      if(service.connectivityWarning) {
        service.connectivityWarning.message.dismiss();
        service.connectivityWarning = undefined;
      }
    };
    service.reportConnectivityProblem = function() {
      console.log('report connectivity problem');
      if(!service.connectivityWarning) {
        service.connectivityWarning = service.warning({
          message:     'connectivity problem',
          dismissable: false
        });
      }

      return service.connectivityWarning;
    };
    service.report = function(code) {
      if(service.reportModalInstance) {
        console.log('modal already exist');
        //TODO handle reports priority if there is one already shown
      }
      else {
        if(code === 401) {
          reportAuthProblem();
        }
      }

      return service.reportModalDeffered.promise;
    };
    function reportAuthProblem() {
      service.reportModalCode = 401;
      service.reportModalDeffered = $q.defer();
      service.reportModalInstance = $modal.open({
        animation: true,

        template: '<div class="modal-header bg-danger">\
          <h3 class="modal-title">Please Sign In</h3>\
        </div>\
        <div class="modal-body bg-danger" modal-fit-in-window>\
          <form>\
            <div class="form-group">\
              <div ng-show="errorMessage">{{errorMessage}}</div>\
            </div>\
            <div class="form-group">\
              <label for="email">Email</label>\
              <input type="text" ng-model="email" class="form-control" id="email" placeholder="email">\
            </div>\
            <div class="form-group">\
              <label for="password">Password</label>\
              <input type="password" ng-model="password" class="form-control" id="password" placeholder="password">\
            </div>\
            <button ng-click="signIn()" class="btn btn-default">Sign in</button>\
          </form>\
        </div>',
        controller: ['$scope', 'Auth', function($scope, Auth) {
          $scope.signIn = function() {
            Auth.login({
              email:    $scope.email,
              password: $scope.password
            }).then(function(user) {
              service.reportModalDeffered.resolve(user);
            }, function(error) {
              if(error.data) {
                $scope.errorMessage = error.data.error;
              }
              else {
                $scope.errorMessage = 'no connectivity';
              }
              $scope.password = '';
            });
          };
        }],
        backdrop: 'static',
        keyboard: false
      });

      // service.reportModalInstance.result.then(function() {
      //   service.reportModalDeffered.resolve();
      // });
    }

    return service;
  }

})(window.mohican);
