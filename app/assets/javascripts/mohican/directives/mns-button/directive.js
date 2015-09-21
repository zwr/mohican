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

        compile: function compile(element, attrs) {
          if(!element.attr('popover-placement')) {
            element.attr('popover-placement', 'bottom');
          }
          if(!element.attr('popover-title', 'Notifications')) {
            element.attr('popover-title', 'Notifications');
          }
          if(!element.attr('popover-template', '"mnPopoverTpl.html"')) {
            element.attr('popover-template', '"mnPopoverTpl.html"');
          }

          element.removeAttr('mns-button');

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
                removeAlertClasses();
                elem.addClass('btn-' + mnNotify.getMostCriticalMessageType());
              });

              scope.showDefaultContent = true;
              transclusionFn(function(clone) {
                if(clone.length > 0) {
                  scope.showDefaultContent = false;
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
