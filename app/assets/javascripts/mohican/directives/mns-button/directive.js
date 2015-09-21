//= require ./template
//= require_self

//TODO: there can be only one instance because
//of possible template's <script> ids collision

angular.module('mohican')
  .directive('mnsButton', ['$compile', 'mnNotify', function($compile, mnNotify) {
      'use strict';
      return {
        restrict:    'A',
        transclude:  true,
        templateUrl: 'mohican/directives/mns-button/template.html',
        controller:  ['$scope', function($scope) {
          $scope.popoverOpened = false;
        }],
        compile: function compile(element, attrs) {
          if(!element.attr('popover-placement')) {
            element.attr('popover-placement', 'bottom');
          }
          if(!element.attr('popover-title')) {
            element.attr('popover-title', 'Notifications');
          }
          if(!element.attr('popover-template')) {
            element.attr('popover-template', '"mnPopoverTpl.html"');
          }
          if(!element.attr('popover-animation')) {
            element.attr('popover-animation', 'false');
          }
          if(!element.attr('id')) {
            element.attr('id', 'btnNotif');
          }
          if(!element.attr('popover-elem')) {
            element.attr('popover-elem', 'true');
          }

          element.removeAttr('mns-button');

          element.addClass('hidden');

          return {
            post: function postLink(scope, elem, attrs, controller, transclusionFn) {
              scope.mnNotify = mnNotify;

              function removeAlertClasses() {
                elem.removeClass('btn-success');
                elem.removeClass('btn-info');
                elem.removeClass('btn-warning');
                elem.removeClass('btn-danger');
              }

              removeAlertClasses();

              scope.$watchCollection(function() {
                return mnNotify.get();
              }, function(newValue) {
                if(newValue.length === 0) {
                  element.addClass('hidden');
                  scope.popoverOpened = false;
                }
                else {
                  element.removeClass('hidden');
                  removeAlertClasses();
                  elem.addClass('btn-' + mnNotify.getMostCriticalMessageType());
                }
              });

              scope.clearNotif = function(notif, $event) {
                notif.clear();
              };

              transclusionFn(function(clone) {
                if(clone.length > 0) {
                  elem.empty();
                  clone.addClass('popovr-trigger');
                  elem.append(clone);
                }
              });
              $compile(elem)(scope);
            }
          };
        }
      };
    }
  ]);

angular.module('mohican').directive('popoverElem', [function() {
    return {
        link: function(scope, element, attrs) {
          element.on('click', function() {
            element.addClass('popovr-trigger');
          });
        }
    };
}]);

angular.module('mohican').directive('popoverClose', ['$timeout', 'mnNotify', function($timeout, mnNotify) {
  return{
    link: function(scope, element, attrs) {
      function closeTrigger(trigger, i) {
        $timeout(function() {
          angular.element('#'+trigger[0].id).triggerHandler('click');
          angular.element('#'+trigger[0].id).removeClass('popovr-trigger');
        });
      }

      element.on('click', function(event) {
        var trigger = document.getElementsByClassName('popovr-trigger'),
            etarget = angular.element(event.target),
            tlength = trigger.length;

        if(!etarget.hasClass('popovr-trigger') && !etarget.hasClass('popoverStayOpened')) {
          for(var i = 0; i < tlength; i++) {
            closeTrigger(trigger, i);
          }
        }
        else {
          if(mnNotify.get().length === 0) {
            for(var i = 0; i < tlength; i++) {
              closeTrigger(trigger, i);
            }
          }
        }
      });
    }
  };
}]);
