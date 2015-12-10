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

  var alertTypes = [
    'success',
    'info',
    'warning',
    'danger'
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
            element.addClass('mns-button');

            return {
              post: function postLink(scope, elem, linkAttrs, controller, transclusionFn) {
                scope.mnNotify = mnNotify;

                function removeAlertClasses() {
                  alertTypes.forEach(function(type) {
                    elem.removeClass('btn-' + type);
                  });
                }

                removeAlertClasses();

                scope.$watchCollection(function() {
                  return mnNotify.get();
                }, function(newValue) {
                  if(newValue.length === 1) {
                    scope.buttonCaption = newValue[0].message;
                  }
                  else {
                    var messageSummary = [];
                    alertTypes.forEach(function(type) {
                      var count = mnNotify.countByMessageType(type);
                      if(count > 0) {
                        messageSummary.push(type + '(s): ' + count);
                      }
                    });
                    scope.buttonCaption = messageSummary.join(', ');
                    if(linkAttrs.mnsButton !== '' &&
                       scope.buttonCaption.length > linkAttrs.mnsButton) {
                         scope.buttonCaption = 'messages: ' + newValue.length;
                    }
                  }

                  if(newValue.length === 0) {
                    elem.addClass('hidden');
                  }
                  else {
                    elem.removeClass('hidden');
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
        scope.isOpened = false;
        function closeTrigger(trigger, i) {
          if(scope.isOpened) {
            scope.isOpened = false;
            $timeout(function() {
              angular.element('#'+trigger[0].id).triggerHandler('click');
              angular.element('#'+trigger[0].id).removeClass('popover-trigger-element');
            });
          }
        }

        element.on('click', function(event) {
          var trigger = document.getElementsByClassName('popover-trigger-element');
          var etarget = angular.element(event.target);
          var tlength = trigger.length;

          if(!etarget.hasClass('popover-trigger-element') &&
             !(etarget.hasClass('popover-stay-opened') ||
               etarget.hasClass('popover-title') ||
               etarget.hasClass('popover-content') ||
               etarget.hasClass('notifications-holder'))
            ) {
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
            else {
              scope.isOpened = !scope.isOpened;
            }
          }
        });
      }
    };
  }]);

})(window.mohican);
