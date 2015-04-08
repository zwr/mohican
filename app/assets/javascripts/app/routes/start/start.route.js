//= require angular
//= require includes/angular-ui-router
//= require ./start.controller
//= require app/routes/base.route

(function() {
  'use strict';
  angular.module('startRouteModule', [
    'ui.router',
    'baseRouteModule',
    'startRouteModule',
    'startControllerModule',
  ]).
  config(['$stateProvider',
    function startRoute($stateProvider) {
      $stateProvider.state('base.start', {
        url: '/',
        template: '<div>{{start.echo}}</div>',
        controller: 'StartController',
        controllerAs: 'start',
      });
    },
  ]);
})();
