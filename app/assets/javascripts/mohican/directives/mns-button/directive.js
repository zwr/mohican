//= require ./template
//= require_self

//TODO: there can be only one instance because
//of possible template's <script> ids collision

(function(mohican) {
  'use strict';

  var attributesList = [
    {
      name:  'popover-placement',
      value: 'bottom'
    },
    {
      name:  'popover-title',
      value: 'Notifications'
    },
    {
      name:  'popover-template',
      value: '"mnPopoverTpl.html"'
    },
    {
      name:  'popover-animation',
      value: 'false'
    },
    {
      name:  'id',
      value: 'btnNotif'
    },
    {
      name:  'popover-elem',
      value: 'true'
    }
  ];

  var alertClasses = [
    'btn-success',
    'btn-info',
    'btn-warning',
    'btn-danger'
  ];

  angular.module('mohican')
    .directive('mnsButton', ['$compile', 'mnNotify', function($compile, mnNotify) {
        return {
          restrict:    'A',
          transclude:  true,
          templateUrl: 'mohican/directives/mns-button/template.html',

          compile: function compile(element, attrs) {
            for (var i = 0; i < attributesList.length; i++) {
              if(!element.attr(attributesList[i].name)) {
                element.attr(attributesList[i].name, attributesList[i].value);
              }
            }

            element.removeAttr('mns-button');

            return {
              post: function postLink(scope, elem, attrs, controller, transclusionFn) {
                scope.mnNotify = mnNotify;

                function removeAlertClasses() {
                  alertClasses.forEach(function(klass) {
                    elem.removeClass(klass);
                  });
                }

                removeAlertClasses();

                scope.$watchCollection(function() {
                  return mnNotify.get();
                }, function(newValue) {
                  if(newValue.length === 0) {
                    element.addClass('hidden');
                  }
                  else {
                    element.removeClass('hidden');
                    removeAlertClasses();
                    elem.addClass('btn-' + mnNotify.getMostCriticalMessageType());
                  }
                });

                transclusionFn(function(clone) {
                  if(clone.length > 0) {
                    elem.empty();
                    clone.addClass('popover-trigger-element');
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
              element.addClass('popover-trigger-element');
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
            angular.element('#'+trigger[0].id).removeClass('popover-trigger-element');
          });
        }

        element.on('click', function(event) {
          var trigger = document.getElementsByClassName('popover-trigger-element'),
              etarget = angular.element(event.target),
              tlength = trigger.length;

          if(!etarget.hasClass('popover-trigger-element') && !etarget.hasClass('popover-stay-opened')) {
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

})(window.mohican);
