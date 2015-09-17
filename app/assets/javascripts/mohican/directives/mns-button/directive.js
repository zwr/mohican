//= require_self

angular.module('mohican')
  .directive('mnsButton', ['$compile', function($compile) {
      'use strict';
      return {
        restrict: 'A',
        replace:  false,
        terminal: true,
        priority: 1000,
        compile:  function compile(element, attrs) {
          element.attr('popover-placement', 'bottom');
          element.attr('popover-title', 'Notifications');
          element.attr('popover-template', '"myPopoverTemplate.html"');
          element.removeAttr('mns-button');
          return {
            pre:  function preLink(scope, iElement, iAttrs, controller) {  },
            post: function postLink(scope, iElement, iAttrs, controller) {
              $compile(iElement)(scope);
            }
          };
        }
      };
    }
  ]);
