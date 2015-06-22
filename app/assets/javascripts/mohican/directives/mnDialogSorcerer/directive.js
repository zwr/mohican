//= require ./template
//= require_self
(function(mohican) {
  'use strict';
  angular.module('mohican.directives')
    .directive('mnDialogSorcerer', [function() {
        return {
          restrict:     'E',
          templateUrl:  'mohican/directives/mnDialogSorcerer/template.html',
          link: function(scope, element, attrs, ctrl) {
          }
        };
      }
    ]);
}(window.mohican));