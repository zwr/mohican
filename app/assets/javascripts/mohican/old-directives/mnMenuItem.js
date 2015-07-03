angular.module('mnOldDirectives')
  .directive('mnMenuItem', [function() {
      'use strict';
      return {
        restrict: 'E',
        transclude: true,
        template: '<li class="navbar-text" ng-transclude />',
      };
    },
  ]);
