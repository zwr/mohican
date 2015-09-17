//= require ./template
//= require_self

angular.module('mohican')
  .directive('mnsButton', ['$sce', '$compile', '$templateCache', 'mnNotify', function($sce, $compile, $templateCache, mnNotify) {
      'use strict';
      return {
        restrict: 'A',

        scope: true,

        transclude: true,

        templateUrl: 'mohican/directives/mns-button/template.html',

        compile: function compile(element, attrs) {
          // element.attr('popover-placement', 'bottom');
          // element.attr('popover-title', 'Notifications');
          // var tmpl = $templateCache.get('mohican/directives/mns-button/template.html');
          // console.log($sce.trustAsHtml(tmpl));
          // var trustHtml = $sce.trustAsHtml(tmpl);
          // element.attr('popover-template', 'mnPopoverTpl.html');
          element.removeAttr('mns-button');
          return {
            pre: function preLink(scope, iElement, iAttrs, controller) {
              scope.notifications = [1, 2, 3];
            },
            post: function postLink(scope, iElement, iAttrs, controller) {
              $compile(iElement)(scope);
            }
          };
        }
      };
    }
  ]);
