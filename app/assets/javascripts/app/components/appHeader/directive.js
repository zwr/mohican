//= require angular
//= require angular-rails-templates
//= require ./template
//= require ./controller

angular.module('mnAppHeaderModule', [
    'templates',
    'appHeaderControllerModule',
  ])
  .directive('mnAppHeader', [function() {
      'use strict';
      return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'app/components/appHeader/template.html',
        controller: 'AppHeaderController',
        controllerAs: 'vm',
        bindToController: true,
      };
    },
  ]);
