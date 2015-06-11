//= require ./template
//= require ./controller
//= require_self
(function(mohican) {
  'use strict';
  angular.module('mohican.directives')
    .directive('mnFilterBar', [function() {
        return {
          scope: {
            owner: '=?'
          },
          restrict:     'E',
          templateUrl:  'mohican/directives/mnFilterBar/template.html',
          controller:   'MnFilterBarController',
          controllerAs: 'filterBar',

          bindToController: true,

          link: function(scope, element, attrs, ctrl) {
            ctrl.owner = scope.owner = mohican.scopeLookup(scope);
          }
        };
      }
    ]);
}(window.mohican));
