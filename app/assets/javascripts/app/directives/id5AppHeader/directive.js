//= require ./template
//= require ./controller
//= require_self

angular.module('id5.directives')
  .directive('id5AppHeader', [function() {
      'use strict';
      return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'app/directives/id5AppHeader/template.html',
        controller: 'AppHeaderController',
        controllerAs: 'vm',
        bindToController: true,
      };
    },
  ]);
