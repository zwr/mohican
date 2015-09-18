//= require ./template
//= require_self

angular.module('mohican')
  .directive('mnsButton', ['$compile', function($compile) {
      'use strict';
      return {
        restrict: 'A',

        scope:      true,
        transclude: true,

        templateUrl: 'mohican/directives/mns-button/template.html',

        compile: function compile(element, attrs) {
          element.attr('popover-placement', 'bottom');
          element.attr('popover-title', 'Notifications');

          element.attr('popover-template', '"mnPopoverTpl.html"');
          element.removeAttr('mns-button');
          return {
            post: function postLink(scope, iElement, iAttrs, controller, transclusionFn) {
              transclusionFn(function(clone) {
                iElement.append(clone);
              });
              $compile(iElement)(scope);
            }
          };
        }
      };
    }
  ]);
