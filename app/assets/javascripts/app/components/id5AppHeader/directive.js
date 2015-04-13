//= require ./template
//= require ./controller

angular.module('mnAppHeaderModule', [
    'templates',
    'appHeaderControllerModule',
  ])
  .directive('id5AppHeader', [function() {
      'use strict';
      return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'app/components/id5AppHeader/template.html',
        controller: 'AppHeaderController',
        controllerAs: 'vm',
        bindToController: true,
      };
    },
  ]);
